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
      className="relative overflow-hidden bg-blush-100/80 py-20 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-blush-200/90 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Reveal direction="scale">
          <div className="overflow-hidden rounded-[2.25rem] border border-rosegold/35 bg-ivory p-8 text-center shadow-editorial sm:p-12 lg:p-14">
            {/* Selo Google oficial + estrelas douradas */}
            <div className="mx-auto flex flex-col items-center">
              <div className="inline-flex items-center gap-3 rounded-full border border-rosegold/25 bg-blush-50 px-5 py-2.5 shadow-sm">
                <GoogleGIcon className="h-6 w-6" />
                <div
                  className="flex items-center gap-1"
                  aria-label="Cinco estrelas douradas decorativas"
                >
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-[#F4B400] text-[#F4B400]"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <MessageSquareHeart
                  className="h-4 w-4 text-rosegold-dark"
                  aria-hidden="true"
                />
              </div>

              <h2
                id="avaliacoes-heading"
                className="mt-6 font-serif text-4xl font-semibold text-wine-800 sm:text-5xl"
              >
                Avaliações
              </h2>

              <div aria-hidden="true" className="mt-4 h-[1.5px] w-16 bg-rosegold" />

              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-wine-800/80 sm:text-base">
                Sua opinião é muito importante para a {CLINIC_CONFIG.name}. Se você já viveu a
                experiência de atendimento conosco, compartilhe sua avaliação no Google e ajude
                outras pessoas a conhecerem nosso cuidado.
              </p>

              {/* Botão destacado Avaliar no Google com ícone G multicolorido oficial */}
              <div className="mt-8">
                <a
                  href={CLINIC_CONFIG.reviews.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-3 rounded-full border border-rosegold/45 bg-ivory px-8 py-4 text-sm font-semibold tracking-wide text-wine-800 shadow-soft-rose transition-all duration-300 hover:-translate-y-0.5 hover:border-wine-800/35 hover:bg-blush-100 hover:shadow-editorial active:scale-[0.98]"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
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
