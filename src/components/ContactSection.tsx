import React from 'react';
import { Clock, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { CLINIC_CONFIG } from '../config/clinic';
import { WhatsAppIcon } from './BrandIcons';
import { Reveal } from './Reveal';

export const ContactSection: React.FC = () => {
  return (
    <section
      id="contato"
      aria-labelledby="contato-heading"
      className="relative bg-ivory py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <div className="mb-10 max-w-2xl">
            <span className="font-script text-4xl text-rosegold-dark">Fale Conosco</span>
            <h2
              id="contato-heading"
              className="mt-1 font-serif text-4xl font-semibold text-wine-800 sm:text-5xl"
            >
              Contato
            </h2>
          </div>
        </Reveal>

        <div className="grid items-stretch gap-8 lg:grid-cols-12">
          {/* Lado Esquerdo — Informações de Contato */}
          <Reveal direction="left" className="lg:col-span-5">
            <div className="flex h-full flex-col justify-between rounded-[2rem] border border-rosegold/30 bg-blush-50/85 p-6 shadow-card sm:p-8">
              <div className="space-y-5">
                {/* WhatsApp */}
                <a
                  href={CLINIC_CONFIG.contact.whatsappBaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 rounded-2xl border border-transparent p-3 -mx-3 transition-all duration-300 hover:border-rosegold/30 hover:bg-ivory"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#25D366]/15 text-[#128C7E] transition-transform duration-300 group-hover:scale-105">
                    <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rosegold-dark">
                      WhatsApp
                    </p>
                    <p className="mt-0.5 text-base font-semibold text-wine-800 group-hover:text-wine-700">
                      {CLINIC_CONFIG.contact.whatsappDisplay}
                    </p>
                    <p className="text-xs text-wine-800/65">Clique para conversar pelo WhatsApp</p>
                  </div>
                </a>

                {/* Telefone */}
                <a
                  href={CLINIC_CONFIG.contact.phoneHref}
                  className="group flex items-start gap-4 rounded-2xl border border-transparent p-3 -mx-3 transition-all duration-300 hover:border-rosegold/30 hover:bg-ivory"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blush-200/80 text-wine-800 transition-transform duration-300 group-hover:scale-105">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rosegold-dark">
                      Telefone
                    </p>
                    <p className="mt-0.5 text-base font-semibold text-wine-800">
                      {CLINIC_CONFIG.contact.phoneDisplay}
                    </p>
                  </div>
                </a>

                {/* E-mail */}
                <a
                  href={`mailto:${CLINIC_CONFIG.contact.email}`}
                  className="group flex items-start gap-4 rounded-2xl border border-transparent p-3 -mx-3 transition-all duration-300 hover:border-rosegold/30 hover:bg-ivory"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blush-200/80 text-wine-800 transition-transform duration-300 group-hover:scale-105">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rosegold-dark">
                      E-mail
                    </p>
                    <p className="mt-0.5 break-all text-sm font-semibold text-wine-800 sm:text-base">
                      {CLINIC_CONFIG.contact.email}
                    </p>
                  </div>
                </a>

                {/* Endereço */}
                <div className="flex items-start gap-4 p-3 -mx-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blush-200/80 text-wine-800">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rosegold-dark">
                      Endereço
                    </p>
                    <address className="mt-0.5 not-italic text-sm leading-relaxed text-wine-800/85">
                      {CLINIC_CONFIG.contact.address.full}
                    </address>
                  </div>
                </div>
              </div>

              {/* Resumo de Horário */}
              <div className="mt-6 border-t border-rosegold/25 pt-5">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-rosegold-dark">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Horário de Funcionamento</span>
                </div>
                <div className="mt-2.5 space-y-1 text-xs text-wine-800/80">
                  {CLINIC_CONFIG.schedule.summaryLines.map((item) => (
                    <p key={item.days} className="flex justify-between gap-2">
                      <span className="font-medium text-wine-800">{item.days}:</span>
                      <span>{item.hours}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Lado Direito — Mapa Real do Google Maps */}
          <Reveal direction="right" delayMs={80} className="lg:col-span-7">
            <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-rosegold/30 bg-blush-50 shadow-card">
              <div className="relative min-h-[300px] flex-1 bg-blush-200/50 sm:min-h-[360px]">
                <iframe
                  title={`Localização da ${CLINIC_CONFIG.name} no Google Maps`}
                  src={CLINIC_CONFIG.contact.mapsEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="h-full min-h-[300px] w-full border-0 sm:min-h-[360px]"
                />
              </div>
              <div className="flex flex-col items-start justify-between gap-3 border-t border-rosegold/25 bg-ivory px-6 py-4 sm:flex-row sm:items-center">
                <p className="text-xs leading-relaxed text-wine-800/75">
                  {CLINIC_CONFIG.contact.address.street} — {CLINIC_CONFIG.contact.address.neighborhood},{' '}
                  {CLINIC_CONFIG.contact.address.city} - {CLINIC_CONFIG.contact.address.state}
                </p>
                <a
                  href={CLINIC_CONFIG.contact.mapsShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary shrink-0 px-5 py-2.5 text-xs"
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
