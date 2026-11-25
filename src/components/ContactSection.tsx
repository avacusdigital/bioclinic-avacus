import React from 'react';
import { Clock, ExternalLink, Mail, MapPin } from 'lucide-react';
import { CLINIC_CONFIG } from '../config/clinic';
import { WhatsAppIcon } from './BrandIcons';
import { Reveal } from './Reveal';

export const ContactSection: React.FC = () => {
  return (
    <section
      id="contato"
      aria-labelledby="contato-heading"
      className="relative scroll-mt-16 bg-ivory py-10 sm:py-12 lg:py-14"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <div className="mb-6 max-w-2xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rosegold-dark">
              Fale Conosco
            </span>
            <h2
              id="contato-heading"
              className="mt-1 font-serif text-3xl font-semibold text-wine-800 sm:text-4xl lg:text-[2.6rem]"
            >
              Contato
            </h2>
          </div>
        </Reveal>

        <div className="grid items-stretch gap-6 lg:grid-cols-12">
          {/* Lado Esquerdo — Informações de Contato (sem repetição de telefone) */}
          <Reveal direction="left" className="lg:col-span-6">
            <div className="flex h-full flex-col justify-between rounded-[1.85rem] border border-rosegold/35 bg-blush-50/90 p-5 shadow-card sm:p-6">
              <div className="space-y-3">
                {/* WhatsApp */}
                <a
                  href={CLINIC_CONFIG.contact.whatsappBaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-rosegold/20 bg-ivory/85 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-rosegold/55 hover:bg-ivory hover:shadow-soft-rose"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blush-200/80 text-wine-800 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-[#25D366]/15">
                    <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rosegold-dark">
                      WhatsApp
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-wine-800 transition-colors group-hover:text-wine-700 sm:text-base">
                      {CLINIC_CONFIG.contact.whatsappDisplay}
                    </p>
                  </div>
                </a>

                {/* E-mail em linha única sempre que houver espaço */}
                <a
                  href={`mailto:${CLINIC_CONFIG.contact.email}`}
                  className="group flex items-center gap-4 rounded-2xl border border-rosegold/20 bg-ivory/85 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-rosegold/55 hover:bg-ivory hover:shadow-soft-rose"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blush-200/80 text-wine-800 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-wine-800 group-hover:text-blush-50">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 overflow-x-auto no-scrollbar">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rosegold-dark">
                      E-mail
                    </p>
                    <p className="mt-0.5 whitespace-nowrap text-[13px] font-semibold text-wine-800 transition-colors group-hover:text-wine-700 sm:text-sm">
                      {CLINIC_CONFIG.contact.email}
                    </p>
                  </div>
                </a>

                {/* Endereço */}
                <div className="group flex items-start gap-4 rounded-2xl border border-rosegold/20 bg-ivory/85 p-3.5 transition-all duration-300 hover:border-rosegold/50 hover:bg-ivory">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blush-200/80 text-wine-800 transition-transform duration-300 group-hover:scale-105">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rosegold-dark">
                      Endereço
                    </p>
                    <address className="mt-0.5 not-italic text-[13px] leading-relaxed text-wine-800/85 sm:text-sm">
                      {CLINIC_CONFIG.contact.address.full}
                    </address>
                  </div>
                </div>
              </div>

              {/* Horário de Funcionamento */}
              <div className="mt-4 rounded-2xl border border-rosegold/25 bg-blush-100/75 p-4">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-rosegold-dark">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Horário de Funcionamento</span>
                </div>
                <div className="mt-2 space-y-1 text-xs text-wine-800/85">
                  {CLINIC_CONFIG.schedule.summaryLines.map((item) => (
                    <p key={item.days} className="flex justify-between gap-2">
                      <span className="font-semibold text-wine-800">{item.days}:</span>
                      <span>{item.hours}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Lado Direito — Mapa em dimensões moderadas com interação suave no hover */}
          <Reveal direction="right" delayMs={70} className="lg:col-span-6 lg:self-center">
            <div className="group flex flex-col overflow-hidden rounded-[1.85rem] border border-rosegold/35 bg-blush-50 shadow-card transition-all duration-300 hover:border-rosegold/70 hover:shadow-card-hover">
              <div className="relative h-[230px] overflow-hidden bg-blush-200/50 sm:h-[255px] lg:h-[270px]">
                <iframe
                  title={`Localização da ${CLINIC_CONFIG.name} no Google Maps`}
                  src={CLINIC_CONFIG.contact.mapsEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="h-full w-full border-0 transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                />
              </div>
              <div className="flex flex-col items-start justify-between gap-3 border-t border-rosegold/25 bg-ivory px-5 py-3.5 sm:flex-row sm:items-center">
                <p className="text-xs leading-relaxed text-wine-800/80">
                  {CLINIC_CONFIG.contact.address.street} — {CLINIC_CONFIG.contact.address.neighborhood},{' '}
                  {CLINIC_CONFIG.contact.address.city} - {CLINIC_CONFIG.contact.address.state}
                </p>
                <a
                  href={CLINIC_CONFIG.contact.mapsShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary shrink-0 px-4 py-2 text-xs"
                >
                  <span>Abrir no Google Maps</span>
                  <ExternalLink className="h-3.5 w-3.5 text-rosegold-dark" aria-hidden="true" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
