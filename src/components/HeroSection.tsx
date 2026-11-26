import React from 'react';
import { CalendarHeart, MapPin, UserCheck } from 'lucide-react';
import { CLINIC_CONFIG } from '../config/clinic';
import { WhatsAppIcon } from './BrandIcons';
import { scrollToSectionId } from './Header';
import { Reveal } from './Reveal';

export const HeroSection: React.FC = () => {
  return (
    <section
      id="inicio"
      aria-label="Início — BioClinic Estética Avançada"
      className="relative flex min-h-[calc(100svh-4rem)] w-full items-center overflow-hidden bg-blush-200"
    >
      {/* Imagem única de fundo ocupando 100% da área (versão horizontal desktop / vertical mobile) */}
      <picture className="pointer-events-none absolute inset-0 h-full w-full">
        <source media="(max-width: 767px)" srcSet={CLINIC_CONFIG.hero.mobileImage} />
        <img
          src={CLINIC_CONFIG.hero.desktopImage}
          alt={CLINIC_CONFIG.hero.mainImageAlt}
          width={1920}
          height={1080}
          loading="eager"
          decoding="sync"
          className="h-full w-full object-cover object-center md:object-right"
        />
      </picture>

      {/* Camada de sombra escura sutil e transparente sobre a imagem para realçar o contraste do Hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-wine-900/[0.15] md:bg-wine-900/[0.17]"
      />

      {/* Gradiente equilibrado preservando leitura nítida dos textos/botões e destaque visual do fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 shadow-[inset_0_-28px_40px_-24px_rgba(52,10,10,0.28)] bg-gradient-to-b from-blush-200/45 via-blush-100/25 to-wine-900/20 md:bg-gradient-to-r md:from-blush-200/80 md:via-blush-200/30 md:to-wine-900/25"
      />

      {/* Conteúdo principal visível integralmente na primeira dobra */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="max-w-xl">
          <Reveal direction="left" delayMs={30}>
            <div className="inline-flex items-center gap-2 rounded-full border border-rosegold/45 bg-ivory/85 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-wine-800 shadow-sm backdrop-blur-sm">
              <MapPin className="h-3.5 w-3.5 text-rosegold-dark" aria-hidden="true" />
              <span>São Luís - Maranhão</span>
            </div>
          </Reveal>

          <Reveal direction="left" delayMs={100}>
            <h1 className="mt-5 font-serif text-5xl font-bold leading-[1.04] text-wine-800 sm:text-6xl lg:text-[4.25rem]">
              BioClinic
            </h1>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.28em] text-rosegold-dark sm:text-base">
              Estética Avançada
            </p>
          </Reveal>

          <Reveal direction="left" delayMs={170}>
            <div aria-hidden="true" className="mt-5 h-[2px] w-16 rounded-full bg-rosegold" />
            <p className="mt-5 font-serif text-2xl font-medium italic leading-snug text-wine-800 sm:text-3xl lg:text-[2.1rem]">
              Beleza e harmonia, cuidado em cada detalhe.
            </p>
          </Reveal>

          {/* Botões principais: Agendar atendimento + Falar pelo WhatsApp */}
          <Reveal direction="up" delayMs={240}>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#agendamento"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSectionId('agendamento');
                }}
                className="btn-primary w-full sm:w-auto"
              >
                <CalendarHeart className="h-4 w-4" aria-hidden="true" />
                <span>Agendar atendimento</span>
              </a>

              <a
                href={CLINIC_CONFIG.contact.whatsappBaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full border-wine-800/30 bg-ivory/95 sm:w-auto"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                <span>Falar pelo WhatsApp</span>
              </a>
            </div>
          </Reveal>

          {/* Identificação concisa da profissional e localização dentro da primeira dobra */}
          <Reveal direction="up" delayMs={300}>
            <div className="mt-8 inline-flex flex-wrap items-center gap-x-6 gap-y-2.5 rounded-2xl border border-rosegold/35 bg-ivory/85 px-5 py-3.5 shadow-soft-rose backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blush-200 text-wine-800">
                  <UserCheck className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rosegold-dark">
                    Responsável
                  </p>
                  <p className="text-sm font-semibold text-wine-800">
                    {CLINIC_CONFIG.professional.name}
                  </p>
                </div>
              </div>

              <span aria-hidden="true" className="hidden h-7 w-[1px] bg-rosegold/35 sm:block" />

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rosegold-dark" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rosegold-dark">
                    Localização
                  </p>
                  <p className="text-sm font-semibold text-wine-800">São Luís - Maranhão</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
