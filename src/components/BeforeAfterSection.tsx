import React, { useCallback, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Info, MoveHorizontal } from 'lucide-react';
import { BEFORE_AFTER_GALLERY } from '../config/clinic';
import { Reveal } from './Reveal';

export const BeforeAfterSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dividerPercent, setDividerPercent] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const swipeStartXRef = useRef<number | null>(null);

  const total = BEFORE_AFTER_GALLERY.length;
  const activeItem = BEFORE_AFTER_GALLERY[currentIndex];

  const goToIndex = useCallback(
    (next: number) => {
      const normalized = ((next % total) + total) % total;
      setCurrentIndex(normalized);
      setDividerPercent(50);
    },
    [total],
  );

  const goPrev = () => goToIndex(currentIndex - 1);
  const goNext = () => goToIndex(currentIndex + 1);

  const updateDividerFromClientX = useCallback((clientX: number) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const raw = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(4, Math.min(96, raw));
    setDividerPercent(clamped);
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
    if (isDragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignora se a captura já tiver sido liberada
      }
      setIsDragging(false);
    }
  };

  const handleSliderKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setDividerPercent((prev) => Math.max(4, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setDividerPercent((prev) => Math.min(96, prev + 5));
    }
  };

  // Suporte a swipe horizontal na área de controles/legenda no celular para trocar slides
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
      if (delta < 0) goNext();
      else goPrev();
    }
  };

  return (
    <section
      id="antes-e-depois"
      aria-labelledby="antes-depois-heading"
      className="relative bg-ivory py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="mx-auto max-w-3xl text-center">
          <Reveal direction="up">
            <span className="font-script text-4xl text-rosegold-dark">Galeria Interativa</span>
            <h2
              id="antes-depois-heading"
              className="mt-1 font-serif text-4xl font-semibold text-wine-800 sm:text-5xl"
            >
              Antes e Depois
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-wine-800/75 sm:text-base">
              Arraste o controle central para comparar e utilize as setas para navegar entre os
              procedimentos.
            </p>
          </Reveal>
        </div>

        {/* Palco principal da galeria (exibe uma comparação por vez) */}
        <Reveal direction="scale" delayMs={100}>
          <div className="relative mx-auto mt-12 max-w-4xl">
            {/* Seta esquerda Desktop */}
            <button
              type="button"
              onClick={goPrev}
              aria-label="Resultado anterior"
              className="absolute -left-6 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-rosegold/40 bg-ivory/95 text-wine-800 shadow-editorial backdrop-blur-md transition-all duration-300 hover:-translate-x-0.5 hover:bg-wine-800 hover:text-blush-50 active:scale-95 lg:inline-flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Seta direita Desktop */}
            <button
              type="button"
              onClick={goNext}
              aria-label="Próximo resultado"
              className="absolute -right-6 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-rosegold/40 bg-ivory/95 text-wine-800 shadow-editorial backdrop-blur-md transition-all duration-300 hover:translate-x-0.5 hover:bg-wine-800 hover:text-blush-50 active:scale-95 lg:inline-flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Card do Comparador */}
            <div className="overflow-hidden rounded-[2rem] border border-rosegold/30 bg-blush-50 shadow-editorial">
              {/* Barra superior: Procedimento + Indicador de posição */}
              <div
                onTouchStart={handleSwipeStart}
                onTouchEnd={handleSwipeEnd}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-rosegold/20 bg-ivory/90 px-5 py-4 sm:px-7"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blush-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-wine-800">
                    {activeItem.category === 'facial' ? 'Facial' : 'Corporal'}
                  </span>
                  <h3
                    key={activeItem.id}
                    className="animate-step-in font-serif text-xl font-semibold text-wine-800 sm:text-2xl"
                  >
                    {activeItem.procedure}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-wine-800/75">
                  <span aria-live="polite">
                    {currentIndex + 1} de {total}
                  </span>
                </div>
              </div>

              {/* Comparador sobreposto com divisor móvel */}
              <div
                ref={stageRef}
                role="slider"
                tabIndex={0}
                aria-label={`Comparador Antes e Depois de ${activeItem.procedure}. Use as setas esquerda e direita ou arraste para ajustar a divisão.`}
                aria-valuemin={4}
                aria-valuemax={96}
                aria-valuenow={Math.round(dividerPercent)}
                onKeyDown={handleSliderKeyDown}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{ touchAction: 'none' }}
                className="relative aspect-[4/3] w-full cursor-ew-resize select-none overflow-hidden bg-blush-200/60 sm:aspect-[16/10]"
              >
                {/* Camada Base — DEPOIS */}
                <img
                  key={`${activeItem.id}-after`}
                  src={activeItem.afterImage}
                  alt={activeItem.afterAlt}
                  width={1080}
                  height={760}
                  draggable={false}
                  loading="lazy"
                  className="animate-step-in pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
                />

                {/* Camada Sobreposta Recortada — ANTES */}
                <div
                  className="pointer-events-none absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - dividerPercent}% 0 0)` }}
                >
                  <img
                    key={`${activeItem.id}-before`}
                    src={activeItem.beforeImage}
                    alt={activeItem.beforeAlt}
                    width={1080}
                    height={760}
                    draggable={false}
                    loading="lazy"
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                {/* Etiquetas discretas Antes / Depois */}
                <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-wine-900/70 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-blush-50 backdrop-blur-sm">
                  Antes
                </span>
                <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-ivory/90 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-wine-800 shadow-sm backdrop-blur-sm">
                  Depois
                </span>

                {/* Etiqueta clara de demonstração ilustrativa */}
                {activeItem.isIllustrative && (
                  <span className="pointer-events-none absolute bottom-3 left-4 rounded-full bg-wine-900/65 px-3 py-1 text-[10px] font-medium tracking-wider text-blush-100 backdrop-blur-sm">
                    Demonstração ilustrativa
                  </span>
                )}

                {/* Linha vertical divisória + Alça arrastável */}
                <div
                  aria-hidden="true"
                  style={{ left: `${dividerPercent}%` }}
                  className="pointer-events-none absolute inset-y-0 z-10 w-[2px] -translate-x-1/2 bg-ivory shadow-[0_0_16px_rgba(74,16,16,0.45)]"
                >
                  <div
                    className={`absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ivory bg-wine-800 text-blush-50 shadow-editorial transition-transform duration-200 ${
                      isDragging ? 'scale-110 bg-wine-700' : 'scale-100'
                    }`}
                  >
                    <MoveHorizontal className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Barra inferior: Controles móveis + paginação + aviso transparente */}
              <div
                onTouchStart={handleSwipeStart}
                onTouchEnd={handleSwipeEnd}
                className="flex flex-col gap-4 bg-ivory px-5 py-5 sm:px-7"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Controles acessíveis mobile/tablet */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={goPrev}
                      aria-label="Comparação anterior"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rosegold/40 bg-blush-50 text-wine-800 transition-all duration-200 hover:bg-wine-800 hover:text-blush-50 active:scale-95"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      aria-label="Próxima comparação"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rosegold/40 bg-blush-50 text-wine-800 transition-all duration-200 hover:bg-wine-800 hover:text-blush-50 active:scale-95"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Indicadores de página */}
                  <div
                    role="tablist"
                    aria-label="Selecionar item da galeria Antes e Depois"
                    className="flex items-center gap-2"
                  >
                    {BEFORE_AFTER_GALLERY.map((item, idx) => {
                      const active = idx === currentIndex;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          aria-label={`Ver ${item.procedure} (${idx + 1} de ${total})`}
                          onClick={() => goToIndex(idx)}
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            active
                              ? 'w-8 bg-wine-800'
                              : 'w-2.5 bg-rosegold/45 hover:bg-rosegold'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Aviso transparente obrigatório sobre imagens ilustrativas */}
                {activeItem.isIllustrative && (
                  <div className="flex items-start gap-2.5 rounded-2xl border border-rosegold/25 bg-blush-100/75 px-4 py-3 text-xs leading-relaxed text-wine-800/80">
                    <Info
                      className="mt-0.5 h-4 w-4 shrink-0 text-rosegold-dark"
                      aria-hidden="true"
                    />
                    <p>
                      <strong className="font-semibold text-wine-800">Aviso ilustrativo:</strong>{' '}
                      As imagens exibidas nesta galeria são demonstrações provisórias ilustrativas
                      para apresentação do recurso interativo e não representam resultados reais de
                      pacientes. Cada resultado é individual e depende de avaliação presencial.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
