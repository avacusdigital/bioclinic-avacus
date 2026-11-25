import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SERVICES, ServiceCategory, ServiceItem } from '../config/clinic';
import { scrollToSectionId } from './Header';
import { Reveal } from './Reveal';

interface ServicesSectionProps {
  selectedServiceId: string;
  onSelectService: (service: ServiceItem) => void;
}

type FilterOption = 'all' | ServiceCategory;

interface ServiceCarouselProps {
  title: string;
  badge: string;
  items: ServiceItem[];
  tone: 'facial' | 'corporal';
  selectedServiceId: string;
  onCardAction: (service: ServiceItem) => void;
}

const ServiceCarousel: React.FC<ServiceCarouselProps> = ({
  title,
  badge,
  items,
  tone,
  selectedServiceId,
  onCardAction,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    setCanScrollPrev(el.scrollLeft > 8);
    setCanScrollNext(el.scrollLeft < maxScroll - 8);
    setScrollProgress(maxScroll > 0 ? Math.min(100, (el.scrollLeft / maxScroll) * 100) : 100);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [updateScrollState, items.length]);

  const scrollTrack = (direction: 'prev' | 'next') => {
    const el = trackRef.current;
    if (!el) return;
    const step = Math.max(280, Math.round(el.clientWidth * 0.82));
    el.scrollBy({
      left: direction === 'next' ? step : -step,
      behavior: 'smooth',
    });
  };

  const isCorporal = tone === 'corporal';

  return (
    <div
      className={`animate-step-in rounded-[2rem] border p-5 sm:p-7 ${
        isCorporal
          ? 'border-rosegold/35 bg-gradient-to-br from-blush-100 via-blush-200/75 to-blush-100'
          : 'border-rosegold/25 bg-blush-50/75'
      }`}
    >
      {/* Cabeçalho do Carrossel + Setas de Navegação */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-rosegold/25 pb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rosegold-dark">
            {badge} · {items.length} procedimentos
          </span>
          <h3 className="mt-0.5 font-serif text-2xl font-semibold text-wine-800 sm:text-3xl">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollTrack('prev')}
            disabled={!canScrollPrev}
            aria-label={`Voltar em ${title}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rosegold/45 bg-ivory text-wine-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-wine-800 hover:text-blush-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 disabled:hover:bg-ivory disabled:hover:text-wine-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollTrack('next')}
            disabled={!canScrollNext}
            aria-label={`Avançar em ${title}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rosegold/45 bg-ivory text-wine-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-wine-800 hover:text-blush-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 disabled:hover:bg-ivory disabled:hover:text-wine-800"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Trilho horizontal com scroll-snap e toque nativo */}
      <div
        ref={trackRef}
        onScroll={updateScrollState}
        role="region"
        aria-label={`Carrossel de ${title}`}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pt-1 sm:gap-5"
      >
        {items.map((service) => {
          const isSelected = selectedServiceId === service.id;
          return (
            <article
              key={service.id}
              className={`group flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border bg-ivory transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:w-[47%] lg:w-[31.8%] ${
                isSelected
                  ? 'border-wine-800/65 ring-2 ring-rosegold/45 shadow-soft-rose'
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
                  className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span
                  className={`absolute left-3.5 top-3.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] backdrop-blur-sm ${
                    isCorporal
                      ? 'bg-wine-800/90 text-blush-50'
                      : 'bg-ivory/90 text-wine-800'
                  }`}
                >
                  {isCorporal ? 'Corporal' : 'Facial'}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h4 className="font-serif text-xl font-semibold leading-snug text-wine-800">
                  {service.name}
                </h4>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-wine-800/75">
                  {service.shortDescription}
                </p>

                <div className="mt-4 border-t border-rosegold/20 pt-3.5">
                  <button
                    type="button"
                    onClick={() => onCardAction(service)}
                    className={`inline-flex w-full items-center justify-between rounded-full px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.13em] transition-all duration-300 active:scale-[0.98] ${
                      isSelected
                        ? 'bg-wine-800 text-blush-50 shadow-sm'
                        : isCorporal
                          ? 'bg-blush-200/85 text-wine-800 hover:bg-wine-800 hover:text-blush-50'
                          : 'bg-blush-100 text-wine-800 hover:bg-wine-800 hover:text-blush-50'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <CalendarCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {isSelected ? 'Selecionado' : 'Agendar procedimento'}
                    </span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Barra discreta de progresso horizontal */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-rosegold/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rosegold to-wine-800 transition-all duration-300"
            style={{ width: `${Math.max(18, scrollProgress)}%` }}
          />
        </div>
        <span className="text-[11px] font-medium text-wine-800/60 sm:hidden">
          Deslize para ver mais
        </span>
      </div>
    </div>
  );
};

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
    scrollToSectionId('agendamento');
  };

  const filterItems: Array<{
    key: FilterOption;
    label: string;
    count: number;
    description: string;
  }> = [
    {
      key: 'all',
      label: 'Todos os procedimentos',
      count: SERVICES.length,
      description: 'Faciais e corporais',
    },
    {
      key: 'facial',
      label: 'Procedimentos Faciais',
      count: facialServices.length,
      description: 'Cuidado e harmonização',
    },
    {
      key: 'corporal',
      label: 'Procedimentos Corporais',
      count: corporalServices.length,
      description: 'Estética corporal',
    },
  ];

  return (
    <section
      id="servicos"
      aria-labelledby="servicos-heading"
      className="relative scroll-mt-16 bg-ivory py-10 sm:py-12 lg:py-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho + Novo Sistema Profissional de Filtros */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal direction="left">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-rosegold-dark">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Serviços BioClinic</span>
              </span>
              <h2
                id="servicos-heading"
                className="mt-1.5 font-serif text-3xl font-semibold text-wine-800 sm:text-4xl lg:text-[2.6rem]"
              >
                Nossos procedimentos
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-wine-800/75 sm:text-base">
                Procedimentos faciais e corporais conduzidos com atenção.
              </p>
            </div>
          </Reveal>

          {/* Barra de Filtros Profissional */}
          <Reveal direction="right" delayMs={80}>
            <div
              role="group"
              aria-label="Filtrar categoria de procedimentos"
              className="grid grid-cols-1 gap-2 rounded-2xl border border-rosegold/30 bg-blush-50 p-1.5 shadow-sm sm:inline-grid sm:grid-cols-3"
            >
              {filterItems.map((tab) => {
                const active = filter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(tab.key)}
                    className={`group flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-left transition-all duration-300 ${
                      active
                        ? 'bg-wine-800 text-blush-50 shadow-soft-rose'
                        : 'bg-transparent text-wine-800 hover:bg-blush-200/70'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Layers
                        className={`h-3.5 w-3.5 shrink-0 ${
                          active ? 'text-rosegold-light' : 'text-rosegold-dark'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="text-xs font-semibold leading-tight sm:text-[13px]">
                        {tab.label}
                      </span>
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        active
                          ? 'bg-ivory/15 text-blush-100'
                          : 'bg-blush-200/90 text-wine-800'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* Dois Carrosséis Independentes */}
        <div className="mt-7 space-y-6">
          {showFacial && (
            <ServiceCarousel
              key="carousel-facial"
              title="Procedimentos Faciais"
              badge="Categoria 01 · Facial"
              items={facialServices}
              tone="facial"
              selectedServiceId={selectedServiceId}
              onCardAction={handleCardAction}
            />
          )}

          {showCorporal && (
            <ServiceCarousel
              key="carousel-corporal"
              title="Procedimentos Corporais"
              badge="Categoria 02 · Corporal"
              items={corporalServices}
              tone="corporal"
              selectedServiceId={selectedServiceId}
              onCardAction={handleCardAction}
            />
          )}
        </div>
      </div>
    </section>
  );
};
