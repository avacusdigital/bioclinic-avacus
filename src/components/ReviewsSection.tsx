import React from 'react';
import { ExternalLink, MessageSquareHeart, Star } from 'lucide-react';
import { CLINIC_CONFIG } from '../config/clinic';
import { GoogleGIcon } from './BrandIcons';
import { Reveal } from './Reveal';

export const ReviewsSection: React.FC = () => {
  return (
    <section
      id="avaliacoes"
      aria-labelledby="avaliacoes-heading"
      className="relative scroll-mt-16 overflow-hidden bg-blush-100/80 py-12 sm:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-blush-200/90 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Reveal direction="scale">
          <div className="overflow-hidden rounded-[2rem] border border-rosegold/35 bg-ivory p-8 text-center shadow-editorial sm:p-11 lg:p-12">
            <div className="mx-auto flex flex-col items-center">
              <div className="group/badge inline-flex items-center gap-3 rounded-full border border-rosegold/25 bg-blush-50 px-5 py-2.5 shadow-sm transition-shadow duration-300 hover:shadow-soft-rose">
                <GoogleGIcon className="h-6 w-6 transition-transform duration-300 group-hover/badge:scale-105" />
                <div
                  className="flex items-center gap-1"
                  aria-label="Cinco estrelas douradas decorativas"
                >
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star
                      key={star}
                      style={{ transitionDelay: `${star * 35}ms` }}
                      className="h-4 w-4 fill-[#F4B400] text-[#F4B400] transition-transform duration-300 group-hover/badge:scale-110"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <MessageSquareHeart
                  className="h-4 w-4 text-rosegold-dark transition-transform duration-300 group-hover/badge:scale-110"
                  aria-hidden="true"
                />
              </div>

              <h2
                id="avaliacoes-heading"
                className="mt-5 font-serif text-3xl font-semibold text-wine-800 sm:text-4xl lg:text-5xl"
              >
                Avalie a gente no Google
              </h2>

              <div aria-hidden="true" className="mt-3.5 h-[2px] w-16 rounded-full bg-rosegold" />

              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-wine-800/80 sm:text-base">
                Sua opinião é muito importante para a Bio Clínica Avançada. Se você já viveu a
                experiência de atendimento conosco, compartilhe sua avaliação no Google e ajude
                outras pessoas a conhecerem o nosso cuidado.
              </p>

              <div className="mt-7">
                <a
                  href={CLINIC_CONFIG.reviews.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-3 rounded-full border border-rosegold/45 bg-ivory px-8 py-3.5 text-sm font-semibold tracking-wide text-wine-800 shadow-soft-rose transition-all duration-300 hover:-translate-y-0.5 hover:border-wine-800/35 hover:bg-blush-100 hover:shadow-editorial active:scale-[0.98]"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <GoogleGIcon className="h-4 w-4" />
                  </span>
                  <span>Avaliar no Google</span>
                  <ExternalLink
                    className="h-4 w-4 text-rosegold-dark transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
