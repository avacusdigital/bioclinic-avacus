import React, { useState } from 'react';
import { ArrowUpRight, CalendarCheck2, Sparkles } from 'lucide-react';
import { SERVICES, ServiceCategory, ServiceItem } from '../config/clinic';
import { Reveal } from './Reveal';

interface ServicesSectionProps {
  selectedServiceId: string;
  onSelectService: (service: ServiceItem) => void;
}

type FilterOption = 'all' | ServiceCategory;

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  selectedServiceId,
  onSelectService,
}) => {
  const [filter, setFilter] = useState<FilterOption>('all');

  const facialServices = SERVICES.filter((s) => s.category === 'facial');
  const corporalServices = SERVICES.filter((s) => s.category === 'corporal');

  const showFacial = filter === 'all' || filter === 'facial';
  const showCorporal = filter === 'all' || filter === 'corporal';

  const handleCardAction = (service: ServiceItem) => {
    onSelectService(service);
    const target = document.getElementById('agendamento');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="servicos"
      aria-labelledby="servicos-heading"
      className="relative bg-ivory py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Seção */}
        <div className="mx-auto max-w-3xl text-center">
          <Reveal direction="up">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-rosegold-dark">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Nossos Procedimentos</span>
            </span>
            <h2
              id="servicos-heading"
              className="mt-3 font-serif text-4xl font-semibold text-wine-800 sm:text-5xl"
            >
              Serviços
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-wine-800/75 sm:text-base">
              Procedimentos faciais e corporais conduzidos com atenção individualizada. Selecione o
              procedimento de seu interesse para iniciar a solicitação de agendamento.
            </p>
          </Reveal>

          {/* Filtro elegante por categoria */}
          <Reveal direction="up" delayMs={100}>
            <div
              role="tablist"
              aria-label="Filtrar categoria de procedimentos"
              className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-rosegold/30 bg-blush-100/80 p-1.5"
            >
              {(
                [
                  { key: 'all', label: `Todos (${SERVICES.length})` },
                  { key: 'facial', label: `Procedimentos Faciais (${facialServices.length})` },
                  { key: 'corporal', label: `Procedimentos Corporais (${corporalServices.length})` },
                ] as { key: FilterOption; label: string }[]
              ).map((tab) => {
                const active = filter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(tab.key)}
                    className={`rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-all duration-300 sm:px-5 sm:text-[13px] ${
                      active
                        ? 'bg-wine-800 text-blush-50 shadow-sm'
                        : 'text-wine-800/80 hover:bg-blush-200/70 hover:text-wine-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* CATEGORIA 01 — PROCEDIMENTOS FACIAIS */}
        {showFacial && (
          <div className="mt-14 sm:mt-16">
            <Reveal direction="left">
              <div className="mb-8 flex flex-col justify-between gap-3 border-b border-rosegold/30 pb-5 sm:flex-row sm:items-end">
                <div>
                  <span className="font-script text-3xl text-rosegold-dark">Cuidado Facial</span>
                  <h3 className="mt-1 font-serif text-3xl font-semibold text-wine-800 sm:text-4xl">
                    Procedimentos Faciais
                  </h3>
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-wine-800/60">
                  01 · {facialServices.length} procedimentos
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {facialServices.map((service, idx) => {
                const isSelected = selectedServiceId === service.id;
                const direction = idx % 2 === 0 ? 'left' : 'right';
                return (
                  <Reveal key={service.id} direction={direction} delayMs={(idx % 3) * 80}>
                    <article
                      className={`group flex h-full flex-col overflow-hidden rounded-3xl border bg-ivory transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card-hover ${
                        isSelected
                          ? 'border-wine-800/60 ring-2 ring-rosegold/40 shadow-soft-rose'
                          : 'border-rosegold/25 shadow-card'
                      }`}
                    >
                      <div className="relative overflow-hidden bg-blush-100">
                        <img
                          src={service.image}
                          alt={service.imageAlt}
                          width={800}
                          height={600}
                          loading="lazy"
                          className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <span className="absolute left-4 top-4 rounded-full bg-ivory/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-wine-800 backdrop-blur-sm">
                          Facial
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <h4 className="font-serif text-2xl font-semibold leading-snug text-wine-800">
                          {service.name}
                        </h4>
                        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-wine-800/75">
                          {service.shortDescription}
                        </p>

                        <div className="mt-6 border-t border-rosegold/20 pt-4">
                          <button
                            type="button"
                            onClick={() => handleCardAction(service)}
                            className={`inline-flex w-full items-center justify-between rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-300 ${
                              isSelected
                                ? 'bg-wine-800 text-blush-50 shadow-sm'
                                : 'bg-blush-100 text-wine-800 hover:bg-wine-800 hover:text-blush-50'
                            }`}
                          >
                            <span className="inline-flex items-center gap-2">
                              <CalendarCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
                              {isSelected ? 'Selecionado para agendar' : 'Agendar procedimento'}
                            </span>
                            <ArrowUpRight
                              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        )}

        {/* CATEGORIA 02 — PROCEDIMENTOS CORPORAIS (visualmente distinta em bloco nude rosado) */}
        {showCorporal && (
          <div className="mt-16 rounded-[2.25rem] border border-rosegold/30 bg-gradient-to-br from-blush-100 via-blush-200/70 to-blush-100 p-6 sm:mt-20 sm:p-10 lg:p-12">
            <Reveal direction="right">
              <div className="mb-8 flex flex-col justify-between gap-3 border-b border-wine-800/15 pb-5 sm:flex-row sm:items-end">
                <div>
                  <span className="font-script text-3xl text-wine-700">Cuidado Corporal</span>
                  <h3 className="mt-1 font-serif text-3xl font-semibold text-wine-800 sm:text-4xl">
                    Procedimentos Corporais
                  </h3>
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-wine-800/65">
                  02 · {corporalServices.length} procedimentos
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {corporalServices.map((service, idx) => {
                const isSelected = selectedServiceId === service.id;
                const direction = idx % 2 === 0 ? 'right' : 'left';
                return (
                  <Reveal key={service.id} direction={direction} delayMs={(idx % 3) * 80}>
                    <article
                      className={`group flex h-full flex-col overflow-hidden rounded-3xl border bg-ivory/95 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card-hover ${
                        isSelected
                          ? 'border-wine-800/60 ring-2 ring-wine-800/20 shadow-soft-rose'
                          : 'border-white/80 shadow-card'
                      }`}
                    >
                      <div className="relative overflow-hidden bg-blush-200/60">
                        <img
                          src={service.image}
                          alt={service.imageAlt}
                          width={800}
                          height={600}
                          loading="lazy"
                          className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <span className="absolute left-4 top-4 rounded-full bg-wine-800/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blush-50 backdrop-blur-sm">
                          Corporal
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <h4 className="font-serif text-2xl font-semibold leading-snug text-wine-800">
                          {service.name}
                        </h4>
                        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-wine-800/75">
                          {service.shortDescription}
                        </p>

                        <div className="mt-6 border-t border-rosegold/20 pt-4">
                          <button
                            type="button"
                            onClick={() => handleCardAction(service)}
                            className={`inline-flex w-full items-center justify-between rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-300 ${
                              isSelected
                                ? 'bg-wine-800 text-blush-50 shadow-sm'
                                : 'bg-blush-200/80 text-wine-800 hover:bg-wine-800 hover:text-blush-50'
                            }`}
                          >
                            <span className="inline-flex items-center gap-2">
                              <CalendarCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
                              {isSelected ? 'Selecionado para agendar' : 'Agendar procedimento'}
                            </span>
                            <ArrowUpRight
                              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
