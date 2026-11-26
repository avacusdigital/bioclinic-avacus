import { CLINIC_CONFIG } from '../config/clinic';

export interface BookingData {
  name: string;
  email: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  dateIso: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm
}

export interface SavedPersonalData {
  name: string;
  email: string;
  phone: string;
}

export interface TimeSlotOption {
  time: string;
  available: boolean;
  reason?: 'past' | 'unavailable';
}

export interface CustomTimeValidation {
  valid: boolean;
  normalized?: string;
  error?: string;
}

const PERSONAL_DATA_STORAGE_KEY = 'bioclinic_booking_personal_v1';

export function loadSavedPersonalData(): SavedPersonalData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(PERSONAL_DATA_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedPersonalData>;
    const name = typeof parsed.name === 'string' ? parsed.name : '';
    const email = typeof parsed.email === 'string' ? parsed.email : '';
    const phone = typeof parsed.phone === 'string' ? parsed.phone : '';
    if (!name && !email && !phone) return null;
    return { name, email, phone };
  } catch {
    return null;
  }
}

export function savePersonalData(data: SavedPersonalData): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      PERSONAL_DATA_STORAGE_KEY,
      JSON.stringify({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
      }),
    );
  } catch {
    // Armazenamento indisponível em modo restrito
  }
}

export function formatIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getTodayMidnight(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function isSundayDate(date: Date): boolean {
  return date.getDay() === 0;
}

export function isPastDate(date: Date): boolean {
  const today = getTodayMidnight();
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return target.getTime() < today.getTime();
}

export function isBlockedDate(date: Date): boolean {
  const iso = formatIsoDate(date);
  return (CLINIC_CONFIG.schedule.blockedDates as readonly string[]).includes(iso);
}

export function isDateSelectable(date: Date): boolean {
  if (isPastDate(date)) return false;
  if (isSundayDate(date)) return false;
  if (isBlockedDate(date)) return false;
  const dayConfig = CLINIC_CONFIG.schedule.weeklyHours[date.getDay()];
  return Boolean(dayConfig && dayConfig.open);
}

function parseMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function formatMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function getConfiguredUnavailableSlots(dateIso: string, dayOfWeek: number): Set<string> {
  const byDate =
    (CLINIC_CONFIG.schedule.unavailableSlotsByDate as Record<string, string[]>)[dateIso] ?? [];
  const weekly =
    (CLINIC_CONFIG.schedule.unavailableSlotsWeekly as Record<number, string[]>)[dayOfWeek] ?? [];
  return new Set([...byDate, ...weekly]);
}

/**
 * Retorna todos os horários padrão do expediente do dia, identificando claramente
 * os horários disponíveis e os indisponíveis (passados ou bloqueados) para exibição com X.
 */
export function getDayTimeSlotsWithStatus(dateIso: string): TimeSlotOption[] {
  if (!dateIso) return [];
  const date = parseIsoDate(dateIso);
  if (!isDateSelectable(date)) return [];

  const dayOfWeek = date.getDay();
  const dayConfig = CLINIC_CONFIG.schedule.weeklyHours[dayOfWeek];
  if (!dayConfig || !dayConfig.open || !dayConfig.start || !dayConfig.end) {
    return [];
  }

  const startMin = parseMinutes(dayConfig.start);
  const endMin = parseMinutes(dayConfig.end) - CLINIC_CONFIG.schedule.lastSlotBeforeCloseMinutes;
  const interval = CLINIC_CONFIG.schedule.slotIntervalMinutes;

  const now = new Date();
  const isToday = formatIsoDate(now) === dateIso;
  const currentMinutesWithBuffer = now.getHours() * 60 + now.getMinutes() + 30;
  const configuredBlocked = getConfiguredUnavailableSlots(dateIso, dayOfWeek);

  const slots: TimeSlotOption[] = [];
  for (let t = startMin; t <= endMin; t += interval) {
    const label = formatMinutes(t);
    if (configuredBlocked.has(label)) {
      slots.push({ time: label, available: false, reason: 'unavailable' });
    } else if (isToday && t < currentMinutesWithBuffer) {
      slots.push({ time: label, available: false, reason: 'past' });
    } else {
      slots.push({ time: label, available: true });
    }
  }

  return slots;
}

/**
 * Retorna somente a lista de horários disponíveis (compatível com verificações simples).
 */
export function getAvailableTimeSlots(dateIso: string): string[] {
  return getDayTimeSlotsWithStatus(dateIso)
    .filter((s) => s.available)
    .map((s) => s.time);
}

/**
 * Valida um horário personalizado informado manualmente pelo visitante.
 * Impede horários fora do expediente, horários passados e qualquer horário identificado com X (indisponível).
 */
export function validateCustomTimeSlot(dateIso: string, rawTime: string): CustomTimeValidation {
  if (!dateIso) {
    return { valid: false, error: 'Selecione uma data antes de informar um horário.' };
  }

  const cleaned = rawTime.trim();
  const match = /^(\d{1,2}):(\d{2})$/.exec(cleaned);
  if (!match) {
    return {
      valid: false,
      error: 'Informe o horário no formato válido HH:mm (ex.: 10:15 ou 15:45).',
    };
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return { valid: false, error: 'O horário informado não é válido.' };
  }

  const normalized = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  const date = parseIsoDate(dateIso);
  if (!isDateSelectable(date)) {
    return { valid: false, error: 'A data selecionada não está disponível para agendamento.' };
  }

  const dayOfWeek = date.getDay();
  const dayConfig = CLINIC_CONFIG.schedule.weeklyHours[dayOfWeek];
  if (!dayConfig || !dayConfig.open || !dayConfig.start || !dayConfig.end) {
    return { valid: false, error: 'A clínica não realiza atendimentos neste dia.' };
  }

  const requestedMin = hours * 60 + minutes;
  const startMin = parseMinutes(dayConfig.start);
  const lastAllowedMin =
    parseMinutes(dayConfig.end) - CLINIC_CONFIG.schedule.lastSlotBeforeCloseMinutes;

  if (requestedMin < startMin || requestedMin > lastAllowedMin) {
    return {
      valid: false,
      error: `O horário ${normalized} não está disponível. Nosso atendimento neste dia é de ${dayConfig.label} (último horário às ${formatMinutes(lastAllowedMin)}).`,
    };
  }

  // Impede contornar qualquer horário identificado com X (indisponível) na grade do dia
  const daySlots = getDayTimeSlotsWithStatus(dateIso);
  const matchingUnavailable = daySlots.find((s) => s.time === normalized && !s.available);
  if (matchingUnavailable) {
    return {
      valid: false,
      error: `O horário ${normalized} não está disponível nesta data. Por favor, informe outro horário.`,
    };
  }

  const now = new Date();
  const isToday = formatIsoDate(now) === dateIso;
  const currentMinutesWithBuffer = now.getHours() * 60 + now.getMinutes() + 30;
  if (isToday && requestedMin < currentMinutesWithBuffer) {
    return {
      valid: false,
      error: `O horário ${normalized} não está mais disponível para hoje. Informe um horário posterior ou escolha outra data.`,
    };
  }

  return { valid: true, normalized };
}

export function formatDisplayDatePtBr(dateIso: string): string {
  if (!dateIso) return '';
  const date = parseIsoDate(dateIso);
  const formatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatShortDatePtBr(dateIso: string): string {
  if (!dateIso) return '';
  const [y, m, d] = dateIso.split('-');
  return `${d}/${m}/${y}`;
}

export function formatBrazilPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function isValidBrazilPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
}

/**
 * Monta a mensagem formatada em negrito no padrão WhatsApp exatamente como especificado.
 */
export function buildWhatsAppBookingMessage(data: BookingData): string {
  const dateDisplay = `${formatShortDatePtBr(data.dateIso)} (${formatDisplayDatePtBr(data.dateIso)})`;
  return [
    'Olá! Gostaria de realizar um agendamento.',
    '',
    '*INFORMAÇÕES DO AGENDAMENTO*',
    '',
    `*Nome:* ${data.name.trim()}`,
    `*E-mail:* ${data.email.trim()}`,
    `*Telefone:* ${data.phone.trim()}`,
    `*Procedimento:* ${data.serviceName}`,
    `*Data:* ${dateDisplay}`,
    `*Horário:* ${data.timeSlot}`,
    '',
    'Aguardo a confirmação. Obrigado(a)!',
  ].join('\n');
}

export function buildWhatsAppBookingUrl(data: BookingData): string {
  const message = buildWhatsAppBookingMessage(data);
  return `${CLINIC_CONFIG.contact.whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
}
