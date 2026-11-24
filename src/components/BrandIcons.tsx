import React from 'react';

interface IconProps {
  className?: string;
}

/**
 * Ícone oficial da marca WhatsApp (silhueta clássica do telefone no símbolo oficial).
 */
export const WhatsAppIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 32 32"
    fill="currentColor"
    aria-hidden="true"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16.004 2.667C8.64 2.667 2.667 8.637 2.667 16c0 2.352.614 4.647 1.78 6.669L2.56 29.44l6.942-1.82A13.28 13.28 0 0 0 16.004 29.333C23.364 29.333 29.333 23.363 29.333 16S23.364 2.667 16.004 2.667Zm0 24.42c-2.012 0-3.98-.54-5.7-1.563l-.409-.243-4.12 1.08 1.1-4.017-.266-.424A10.977 10.977 0 0 1 4.913 16c0-6.116 4.976-11.09 11.091-11.09 2.963 0 5.747 1.155 7.841 3.251A11.015 11.015 0 0 1 27.093 16c0 6.115-4.976 11.088-11.089 11.088Zm6.085-8.308c-.333-.167-1.972-.973-2.278-1.084-.306-.111-.528-.167-.75.167-.223.333-.861 1.084-1.056 1.307-.194.222-.389.25-.722.083-.333-.167-1.408-.519-2.681-1.654-.99-.884-1.66-1.975-1.855-2.308-.194-.334-.021-.514.146-.68.15-.149.334-.389.5-.583.167-.195.223-.334.334-.556.111-.223.055-.417-.028-.584-.083-.167-.75-1.807-1.028-2.474-.271-.65-.546-.562-.75-.572a12.7 12.7 0 0 0-.639-.011c-.223 0-.584.083-.89.417-.305.333-1.167 1.14-1.167 2.78 0 1.64 1.195 3.225 1.362 3.448.167.222 2.352 3.59 5.697 5.035.796.344 1.417.549 1.901.703.799.254 1.526.218 2.1.132.64-.096 1.972-.806 2.25-1.585.278-.778.278-1.445.195-1.585-.083-.139-.306-.222-.639-.389Z" />
  </svg>
);

/**
 * Ícone oficial multicolorido "G" do Google.
 */
export const GoogleGIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
    />
    <path
      fill="#34A853"
      d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09Z"
    />
    <path
      fill="#EA4335"
      d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96Z"
    />
  </svg>
);

/**
 * Ícone oficial Instagram.
 */
export const InstagramIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * Ícone oficial Facebook.
 */
export const FacebookIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13.5 21.5v-8.2h2.75l.42-3.2H13.5V8.05c0-.93.26-1.56 1.59-1.56h1.7V3.63c-.29-.04-1.3-.13-2.48-.13-2.45 0-4.13 1.5-4.13 4.24v2.36H7.4v3.2h2.78v8.2h3.32Z" />
  </svg>
);
