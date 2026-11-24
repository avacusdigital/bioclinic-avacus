import React from 'react';
import { CLINIC_CONFIG } from '../config/clinic';
import { WhatsAppIcon } from './BrandIcons';

interface WhatsAppFloatProps {
  elevatedAboveBanner: boolean;
}

export const WhatsAppFloat: React.FC<WhatsAppFloatProps> = ({ elevatedAboveBanner }) => {
  return (
    <a
      href={CLINIC_CONFIG.contact.whatsappBaseUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Conversar com a ${CLINIC_CONFIG.name} pelo WhatsApp ${CLINIC_CONFIG.contact.whatsappDisplay}`}
      title="Falar no WhatsApp"
      className={`whatsapp-float-pulse group fixed right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#20bd5a] active:scale-95 sm:right-6 sm:h-[60px] sm:w-[60px] ${
        elevatedAboveBanner ? 'bottom-44 sm:bottom-32' : 'bottom-5 sm:bottom-6'
      }`}
    >
      <WhatsAppIcon className="h-7 w-7 sm:h-8 sm:w-8" />
      <span className="pointer-events-none absolute right-[calc(100%+12px)] hidden whitespace-nowrap rounded-full border border-rosegold/30 bg-ivory/95 px-3.5 py-1.5 text-xs font-semibold text-wine-800 opacity-0 shadow-soft-rose backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:inline-block">
        WhatsApp BioClinic
      </span>
    </a>
  );
};
