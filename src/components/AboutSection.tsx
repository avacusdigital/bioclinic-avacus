import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';
import { CLINIC_CONFIG } from '../config/clinic';
import { Reveal } from './Reveal';

export const AboutSection: React.FC = () => {
  return (
    <section
      id="sobre"
      aria-labelledby="sobre-heading"
      className="relative scroll-mt-16 overflow-hidden surface-blush-gradient py-10 sm:py-14 lg:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-ivory/60 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Fotografia da profissional com ampliação suave e contorno animado nas laterais */}
          <div className="lg:col-span-6">
            <Reveal direction="left">
              <div className="relative mx-auto max-w-[430px] px-3">
                <div className="about-photo-shell rounded-[2rem] border border-rosegold/45 bg-ivory/80 p-2.5 shadow-editorial">
                  <figure className="relative overflow-hidden rounded-[1.55rem] bg-ivory">
                    <img
                      src={CLINIC_CONFIG.professional.photo}
                      alt={CLINIC_CONFIG.professional.photoAlt}
                      width={640}
                      height={640}
                      loading="lazy"
                      className="aspect-square w-full object-cover object-top"
                    />
                  </figure>
                </div>

                {/* Selo de registro profissional */}
                <div className="absolute -bottom-4 right-1 rounded-2xl border border-rosegold/45 bg-ivory/95 px-4 py-2.5 shadow-soft-rose backdrop-blur-md sm:-right-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blush-200 text-wine-800">
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rosegold-dark">
                        Registro Profissional
                      </p>
                      <p className="font-serif text-sm font-semibold text-wine-800 sm:text-base">
                        {CLINIC_CONFIG.professional.registration}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Apresentação institucional preservada */}
          <div className="lg:col-span-6">
            <Reveal direction="right" delayMs={70}>
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-rosegold-dark">
                Sobre a Clínica
              </span>
              <h2
                id="sobre-heading"
                className="mt-2 font-serif text-3xl font-semibold leading-tight text-wine-800 sm:text-4xl lg:text-[2.65rem]"
              >
                Conheça a BioClinic Estética Avançada
              </h2>

              <div aria-hidden="true" className="mt-4 h-[2px] w-16 rounded-full bg-rosegold" />

              <p className="mt-5 text-sm leading-relaxed text-wine-800/85 sm:text-base sm:leading-relaxed">
                A BioClinic Estética Avançada é dedicada à estética avançada e à harmonização facial
                e corporal, oferecendo atendimento especializado e atenção em cada detalhe.
              </p>

              {/* Identificação profissional */}
              <div className="mt-6 rounded-3xl border border-rosegold/35 bg-ivory/95 p-5 shadow-card backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-rose sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blush-200 text-wine-800">
                    <Award className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rosegold-dark">
                      Identificação Profissional
                    </p>
                    <h3 className="mt-0.5 font-serif text-2xl font-semibold text-wine-800">
                      {CLINIC_CONFIG.professional.name}
                    </h3>
                    <p className="mt-0.5 text-sm font-medium text-wine-800/80">
                      {CLINIC_CONFIG.professional.role}
                    </p>
                    <div className="mt-2.5 inline-flex items-center gap-2 rounded-full border border-rosegold/40 bg-blush-100 px-3.5 py-1 text-xs font-semibold tracking-wider text-wine-800">
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
