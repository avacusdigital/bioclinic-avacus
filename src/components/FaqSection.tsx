import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../config/clinic';
import { Reveal } from './Reveal';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative scroll-mt-16 surface-blush-gradient py-10 sm:py-12 lg:py-14"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal direction="up">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rosegold-dark">
              Dúvidas Frequentes
            </span>
            <h2
              id="faq-heading"
              className="mt-1 font-serif text-3xl font-semibold text-wine-800 sm:text-4xl lg:text-[2.6rem]"
            >
              FAQ
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-wine-800/75">
              Esclareça as principais dúvidas sobre nossos atendimentos. Cada indicação é sempre
              avaliada individualmente pela profissional responsável.
            </p>
          </Reveal>
        </div>

        <div className="mt-7 space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openId === item.id;
            const panelId = `faq-panel-${item.id}`;
            const buttonId = `faq-trigger-${item.id}`;

            return (
              <Reveal
                key={item.id}
                direction={idx % 2 === 0 ? 'left' : 'right'}
                delayMs={idx * 55}
              >
                <div
                  className={`overflow-hidden rounded-3xl border bg-ivory transition-all duration-300 ${
                    isOpen
                      ? 'border-rosegold/60 shadow-soft-rose'
                      : 'border-rosegold/25 shadow-card hover:border-rosegold/50'
                  }`}
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleItem(item.id)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors sm:px-6 sm:py-5"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-serif text-base font-semibold text-rosegold-dark sm:text-lg">
                          0{idx + 1}.
                        </span>
                        <span className="font-serif text-lg font-semibold leading-snug text-wine-800 sm:text-xl">
                          {item.question}
                        </span>
                      </span>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 sm:h-9 sm:w-9 ${
                          isOpen
                            ? 'rotate-180 border-wine-800 bg-wine-800 text-blush-50'
                            : 'border-rosegold/45 bg-blush-50 text-wine-800'
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
                    style={{
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-rosegold/20 px-5 pb-5 pt-3.5 text-sm leading-relaxed text-wine-800/80 sm:px-6 sm:pl-14">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
