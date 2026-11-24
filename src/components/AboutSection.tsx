import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';
import { CLINIC_CONFIG } from '../config/clinic';
import { Reveal } from './Reveal';

export const AboutSection: React.FC = () => {
  return (
    <section
      id="sobre"
      aria-labelledby="sobre-heading"
      className="relative overflow-hidden surface-blush-gradient py-20 sm:py-24 lg:py-28"
    >
      {/* Textura radial suave */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-ivory/60 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Fotografia grande e premium da profissional responsável */}
          <div className="lg:col-span-6">
            <Reveal direction="left">
              <div className="relative mx-auto max-w-[460px]">
                <div
                  aria-hidden="true"
                  className="absolute -inset-3 rounded-[2.25rem] border border-rosegold/45 bg-ivory/35 sm:-inset-4"
                />
                <figure className="relative overflow-hidden rounded-[2rem] bg-ivory shadow-editorial">
                  <img
                    src={CLINIC_CONFIG.professional.photo}
                    alt={CLINIC_CONFIG.professional.photoAlt}
                    width={640}
                    height={640}
                    loading="lazy"
                    className="aspect-square w-full object-cover object-top transition-transform duration-700 ease-out hover:scale-[1.02]"
                  />
                </figure>

                {/* Selo sutil de registro profissional sobre o canto inferior */}
                <div className="absolute -bottom-5 right-4 rounded-2xl border border-rosegold/40 bg-ivory/95 px-5 py-3 shadow-soft-rose backdrop-blur-md sm:-right-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blush-200 text-wine-800">
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rosegold-dark">
                        Registro Profissional
                      </p>
                      <p className="font-serif text-base font-semibold text-wine-800">
                        {CLINIC_CONFIG.professional.registration}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Apresentação institucional controlada e elegante */}
          <div className="lg:col-span-6">
            <Reveal direction="right" delayMs={80}>
              <span className="font-script text-4xl text-rosegold-dark">Sobre a Clínica</span>
              <h2
                id="sobre-heading"
                className="mt-2 font-serif text-4xl font-semibold leading-tight text-wine-800 sm:text-5xl"
              >
                Conheça a BioClinic Estética Avançada
              </h2>

              <div aria-hidden="true" className="mt-6 h-[1.5px] w-20 bg-rosegold" />

              <p className="mt-6 text-base leading-relaxed text-wine-800/85 sm:text-lg sm:leading-relaxed">
                A BioClinic Estética Avançada é dedicada à estética avançada e à harmonização facial
                e corporal, oferecendo atendimento especializado e atenção em cada detalhe.
              </p>

              {/* Destaque visual elegante para identificação profissional */}
              <div className="mt-8 rounded-3xl border border-rosegold/35 bg-ivory/90 p-6 shadow-card backdrop-blur-sm sm:p-7">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blush-200 text-wine-800">
                    <Award className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rosegold-dark">
                      Identificação Profissional
                    </p>
                    <h3 className="mt-1 font-serif text-2xl font-semibold text-wine-800 sm:text-3xl">
                      {CLINIC_CONFIG.professional.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-wine-800/80">
                      {CLINIC_CONFIG.professional.role}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-rosegold/35 bg-blush-100 px-3.5 py-1 text-xs font-semibold tracking-wider text-wine-800">
                      <span>{CLINIC_CONFIG.professional.registration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};
