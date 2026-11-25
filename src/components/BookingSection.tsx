import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit3,
  Mail,
  Phone,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { CLINIC_CONFIG, SERVICES, ServiceItem } from '../config/clinic';
import {
  BookingData,
  buildWhatsAppBookingUrl,
  formatBrazilPhone,
  formatDisplayDatePtBr,
  formatIsoDate,
  formatShortDatePtBr,
  getAvailableTimeSlots,
  getTodayMidnight,
  isBlockedDate,
  isDateSelectable,
  isPastDate,
  isSundayDate,
  isValidBrazilPhone,
  isValidEmail,
} from '../utils/schedule';
import { WhatsAppIcon } from './BrandIcons';
import { Reveal } from './Reveal';

interface BookingSectionProps {
  preselectedService: ServiceItem | null;
  preselectNonce: number;
  onSyncSelectedService: (serviceId: string) => void;
}

const STEPS = [
  { number: 1, title: 'Dados Pessoais', short: 'Dados' },
  { number: 2, title: 'Procedimento', short: 'Procedimento' },
  { number: 3, title: 'Data', short: 'Data' },
  { number: 4, title: 'Horário', short: 'Horário' },
  { number: 5, title: 'Revisão e Envio', short: 'Revisão' },
] as const;

const WEEKDAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const BookingSection: React.FC<BookingSectionProps> = ({
  preselectedService,
  preselectNonce,
  onSyncSelectedService,
}) => {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [dateIso, setDateIso] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preselectNotice, setPreselectNotice] = useState<string>('');
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const [calendarMonth, setCalendarMonth] = useState<{ year: number; month: number }>(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  useEffect(() => {
    if (!preselectedService || preselectNonce === 0) return;
    setServiceId(preselectedService.id);
    setPreselectNotice(
      `Procedimento "${preselectedService.name}" selecionado para o seu agendamento.`,
    );
    setErrors((prev) => {
      const next = { ...prev };
      delete next.service;
      return next;
    });
    if (name.trim().length >= 3 && isValidEmail(email) && isValidBrazilPhone(phone)) {
      setStep(3);
    } else {
      setStep(1);
    }
  }, [preselectedService, preselectNonce]);

  const selectedService = useMemo(
    () => SERVICES.find((s) => s.id === serviceId) ?? null,
    [serviceId],
  );

  const availableSlots = useMemo(() => getAvailableTimeSlots(dateIso), [dateIso]);

  useEffect(() => {
    if (timeSlot && !availableSlots.includes(timeSlot)) {
      setTimeSlot('');
    }
  }, [availableSlots, timeSlot]);

  const facialServices = useMemo(() => SERVICES.filter((s) => s.category === 'facial'), []);
  const corporalServices = useMemo(() => SERVICES.filter((s) => s.category === 'corporal'), []);

  const calendarCells = useMemo(() => {
    const firstDay = new Date(calendarMonth.year, calendarMonth.month, 1);
    const daysInMonth = new Date(calendarMonth.year, calendarMonth.month + 1, 0).getDate();
    const startOffset = firstDay.getDay();

    const cells: Array<{ date: Date | null; iso: string }> = [];
    for (let i = 0; i < startOffset; i++) {
      cells.push({ date: null, iso: `empty-${i}` });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(calendarMonth.year, calendarMonth.month, day);
      cells.push({ date: d, iso: formatIsoDate(d) });
    }
    return cells;
  }, [calendarMonth]);

  const monthLabel = useMemo(() => {
    const d = new Date(calendarMonth.year, calendarMonth.month, 1);
    const text = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(d);
    return text.charAt(0).toUpperCase() + text.slice(1);
  }, [calendarMonth]);

  const today = getTodayMidnight();
  const minMonthKey = today.getFullYear() * 12 + today.getMonth();
  const maxMonthKey = minMonthKey + CLINIC_CONFIG.schedule.maxMonthsAhead;
  const currentMonthKey = calendarMonth.year * 12 + calendarMonth.month;

  const canGoPrevMonth = currentMonthKey > minMonthKey;
  const canGoNextMonth = currentMonthKey < maxMonthKey;

  const shiftMonth = (delta: number) => {
    const nextDate = new Date(calendarMonth.year, calendarMonth.month + delta, 1);
    const nextKey = nextDate.getFullYear() * 12 + nextDate.getMonth();
    if (nextKey < minMonthKey || nextKey > maxMonthKey) return;
    setCalendarMonth({ year: nextDate.getFullYear(), month: nextDate.getMonth() });
  };

  const validateStep = (targetStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (targetStep === 1) {
      if (name.trim().length < 3) {
        newErrors.name = 'Informe seu nome completo.';
      }
      if (!isValidEmail(email)) {
        newErrors.email = 'Informe um endereço de e-mail válido.';
      }
      if (!isValidBrazilPhone(phone)) {
        newErrors.phone = 'Informe um número de telefone/WhatsApp com DDD.';
      }
    }

    if (targetStep === 2) {
      if (!serviceId) {
        newErrors.service = 'Selecione o procedimento desejado para continuar.';
      }
    }

    if (targetStep === 3) {
      if (!dateIso) {
        newErrors.date = 'Escolha uma data disponível no calendário.';
      }
    }

    if (targetStep === 4) {
      if (!timeSlot) {
        newErrors.time = 'Selecione um dos horários disponíveis para o dia escolhido.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setStep((prev) => Math.min(5, prev + 1));
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleStepJump = (targetStep: number) => {
    if (targetStep < step) {
      setErrors({});
      setStep(targetStep);
      return;
    }
    for (let s = step; s < targetStep; s++) {
      if (!validateStep(s)) return;
    }
    setStep(targetStep);
  };

  const handleSelectProcedure = (item: ServiceItem) => {
    setServiceId(item.id);
    onSyncSelectedService(item.id);
    setPreselectNotice('');
    setErrors((prev) => {
      const next = { ...prev };
      delete next.service;
      return next;
    });
  };

  const handleSelectDate = (date: Date) => {
    if (!isDateSelectable(date)) return;
    setDateIso(formatIsoDate(date));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.date;
      return next;
    });
  };

  const handleSelectTime = (slot: string) => {
    setTimeSlot(slot);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.time;
      return next;
    });
  };

  const handleConfirmWhatsApp = () => {
    if (!validateStep(1)) {
      setStep(1);
      return;
    }
    if (!validateStep(2)) {
      setStep(2);
      return;
    }
    if (!validateStep(3)) {
      setStep(3);
      return;
    }
    if (!validateStep(4)) {
      setStep(4);
      return;
    }
    if (!selectedService) return;

    const payload: BookingData = {
      name,
      email,
      phone,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      dateIso,
      timeSlot,
    };

    const url = buildWhatsAppBookingUrl(payload);
    setSubmittedNotice(true);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const groupedSlots = useMemo(() => {
    const morning: string[] = [];
    const afternoon: string[] = [];
    const evening: string[] = [];
    availableSlots.forEach((slot) => {
      const hour = Number(slot.split(':')[0]);
      if (hour < 12) morning.push(slot);
      else if (hour < 18) afternoon.push(slot);
      else evening.push(slot);
    });
    return { morning, afternoon, evening };
  }, [availableSlots]);

  const selectedDaySchedule = useMemo(() => {
    if (!dateIso) return null;
    const [y, m, d] = dateIso.split('-').map(Number);
    const dayOfWeek = new Date(y, m - 1, d).getDay();
    return CLINIC_CONFIG.schedule.weeklyHours[dayOfWeek] ?? null;
  }, [dateIso]);

  return (
    <section
      id="agendamento"
      aria-labelledby="agendamento-heading"
      className="relative scroll-mt-16 overflow-hidden surface-nude-radial py-10 sm:py-12 lg:py-14"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho compacto no topo da seção */}
        <div className="mx-auto max-w-2xl text-center">
          <Reveal direction="up">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rosegold-dark">
              Reserve seu Momento
            </span>
            <h2
              id="agendamento-heading"
              className="mt-1 font-serif text-3xl font-semibold text-wine-800 sm:text-4xl lg:text-[2.6rem]"
            >
              Agendamento
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-wine-800/75">
              Preencha as etapas abaixo para montar sua solicitação de agendamento e enviá-la
              diretamente ao nosso WhatsApp.
            </p>
          </Reveal>
        </div>

        {/* Container interativo refinado */}
        <Reveal direction="up" delayMs={80}>
          <div className="mt-7 overflow-hidden rounded-[2rem] border border-rosegold/40 bg-ivory shadow-editorial">
            {/* Cabeçalho de Etapas + Progresso */}
            <div className="border-b border-rosegold/25 bg-gradient-to-r from-blush-50 via-blush-100/75 to-blush-50 px-4 py-4 sm:px-8">
              <ol aria-label="Etapas do agendamento" className="grid grid-cols-5 gap-2 sm:gap-4">
                {STEPS.map((s) => {
                  const isCurrent = step === s.number;
                  const isCompleted = step > s.number;
                  return (
                    <li key={s.number} className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => handleStepJump(s.number)}
                        aria-current={isCurrent ? 'step' : undefined}
                        className="group flex w-full flex-col items-center gap-1.5 rounded-xl py-1 transition-all focus-visible:rounded-xl"
                      >
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 sm:h-10 sm:w-10 sm:text-sm ${
                            isCurrent
                              ? 'scale-105 bg-wine-800 text-blush-50 shadow-soft-rose ring-4 ring-blush-200'
                              : isCompleted
                                ? 'bg-rosegold text-ivory shadow-sm group-hover:scale-105'
                                : 'border border-rosegold/45 bg-ivory text-wine-800/60 group-hover:border-wine-800/45 group-hover:bg-blush-100'
                          }`}
                        >
                          {isCompleted ? <Check className="h-4 w-4" /> : s.number}
                        </span>
                        <span
                          className={`text-center text-[10px] font-medium tracking-wide transition-colors sm:text-xs ${
                            isCurrent
                              ? 'font-semibold text-wine-800'
                              : isCompleted
                                ? 'text-rosegold-dark'
                                : 'text-wine-800/55'
                          }`}
                        >
                          <span className="hidden sm:inline">{s.title}</span>
                          <span className="sm:hidden">{s.short}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-blush-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rosegold via-rosegold-dark to-wine-800 transition-all duration-500 ease-out"
                  style={{ width: `${(step / STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Banner de pré-seleção */}
            {preselectNotice && (
              <div className="animate-step-in flex items-center justify-between gap-3 border-b border-rosegold/25 bg-blush-200/75 px-5 py-2.5 text-xs font-medium text-wine-800 sm:px-8">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 shrink-0 text-wine-700" aria-hidden="true" />
                  <span>{preselectNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreselectNotice('')}
                  aria-label="Fechar aviso"
                  className="rounded-full p-1 text-wine-800/70 transition-colors hover:bg-ivory/70"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Conteúdo da Etapa Ativa */}
            <div className="p-5 sm:p-7 lg:p-8">
              {/* ETAPA 01 — DADOS PESSOAIS */}
              {step === 1 && (
                <div key="step-1" className="animate-step-in">
                  <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rosegold-dark">
                        Etapa 01 de 05
                      </p>
                      <h3 className="mt-0.5 font-serif text-2xl font-semibold text-wine-800 sm:text-3xl">
                        Seus dados pessoais
                      </h3>
                    </div>
                    {selectedService && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-rosegold/40 bg-blush-100 px-3 py-1 text-[11px] font-semibold text-wine-800">
                        <Sparkles className="h-3 w-3 text-rosegold-dark" aria-hidden="true" />
                        {selectedService.name}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="booking-name"
                        className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-wine-800"
                      >
                        Nome completo *
                      </label>
                      <div className="relative">
                        <User
                          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rosegold-dark"
                          aria-hidden="true"
                        />
                        <input
                          id="booking-name"
                          type="text"
                          autoComplete="name"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors((p) => ({ ...p, name: '' }));
                          }}
                          placeholder="Digite seu nome completo"
                          aria-invalid={Boolean(errors.name)}
                          className={`w-full rounded-2xl border bg-blush-50/75 py-3 pl-11 pr-4 text-sm text-wine-800 placeholder:text-wine-800/40 transition-all duration-200 focus:bg-ivory focus:outline-none focus:ring-2 ${
                            errors.name
                              ? 'border-wine-600 focus:ring-wine-100'
                              : 'border-rosegold/40 focus:border-wine-800/50 focus:ring-blush-200'
                          }`}
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-wine-700">
                          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="booking-email"
                        className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-wine-800"
                      >
                        E-mail *
                      </label>
                      <div className="relative">
                        <Mail
                          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rosegold-dark"
                          aria-hidden="true"
                        />
                        <input
                          id="booking-email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors((p) => ({ ...p, email: '' }));
                          }}
                          placeholder="seuemail@exemplo.com"
                          aria-invalid={Boolean(errors.email)}
                          className={`w-full rounded-2xl border bg-blush-50/75 py-3 pl-11 pr-4 text-sm text-wine-800 placeholder:text-wine-800/40 transition-all duration-200 focus:bg-ivory focus:outline-none focus:ring-2 ${
                            errors.email
                              ? 'border-wine-600 focus:ring-wine-100'
                              : 'border-rosegold/40 focus:border-wine-800/50 focus:ring-blush-200'
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-wine-700">
                          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="booking-phone"
                        className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-wine-800"
                      >
                        Telefone / WhatsApp *
                      </label>
                      <div className="relative">
                        <Phone
                          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rosegold-dark"
                          aria-hidden="true"
                        />
                        <input
                          id="booking-phone"
                          type="tel"
                          autoComplete="tel"
                          inputMode="numeric"
                          value={phone}
                          onChange={(e) => {
                            setPhone(formatBrazilPhone(e.target.value));
                            if (errors.phone) setErrors((p) => ({ ...p, phone: '' }));
                          }}
                          placeholder="(98) 99999-9999"
                          aria-invalid={Boolean(errors.phone)}
                          className={`w-full rounded-2xl border bg-blush-50/75 py-3 pl-11 pr-4 text-sm text-wine-800 placeholder:text-wine-800/40 transition-all duration-200 focus:bg-ivory focus:outline-none focus:ring-2 ${
                            errors.phone
                              ? 'border-wine-600 focus:ring-wine-100'
                              : 'border-rosegold/40 focus:border-wine-800/50 focus:ring-blush-200'
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-wine-700">
                          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ETAPA 02 — PROCEDIMENTO */}
              {step === 2 && (
                <div key="step-2" className="animate-step-in">
                  <div className="mb-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rosegold-dark">
                      Etapa 02 de 05
                    </p>
                    <h3 className="mt-0.5 font-serif text-2xl font-semibold text-wine-800 sm:text-3xl">
                      Escolha o procedimento
                    </h3>
                  </div>

                  {errors.service && (
                    <div className="mb-4 flex items-center gap-2 rounded-2xl border border-wine-600/40 bg-wine-50 px-4 py-3 text-xs font-medium text-wine-800">
                      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {errors.service}
                    </div>
                  )}

                  <div>
                    <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-rosegold-dark">
                      Procedimentos Faciais
                    </p>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                      {facialServices.map((item) => {
                        const selected = serviceId === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectProcedure(item)}
                            aria-pressed={selected}
                            className={`group flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 active:scale-[0.98] ${
                              selected
                                ? 'scale-[1.015] border-wine-800 bg-wine-800 text-blush-50 shadow-soft-rose ring-2 ring-rosegold/40'
                                : 'border-rosegold/35 bg-blush-50/80 text-wine-800 hover:-translate-y-0.5 hover:border-wine-800/45 hover:bg-blush-100'
                            }`}
                          >
                            <span className="text-sm font-medium leading-snug">{item.name}</span>
                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                                selected
                                  ? 'scale-110 border-blush-200 bg-blush-200 text-wine-800'
                                  : 'border-rosegold/55 bg-ivory group-hover:border-wine-800/40'
                              }`}
                            >
                              {selected && <Check className="h-3 w-3" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-rosegold-dark">
                      Procedimentos Corporais
                    </p>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                      {corporalServices.map((item) => {
                        const selected = serviceId === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectProcedure(item)}
                            aria-pressed={selected}
                            className={`group flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 active:scale-[0.98] ${
                              selected
                                ? 'scale-[1.015] border-wine-800 bg-wine-800 text-blush-50 shadow-soft-rose ring-2 ring-rosegold/40'
                                : 'border-rosegold/35 bg-blush-100/75 text-wine-800 hover:-translate-y-0.5 hover:border-wine-800/45 hover:bg-blush-200/75'
                            }`}
                          >
                            <span className="text-sm font-medium leading-snug">{item.name}</span>
                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                                selected
                                  ? 'scale-110 border-blush-200 bg-blush-200 text-wine-800'
                                  : 'border-rosegold/55 bg-ivory group-hover:border-wine-800/40'
                              }`}
                            >
                              {selected && <Check className="h-3 w-3" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ETAPA 03 — DATA */}
              {step === 3 && (
                <div key="step-3" className="animate-step-in">
                  <div className="mb-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rosegold-dark">
                      Etapa 03 de 05
                    </p>
                    <h3 className="mt-0.5 font-serif text-2xl font-semibold text-wine-800 sm:text-3xl">
                      Selecione a data
                    </h3>
                  </div>

                  {errors.date && (
                    <div className="mb-4 flex items-center gap-2 rounded-2xl border border-wine-600/40 bg-wine-50 px-4 py-3 text-xs font-medium text-wine-800">
                      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {errors.date}
                    </div>
                  )}

                  <div className="grid gap-5 lg:grid-cols-12">
                    <div className="rounded-3xl border border-rosegold/35 bg-blush-50/75 p-4 sm:p-5 lg:col-span-8">
                      <div className="mb-4 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => shiftMonth(-1)}
                          disabled={!canGoPrevMonth}
                          aria-label="Mês anterior"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rosegold/40 bg-ivory text-wine-800 transition-all hover:bg-blush-200/80 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>

                        <h4 className="font-serif text-xl font-semibold text-wine-800 sm:text-2xl">
                          {monthLabel}
                        </h4>

                        <button
                          type="button"
                          onClick={() => shiftMonth(1)}
                          disabled={!canGoNextMonth}
                          aria-label="Próximo mês"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rosegold/40 bg-ivory text-wine-800 transition-all hover:bg-blush-200/80 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mb-1.5 grid grid-cols-7 gap-1.5 text-center">
                        {WEEKDAYS_PT.map((wd, idx) => (
                          <div
                            key={wd}
                            className={`py-1 text-[11px] font-semibold uppercase tracking-wider ${
                              idx === 0 ? 'text-red-700/85' : 'text-wine-800/70'
                            }`}
                          >
                            {wd}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1.5">
                        {calendarCells.map((cell) => {
                          if (!cell.date) {
                            return <div key={cell.iso} className="aspect-square" />;
                          }

                          const sunday = isSundayDate(cell.date);
                          const past = isPastDate(cell.date);
                          const blocked = isBlockedDate(cell.date);
                          const selectable = isDateSelectable(cell.date);
                          const isSelected = dateIso === cell.iso;
                          const isToday = formatIsoDate(today) === cell.iso;

                          return (
                            <button
                              key={cell.iso}
                              type="button"
                              disabled={!selectable}
                              onClick={() => handleSelectDate(cell.date!)}
                              aria-label={`${cell.date.getDate()} de ${monthLabel}${
                                sunday
                                  ? ' — Domingo fechado (indisponível)'
                                  : past
                                    ? ' — Data passada (indisponível)'
                                    : blocked
                                      ? ' — Indisponível'
                                      : ' — Disponível'
                              }`}
                              aria-pressed={isSelected}
                              className={`relative flex aspect-square flex-col items-center justify-center rounded-2xl text-sm font-medium transition-all duration-200 ${
                                isSelected
                                  ? 'scale-105 bg-wine-800 font-semibold text-blush-50 shadow-soft-rose ring-2 ring-rosegold'
                                  : sunday
                                    ? 'cursor-not-allowed border border-red-200 bg-red-50/90 text-red-500/85'
                                    : !selectable
                                      ? 'cursor-not-allowed bg-blush-100/45 text-wine-800/25'
                                      : 'border border-rosegold/30 bg-ivory text-wine-800 hover:-translate-y-0.5 hover:border-wine-800/45 hover:bg-blush-200/80 active:scale-95'
                              }`}
                            >
                              <span>{cell.date.getDate()}</span>
                              {sunday && (
                                <X className="mt-0.5 h-3 w-3 text-red-500" aria-hidden="true" />
                              )}
                              {isToday && !isSelected && selectable && (
                                <span
                                  aria-hidden="true"
                                  className="absolute bottom-1.5 h-1 w-1 rounded-full bg-rosegold-dark"
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-rosegold/20 pt-3.5 text-[11px] text-wine-800/75">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded-full bg-wine-800" />
                          Selecionada
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded-full border border-rosegold/45 bg-ivory" />
                          Disponível
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-red-700">
                          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-red-200 bg-red-50">
                            <X className="h-2.5 w-2.5 text-red-500" />
                          </span>
                          Domingo (fechado)
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between gap-4 rounded-3xl border border-rosegold/30 bg-blush-100/65 p-5 lg:col-span-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-rosegold-dark">
                          <CalendarDays className="h-4 w-4" aria-hidden="true" />
                          <span>Funcionamento</span>
                        </div>
                        <ul className="mt-3.5 space-y-2.5 text-sm">
                          {CLINIC_CONFIG.schedule.summaryLines.map((line) => (
                            <li
                              key={line.days}
                              className="flex items-center justify-between border-b border-rosegold/20 pb-2 last:border-none"
                            >
                              <span className="font-medium text-wine-800">{line.days}</span>
                              <span
                                className={
                                  line.hours === 'Fechado'
                                    ? 'font-semibold text-red-700'
                                    : 'text-wine-800/80'
                                }
                              >
                                {line.hours}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-rosegold/35 bg-ivory p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rosegold-dark">
                          Data selecionada
                        </p>
                        {dateIso ? (
                          <p className="animate-step-in mt-1 font-serif text-lg font-semibold leading-snug text-wine-800">
                            {formatDisplayDatePtBr(dateIso)}
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-wine-800/60">
                            Escolha um dia disponível no calendário.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ETAPA 04 — HORÁRIO */}
              {step === 4 && (
                <div key="step-4" className="animate-step-in">
                  <div className="mb-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rosegold-dark">
                      Etapa 04 de 05
                    </p>
                    <h3 className="mt-0.5 font-serif text-2xl font-semibold text-wine-800 sm:text-3xl">
                      Escolha o horário
                    </h3>
                    <p className="mt-1 text-sm text-wine-800/75">
                      {formatDisplayDatePtBr(dateIso)}
                      {selectedDaySchedule ? ` · Expediente: ${selectedDaySchedule.label}` : ''}
                    </p>
                  </div>

                  {errors.time && (
                    <div className="mb-4 flex items-center gap-2 rounded-2xl border border-wine-600/40 bg-wine-50 px-4 py-3 text-xs font-medium text-wine-800">
                      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {errors.time}
                    </div>
                  )}

                  {availableSlots.length === 0 ? (
                    <div className="rounded-3xl border border-rosegold/35 bg-blush-100/75 p-7 text-center">
                      <Clock className="mx-auto h-8 w-8 text-rosegold-dark" aria-hidden="true" />
                      <p className="mt-3 font-serif text-2xl font-semibold text-wine-800">
                        Não há mais horários disponíveis para hoje
                      </p>
                      <p className="mt-1.5 text-sm text-wine-800/75">
                        Volte à etapa anterior e selecione a próxima data disponível.
                      </p>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="btn-secondary mt-5"
                      >
                        Escolher outra data
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {[
                        { label: 'Manhã', slots: groupedSlots.morning },
                        { label: 'Tarde', slots: groupedSlots.afternoon },
                        { label: 'Final de tarde / Noite', slots: groupedSlots.evening },
                      ]
                        .filter((g) => g.slots.length > 0)
                        .map((group) => (
                          <div key={group.label}>
                            <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-rosegold-dark">
                              {group.label}
                            </p>
                            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 md:grid-cols-6">
                              {group.slots.map((slot) => {
                                const selected = timeSlot === slot;
                                return (
                                  <button
                                    key={slot}
                                    type="button"
                                    onClick={() => handleSelectTime(slot)}
                                    aria-pressed={selected}
                                    className={`rounded-2xl border py-2.5 text-center text-sm font-semibold transition-all duration-250 active:scale-95 ${
                                      selected
                                        ? 'scale-105 border-wine-800 bg-wine-800 text-blush-50 shadow-soft-rose ring-2 ring-rosegold/50'
                                        : 'border-rosegold/35 bg-blush-50/80 text-wine-800 hover:-translate-y-0.5 hover:border-wine-800/45 hover:bg-blush-200/80'
                                    }`}
                                  >
                                    {slot}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}

                      <p className="text-xs text-wine-800/65">
                        Os horários seguem o expediente da clínica e a confirmação final é realizada
                        pela equipe no WhatsApp.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ETAPA 05 — REVISÃO E ENVIO */}
              {step === 5 && (
                <div key="step-5" className="animate-step-in">
                  <div className="mb-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rosegold-dark">
                      Etapa 05 de 05
                    </p>
                    <h3 className="mt-0.5 font-serif text-2xl font-semibold text-wine-800 sm:text-3xl">
                      Revise sua solicitação
                    </h3>
                  </div>

                  <div className="rounded-3xl border border-rosegold/35 bg-gradient-to-br from-blush-50 via-ivory to-blush-100/75 p-5 shadow-soft-rose sm:p-6">
                    <dl className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <div className="rounded-2xl border border-rosegold/25 bg-ivory p-3.5">
                        <div className="flex items-center justify-between">
                          <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rosegold-dark">
                            Nome
                          </dt>
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-wine-800/70 transition-colors hover:bg-blush-100 hover:text-wine-800"
                          >
                            <Edit3 className="h-3 w-3" /> Editar
                          </button>
                        </div>
                        <dd className="mt-1 text-sm font-semibold text-wine-800">{name}</dd>
                      </div>

                      <div className="rounded-2xl border border-rosegold/25 bg-ivory p-3.5">
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rosegold-dark">
                          E-mail
                        </dt>
                        <dd className="mt-1 break-all text-sm font-semibold text-wine-800">
                          {email}
                        </dd>
                      </div>

                      <div className="rounded-2xl border border-rosegold/25 bg-ivory p-3.5">
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rosegold-dark">
                          Telefone / WhatsApp
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-wine-800">{phone}</dd>
                      </div>

                      <div className="rounded-2xl border border-rosegold/25 bg-ivory p-3.5">
                        <div className="flex items-center justify-between">
                          <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rosegold-dark">
                            Procedimento
                          </dt>
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-wine-800/70 transition-colors hover:bg-blush-100 hover:text-wine-800"
                          >
                            <Edit3 className="h-3 w-3" /> Alterar
                          </button>
                        </div>
                        <dd className="mt-1 font-serif text-lg font-semibold text-wine-800">
                          {selectedService?.name}
                        </dd>
                      </div>

                      <div className="rounded-2xl border border-rosegold/25 bg-ivory p-3.5">
                        <div className="flex items-center justify-between">
                          <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rosegold-dark">
                            Data
                          </dt>
                          <button
                            type="button"
                            onClick={() => setStep(3)}
                            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-wine-800/70 transition-colors hover:bg-blush-100 hover:text-wine-800"
                          >
                            <Edit3 className="h-3 w-3" /> Alterar
                          </button>
                        </div>
                        <dd className="mt-1 text-sm font-semibold text-wine-800">
                          {formatShortDatePtBr(dateIso)}{' '}
                          <span className="block text-xs font-normal text-wine-800/70">
                            {formatDisplayDatePtBr(dateIso)}
                          </span>
                        </dd>
                      </div>

                      <div className="rounded-2xl border border-rosegold/25 bg-ivory p-3.5">
                        <div className="flex items-center justify-between">
                          <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rosegold-dark">
                            Horário
                          </dt>
                          <button
                            type="button"
                            onClick={() => setStep(4)}
                            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-wine-800/70 transition-colors hover:bg-blush-100 hover:text-wine-800"
                          >
                            <Edit3 className="h-3 w-3" /> Alterar
                          </button>
                        </div>
                        <dd className="mt-1 font-serif text-xl font-semibold text-wine-800">
                          {timeSlot}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-4 rounded-2xl border border-rosegold/30 bg-blush-200/60 px-4 py-3 text-xs leading-relaxed text-wine-800/85">
                      <strong>Importante:</strong> Este formulário encaminha sua solicitação de
                      agendamento para o WhatsApp oficial da clínica (
                      {CLINIC_CONFIG.contact.whatsappDisplay}). A confirmação do horário é realizada
                      manualmente pela nossa equipe.
                    </div>

                    {submittedNotice && (
                      <div className="animate-step-in mt-3.5 flex items-center gap-2.5 rounded-2xl border border-rosegold/45 bg-blush-100 px-4 py-3 text-xs font-medium text-wine-800">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-wine-800" />
                        <span>
                          Sua solicitação foi preparada e aberta no WhatsApp. Caso a janela não
                          tenha aberto automaticamente, clique novamente em &ldquo;Agendar
                          agora&rdquo;.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Rodapé de navegação entre etapas */}
              <div className="mt-6 flex flex-col-reverse items-center justify-between gap-3 border-t border-rosegold/20 pt-5 sm:flex-row">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn-secondary w-full sm:w-auto"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    <span>Voltar</span>
                  </button>
                ) : (
                  <p className="text-xs text-wine-800/60">
                    * Campos obrigatórios para envio da solicitação.
                  </p>
                )}

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-primary w-full sm:w-auto"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmWhatsApp}
                    className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-wine-800 px-8 py-3.5 text-sm font-semibold tracking-wide text-blush-50 shadow-editorial transition-all duration-300 hover:-translate-y-0.5 hover:bg-wine-700 hover:shadow-card-hover active:scale-[0.98] sm:w-auto"
                  >
                    <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
                    <span>Agendar agora</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
