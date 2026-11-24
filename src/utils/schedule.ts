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

/**
 * Gera os horários disponíveis para uma data com base na configuração central.
 * Respeita rigorosamente abertura, fechamento, domingos fechados e horário atual se for hoje.
 */
export function getAvailableTimeSlots(dateIso: string): string[] {
  if (!dateIso) return [];
  const date = parseIsoDate(dateIso);
  if (!isDateSelectable(date)) return [];

  const dayConfig = CLINIC_CONFIG.schedule.weeklyHours[date.getDay()];
  if (!dayConfig || !dayConfig.open || !dayConfig.start || !dayConfig.end) {
    return [];
  }

  const startMin = parseMinutes(dayConfig.start);
  const endMin = parseMinutes(dayConfig.end) - CLINIC_CONFIG.schedule.lastSlotBeforeCloseMinutes;
  const interval = CLINIC_CONFIG.schedule.slotIntervalMinutes;

  const now = new Date();
  const isToday = formatIsoDate(now) === dateIso;
  const currentMinutesWithBuffer = now.getHours() * 60 + now.getMinutes() + 30;

  const slots: string[] = [];
  for (let t = startMin; t <= endMin; t += interval) {
    if (isToday && t < currentMinutesWithBuffer) {
      continue;
    }
    slots.push(formatMinutes(t));
  }

  return slots;
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
