import React from 'react';
import { ArrowDownRight, CalendarHeart, MapPin, Sparkles } from 'lucide-react';
import { CLINIC_CONFIG } from '../config/clinic';
import { Reveal } from './Reveal';

export const HeroSection: React.FC = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="inicio"
      aria-label="Início — BioClinic Estética Avançada"
      className="relative overflow-hidden surface-nude-radial pb-16 pt-8 sm:pb-24 sm:pt-12 lg:pb-28 lg:pt-14"
    >
      {/* Elementos decorativos rose gold discretos */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-28 h-[420px] w-[420px] rounded-full bg-blush-200/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-[360px] w-[360px] rounded-full bg-rosegold-light/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Coluna Editorial Esquerda */}
          <div className="order-2 lg:order-1 lg:col-span-6">
            <Reveal direction="left" delayMs={40}>
              <div className="inline-flex items-center gap-2 rounded-full border border-rosegold/40 bg-blush-100/90 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-wine-800/90 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-rosegold-dark" aria-hidden="true" />
                <span>São Luís · Maranhão</span>
              </div>
            </Reveal>

            <Reveal direction="left" delayMs={120}>
              <p
                aria-hidden="true"
                className="mt-5 font-script text-4xl leading-none text-rosegold-dark sm:text-5xl"
              >
                Estética Avançada
              </p>
              <h1 className="mt-2 font-serif text-4xl font-semibold leading-[1.08] text-wine-800 sm:text-5xl lg:text-[3.6rem]">
                BioClinic{' '}
                <span className="block font-normal italic text-wine-700/90">
                  Beleza em harmonia, cuidado em cada detalhe.
                </span>
              </h1>
            </Reveal>

            {/* Destaque visual da especialidade */}
            <Reveal direction="left" delayMs={200}>
              <div className="mt-6 flex items-center gap-3.5">
                <span aria-hidden="true" className="h-[1px] w-12 bg-rosegold" />
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rosegold-dark sm:text-[13px]">
                  {CLINIC_CONFIG.specialty}
                </p>
              </div>

              <p className="mt-5 max-w-xl text-sm leading-relaxed text-wine-800/80 sm:text-base sm:leading-relaxed">
                Um espaço dedicado à estética avançada e à harmonização facial e corporal, com
                atendimento especializado, acolhedor e atenção individualizada em cada etapa do seu
                cuidado.
              </p>
            </Reveal>

            {/* Botões de ação principais */}
            <Reveal direction="up" delayMs={280}>
              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                <a
                  href="#agendamento"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('agendamento');
                  }}
                  className="btn-primary w-full sm:w-auto"
                >
                  <CalendarHeart className="h-4 w-4" aria-hidden="true" />
                  <span>Agendar atendimento</span>
                </a>

                <a
                  href="#servicos"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('servicos');
                  }}
                  className="btn-secondary w-full sm:w-auto"
                >
                  <span>Conhecer serviços</span>
                  <ArrowDownRight className="h-4 w-4 text-rosegold-dark" aria-hidden="true" />
                </a>
              </div>
            </Reveal>

            {/* Assinatura institucional discreta */}
            <Reveal direction="up" delayMs={350}>
              <div className="mt-10 grid grid-cols-1 gap-4 border-t border-rosegold/25 pt-6 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rosegold-dark">
                    Responsável pela clínica
                  </p>
                  <p className="mt-1 font-serif text-lg font-medium text-wine-800">
                    {CLINIC_CONFIG.professional.name}{' '}
                    <span className="font-sans text-xs font-medium text-wine-800/70">
                      · {CLINIC_CONFIG.professional.registration}
                    </span>
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-rosegold-dark"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rosegold-dark">
                      Localização
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-wine-800/75">
                      Cohatrac, Itaguara — São Luís, MA
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Coluna Fotográfica Editorial Direita */}
          <div className="order-1 lg:order-2 lg:col-span-6">
            <Reveal direction="right" delayMs={100}>
              <div className="relative mx-auto max-w-[490px] lg:ml-auto lg:mr-0">
                {/* Moldura decorativa rose gold deslocada */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-3 rounded-t-[13rem] rounded-b-[2.25rem] border border-rosegold/40 sm:-inset-4"
                />

                {/* Fotografia principal da clínica em arco editorial */}
                <div className="relative overflow-hidden rounded-t-[12.5rem] rounded-b-[2rem] bg-blush-200 shadow-editorial">
                  <img
                    src={CLINIC_CONFIG.hero.mainImage}
                    alt={CLINIC_CONFIG.hero.mainImageAlt}
                    width={960}
                    height={1200}
                    loading="eager"
                    decoding="sync"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-1000 ease-out hover:scale-[1.03]"
                  />
                  {/* Gradiente sutil inferior */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-wine-900/25 to-transparent"
                  />
                </div>

                {/* Detalhe fotográfico flutuante (desktop e tablet) */}
                <div className="hidden sm:block">
                  <div className="absolute -bottom-6 -left-8 w-36 overflow-hidden rounded-2xl border-4 border-ivory bg-blush-100 shadow-editorial md:w-44">
                    <img
                      src={CLINIC_CONFIG.hero.detailImage}
                      alt={CLINIC_CONFIG.hero.detailImageAlt}
                      width={300}
                      height={300}
                      loading="eager"
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                </div>

                {/* Selo editorial de expediente */}
                <div className="absolute -right-2 bottom-6 rounded-2xl border border-rosegold/35 bg-ivory/95 px-4 py-3 shadow-soft-rose backdrop-blur-md sm:-right-5 sm:bottom-10 sm:px-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rosegold-dark">
                    Atendimento
                  </p>
                  <p className="mt-0.5 font-serif text-base font-semibold text-wine-800 sm:text-lg">
                    Seg a Sáb
                  </p>
                  <p className="text-[11px] text-wine-800/70">Com horário agendado</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Divisor editorial fino */}
      <div aria-hidden="true" className="mx-auto mt-16 max-w-5xl px-8 sm:mt-20">
        <div className="rosegold-hairline h-[1px] w-full opacity-60" />
      </div>
    </section>
  );
};
