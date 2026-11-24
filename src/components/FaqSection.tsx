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
      className="relative surface-blush-gradient py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal direction="up">
            <span className="font-script text-4xl text-rosegold-dark">Dúvidas Frequentes</span>
            <h2
              id="faq-heading"
              className="mt-1 font-serif text-4xl font-semibold text-wine-800 sm:text-5xl"
            >
              FAQ
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-wine-800/75 sm:text-base">
              Esclareça as principais dúvidas sobre nossos atendimentos. Cada indicação é sempre
              avaliada individualmente pela profissional responsável.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 space-y-3.5">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openId === item.id;
            const panelId = `faq-panel-${item.id}`;
            const buttonId = `faq-trigger-${item.id}`;

            return (
              <Reveal
                key={item.id}
                direction={idx % 2 === 0 ? 'left' : 'right'}
                delayMs={idx * 65}
              >
                <div
                  className={`overflow-hidden rounded-3xl border bg-ivory transition-all duration-300 ${
                    isOpen
                      ? 'border-rosegold/55 shadow-soft-rose'
                      : 'border-rosegold/25 shadow-card hover:border-rosegold/45'
                  }`}
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleItem(item.id)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors sm:px-7 sm:py-6"
                    >
                      <span className="flex items-baseline gap-3.5">
                        <span className="font-serif text-lg font-medium text-rosegold-dark">
                          0{idx + 1}.
                        </span>
                        <span className="font-serif text-xl font-semibold leading-snug text-wine-800 sm:text-2xl">
                          {item.question}
                        </span>
                      </span>
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                          isOpen
                            ? 'rotate-180 border-wine-800 bg-wine-800 text-blush-50'
                            : 'border-rosegold/40 bg-blush-50 text-wine-800'
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
                    className="grid transition-[grid-template-rows,opacity] duration-400 ease-out"
                    style={{
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-rosegold/15 px-6 pb-6 pt-4 text-sm leading-relaxed text-wine-800/80 sm:px-7 sm:pl-16 sm:text-[15px]">
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
