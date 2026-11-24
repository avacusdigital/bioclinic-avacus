import React from 'react';
import { CLINIC_CONFIG, NAV_LINKS } from '../config/clinic';
import { FacebookIcon, InstagramIcon } from './BrandIcons';
import { LegalDocType } from './LegalAndCookies';

interface FooterProps {
  onOpenLegalDoc: (doc: LegalDocType) => void;
  onOpenCookiePreferences: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLegalDoc,
  onOpenCookiePreferences,
}) => {
  const currentYear = new Date().getFullYear();

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="relative bg-wine-800 text-blush-100">
      {/* Filete rose gold superior */}
      <div aria-hidden="true" className="rosegold-hairline h-[2px] w-full opacity-80" />

      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        {/* Três colunas no desktop, vertical no celular */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:gap-14">
          {/* PRIMEIRA COLUNA — IDENTIDADE */}
          <div>
            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full p-[1.5px] rosegold-border-ring shadow-md">
                <img
                  src={CLINIC_CONFIG.logo.circleSrc}
                  alt={CLINIC_CONFIG.logo.alt}
                  width={56}
                  height={56}
                  loading="lazy"
                  className="h-full w-full rounded-full bg-blush-200 object-cover"
                />
              </span>
              <div>
                <p className="font-serif text-2xl font-semibold tracking-wide text-ivory">
                  {CLINIC_CONFIG.name}
                </p>
              </div>
            </div>

            <p className="mt-5 font-serif text-lg italic leading-relaxed text-blush-200/95">
              {CLINIC_CONFIG.tagline}
            </p>

            {/* Redes Sociais Oficiais */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href={CLINIC_CONFIG.social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram oficial da ${CLINIC_CONFIG.name} (${CLINIC_CONFIG.social.instagram.label})`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rosegold/40 bg-wine-900/50 text-blush-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-blush-200 hover:bg-blush-200 hover:text-wine-900"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={CLINIC_CONFIG.social.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Facebook da ${CLINIC_CONFIG.social.facebook.label}`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rosegold/40 bg-wine-900/50 text-blush-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-blush-200 hover:bg-blush-200 hover:text-wine-900"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* SEGUNDA COLUNA — NAVEGAÇÃO */}
          <div>
            <h3 className="font-serif text-2xl font-semibold text-ivory">Navegação</h3>
            <div aria-hidden="true" className="mt-2 h-[1px] w-12 bg-rosegold/70" />
            <nav aria-label="Navegação do rodapé" className="mt-5">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => handleAnchorClick(e, link.id)}
                      className="inline-block text-blush-200/85 transition-colors duration-200 hover:text-ivory"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* TERCEIRA COLUNA — CONTATO E ENDEREÇO */}
          <div>
            <h3 className="font-serif text-2xl font-semibold text-ivory">Contato e Endereço</h3>
            <div aria-hidden="true" className="mt-2 h-[1px] w-12 bg-rosegold/70" />
            <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-blush-200/90">
              <li>
                <span className="font-medium text-rosegold-light">Telefone: </span>
                <a
                  href={CLINIC_CONFIG.contact.phoneHref}
                  className="hover:text-ivory hover:underline"
                >
                  {CLINIC_CONFIG.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <span className="font-medium text-rosegold-light">E-mail: </span>
                <a
                  href={`mailto:${CLINIC_CONFIG.contact.email}`}
                  className="break-all hover:text-ivory hover:underline"
                >
                  {CLINIC_CONFIG.contact.email}
                </a>
              </li>
              <li>
                <span className="font-medium text-rosegold-light">Cidade: </span>
                {CLINIC_CONFIG.contact.address.city} - {CLINIC_CONFIG.contact.address.state}
              </li>
              <li>
                <span className="font-medium text-rosegold-light">Endereço: </span>
                {CLINIC_CONFIG.contact.address.full}.
              </li>
              <li>
                <span className="font-medium text-rosegold-light">Registro profissional: </span>
                {CLINIC_CONFIG.professional.registration}.
              </li>
            </ul>
          </div>
        </div>

        {/* Linha divisória + Copyright dinâmico + Links Legais */}
        <div className="mt-12 border-t border-rosegold/25 pt-7">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-blush-200/80 lg:flex-row lg:text-left">
            <p>
              © {currentYear} {CLINIC_CONFIG.name}. Todos os direitos reservados.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
              <button
                type="button"
                onClick={() => onOpenLegalDoc('privacy')}
                className="transition-colors hover:text-ivory hover:underline"
              >
                Política de Privacidade
              </button>
              <span aria-hidden="true" className="text-rosegold/60">
                |
              </span>
              <button
                type="button"
                onClick={() => onOpenLegalDoc('cookies')}
                className="transition-colors hover:text-ivory hover:underline"
              >
                Política de Cookies
              </button>
              <span aria-hidden="true" className="text-rosegold/60">
                |
              </span>
              <button
                type="button"
                onClick={() => onOpenLegalDoc('terms')}
                className="transition-colors hover:text-ivory hover:underline"
              >
                Termos de Uso
              </button>
              <span aria-hidden="true" className="text-rosegold/60">
                |
              </span>
              <button
                type="button"
                onClick={onOpenCookiePreferences}
                className="text-rosegold-light transition-colors hover:text-ivory hover:underline"
              >
                Preferências de Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
