import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Info, MoveHorizontal } from 'lucide-react';
import { BEFORE_AFTER_GALLERY, BeforeAfterItem } from '../config/clinic';
import { Reveal } from './Reveal';

interface ComparisonCardProps {
  item: BeforeAfterItem;
  indexLabel: string;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ item, indexLabel }) => {
  const [dividerPercent, setDividerPercent] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);

  // Reinicia divisor para 50% quando muda o item exibido no slot
  useEffect(() => {
    setDividerPercent(50);
  }, [item.id]);

  const updateDividerFromClientX = useCallback((clientX: number) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const raw = ((clientX - rect.left) / rect.width) * 100;
    setDividerPercent(Math.max(5, Math.min(95, raw)));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateDividerFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateDividerFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignora se já liberado
    }
    setIsDragging(false);
  };

  const handleSliderKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setDividerPercent((prev) => Math.max(5, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setDividerPercent((prev) => Math.min(95, prev + 5));
    }
  };

  return (
    <div className="animate-step-in overflow-hidden rounded-[1.75rem] border border-rosegold/35 bg-blush-50 shadow-card transition-all duration-300 hover:shadow-card-hover">
      {/* Topo do card */}
      <div className="flex items-center justify-between gap-2 border-b border-rosegold/20 bg-ivory px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="shrink-0 rounded-full bg-blush-200 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-wine-800">
            {item.category === 'facial' ? 'Facial' : 'Corporal'}
          </span>
          <h3 className="truncate font-serif text-lg font-semibold text-wine-800 sm:text-xl">
            {item.procedure}
          </h3>
        </div>
        <span className="shrink-0 text-[11px] font-semibold tracking-wider text-wine-800/65">
          {indexLabel}
        </span>
      </div>

      {/* Palco comparador */}
      <div
        ref={stageRef}
        role="slider"
        tabIndex={0}
        aria-label={`Comparador Antes e Depois de ${item.procedure}. Arraste ou use as setas do teclado.`}
        aria-valuemin={5}
        aria-valuemax={95}
        aria-valuenow={Math.round(dividerPercent)}
        onKeyDown={handleSliderKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'none' }}
        className="relative aspect-[4/3] w-full cursor-ew-resize select-none overflow-hidden bg-blush-200/60"
      >
        {/* Depois (base) */}
        <img
          src={item.afterImage}
          alt={item.afterAlt}
          width={1080}
          height={760}
          draggable={false}
          loading="lazy"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Antes (recorte sobreposto) */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - dividerPercent}% 0 0)` }}
        >
          <img
            src={item.beforeImage}
            alt={item.beforeAlt}
            width={1080}
            height={760}
            draggable={false}
            loading="lazy"
            className="h-full w-full object-cover object-center"
          />
        </div>

        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-wine-900/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-blush-50 backdrop-blur-sm">
          Antes
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-ivory/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-wine-800 shadow-sm backdrop-blur-sm">
          Depois
        </span>

        {item.isIllustrative && (
          <span className="pointer-events-none absolute bottom-2.5 left-3 rounded-full bg-wine-900/70 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-blush-100 backdrop-blur-sm">
            Demonstração ilustrativa
          </span>
        )}

        {/* Linha divisória e alça */}
        <div
          aria-hidden="true"
          style={{ left: `${dividerPercent}%` }}
          className="pointer-events-none absolute inset-y-0 z-10 w-[2px] -translate-x-1/2 bg-ivory shadow-[0_0_14px_rgba(74,16,16,0.45)]"
        >
          <div
            className={`absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ivory bg-wine-800 text-blush-50 shadow-editorial transition-transform duration-200 ${
              isDragging ? 'scale-110 bg-wine-700' : 'scale-100'
            }`}
          >
            <MoveHorizontal className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const BeforeAfterSection: React.FC = () => {
  // Índice para mobile (1 por vez) e para desktop/notebook (2 por vez)
  const [mobileIndex, setMobileIndex] = useState(0);
  const [desktopPage, setDesktopPage] = useState(0);
  const swipeStartXRef = useRef<number | null>(null);

  const total = BEFORE_AFTER_GALLERY.length;
  const desktopTotalPages = Math.ceil(total / 2);

  const prevDesktop = () =>
    setDesktopPage((prev) => ((prev - 1) % desktopTotalPages + desktopTotalPages) % desktopTotalPages);
  const nextDesktop = () => setDesktopPage((prev) => (prev + 1) % desktopTotalPages);

  const prevMobile = () => setMobileIndex((prev) => ((prev - 1) % total + total) % total);
  const nextMobile = () => setMobileIndex((prev) => (prev + 1) % total);

  const desktopItems = BEFORE_AFTER_GALLERY.slice(desktopPage * 2, desktopPage * 2 + 2);
  const activeMobileItem = BEFORE_AFTER_GALLERY[mobileIndex];

  const handleSwipeStart = (e: React.TouchEvent<HTMLDivElement>) => {
    swipeStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleSwipeEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const startX = swipeStartXRef.current;
    const endX = e.changedTouches[0]?.clientX ?? null;
    swipeStartXRef.current = null;
    if (startX === null || endX === null) return;
    const delta = endX - startX;
    if (Math.abs(delta) > 48) {
      if (delta < 0) nextMobile();
      else prevMobile();
    }
  };

  return (
    <section
      id="antes-e-depois"
      aria-labelledby="antes-depois-heading"
      className="relative scroll-mt-16 bg-ivory py-10 sm:py-12 lg:py-14"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho compacto no topo + controles Desktop */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <Reveal direction="left">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rosegold-dark">
                Galeria Interativa
              </span>
              <h2
                id="antes-depois-heading"
                className="mt-1 font-serif text-3xl font-semibold text-wine-800 sm:text-4xl lg:text-[2.6rem]"
              >
                Antes e Depois
              </h2>
              <p className="mt-1.5 text-sm text-wine-800/75">
                Arraste o divisor central em cada imagem para comparar os procedimentos.
              </p>
            </div>
          </Reveal>

          {/* Controles Desktop (2 comparações por visualização) */}
          <Reveal direction="right" delayMs={60}>
            <div className="hidden items-center gap-3 md:flex">
              <span
                aria-live="polite"
                className="text-xs font-semibold uppercase tracking-[0.16em] text-wine-800/75"
              >
                {desktopPage * 2 + 1}–{Math.min(desktopPage * 2 + 2, total)} de {total}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevDesktop}
                  aria-label="Comparações anteriores"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rosegold/45 bg-blush-50 text-wine-800 transition-all duration-200 hover:-translate-y-0.5 hover:bg-wine-800 hover:text-blush-50 active:scale-95"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={nextDesktop}
                  aria-label="Próximas comparações"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rosegold/45 bg-blush-50 text-wine-800 transition-all duration-200 hover:-translate-y-0.5 hover:bg-wine-800 hover:text-blush-50 active:scale-95"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* DESKTOP E NOTEBOOK: 2 imagens de comparação lado a lado */}
        <div className="mt-6 hidden gap-6 md:grid md:grid-cols-2">
          {desktopItems.map((item, idx) => (
            <ComparisonCard
              key={item.id}
              item={item}
              indexLabel={`${desktopPage * 2 + idx + 1} de ${total}`}
            />
          ))}
        </div>

        {/* CELULAR: 1 imagem de comparação por vez com setas e swipe */}
        <div className="mt-6 md:hidden">
          <ComparisonCard
            key={activeMobileItem.id}
            item={activeMobileItem}
            indexLabel={`${mobileIndex + 1} de ${total}`}
          />

          <div
            onTouchStart={handleSwipeStart}
            onTouchEnd={handleSwipeEnd}
            className="mt-4 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevMobile}
                aria-label="Comparação anterior"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rosegold/45 bg-blush-50 text-wine-800 transition-all hover:bg-wine-800 hover:text-blush-50 active:scale-95"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={nextMobile}
                aria-label="Próxima comparação"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rosegold/45 bg-blush-50 text-wine-800 transition-all hover:bg-wine-800 hover:text-blush-50 active:scale-95"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2" role="tablist" aria-label="Selecionar comparação">
              {BEFORE_AFTER_GALLERY.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === mobileIndex}
                  aria-label={`Ver ${item.procedure}`}
                  onClick={() => setMobileIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === mobileIndex ? 'w-7 bg-wine-800' : 'w-2 bg-rosegold/45'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Aviso transparente obrigatório sobre imagens ilustrativas */}
        <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-rosegold/30 bg-blush-100/75 px-4 py-3 text-xs leading-relaxed text-wine-800/80">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-rosegold-dark" aria-hidden="true" />
          <p>
            <strong className="font-semibold text-wine-800">Aviso ilustrativo:</strong> As imagens
            exibidas nesta galeria são demonstrações provisórias ilustrativas para apresentação do
            comparador e não representam fotografias reais de pacientes. Resultados individuais
            dependem de avaliação presencial.
          </p>
        </div>
      </div>
    </section>
  );
};
