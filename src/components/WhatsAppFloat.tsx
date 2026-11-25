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
      style={{
        right: 'max(1rem, env(safe-area-inset-right))',
        bottom: elevatedAboveBanner ? undefined : 'max(1.25rem, env(safe-area-inset-bottom))',
      }}
      className={`whatsapp-float-pulse group fixed z-40 inline-flex h-14 w-14 touch-manipulation items-center justify-center rounded-full bg-[#25D366] text-white shadow-editorial transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#20bd5a] active:scale-95 sm:h-[58px] sm:w-[58px] ${
        elevatedAboveBanner ? 'bottom-[13.5rem] sm:bottom-28' : ''
      }`}
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span className="pointer-events-none absolute right-[calc(100%+12px)] hidden whitespace-nowrap rounded-full border border-rosegold/35 bg-ivory/95 px-3.5 py-1.5 text-xs font-semibold text-wine-800 opacity-0 shadow-soft-rose backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:inline-block">
        WhatsApp BioClinic
      </span>
    </a>
  );
};
