import React from 'react';
import { Mail, MapPin, ShieldCheck } from 'lucide-react';
import { CLINIC_CONFIG } from '../config/clinic';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from './BrandIcons';
import { scrollToSectionId } from './Header';
import { LegalDocType } from './LegalAndCookies';

interface FooterProps {
  onOpenLegalDoc: (doc: LegalDocType) => void;
  onOpenCookiePreferences: () => void;
}

const FOOTER_NAV_ORDER = [
  { id: 'inicio', label: 'Início' },
  { id: 'sobre', label: 'Sobre a Clínica' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'antes-e-depois', label: 'Antes e Depois' },
  { id: 'avaliacoes', label: 'Avalie a gente' },
  { id: 'agendamento', label: 'Agendamento' },
  { id: 'contato', label: 'Contato' },
  { id: 'faq', label: 'FAQ' },
] as const;

export const Footer: React.FC<FooterProps> = ({
  onOpenLegalDoc,
  onOpenCookiePreferences,
}) => {
  const currentYear = new Date().getFullYear();

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToSectionId(id);
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <footer className="relative bg-wine-800 text-blush-100">
      <div aria-hidden="true" className="rosegold-hairline h-[2px] w-full opacity-90" />

      <div className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:px-8">
        {/* Três áreas principais equilibradas */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 lg:gap-12">
          {/* ÁREA ESQUERDA — IDENTIDADE DA CLÍNICA */}
          <div className="md:col-span-4">
            {/* Logo oficial perfeitamente circular preservando qualidade e proporção */}
            <div className="inline-flex items-center gap-4">
              <div
                style={{ borderRadius: '50%' }}
                className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-rosegold/80 bg-blush-200 p-1 shadow-soft-rose sm:h-[88px] sm:w-[88px]"
              >
                <img
                  src={CLINIC_CONFIG.logo.circleSrc}
                  alt={CLINIC_CONFIG.logo.alt}
                  width={88}
                  height={88}
                  loading="lazy"
                  style={{ borderRadius: '50%' }}
                  className="h-full w-full rounded-full bg-blush-200 object-contain"
                />
              </div>
              <div>
                <p className="font-serif text-xl font-semibold leading-tight text-ivory sm:text-2xl">
                  {CLINIC_CONFIG.name}
                </p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-rosegold-light">
                  São Luís · MA
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-blush-100/90">
              Beleza e harmonia, cuidado em cada detalhe. Atendimento especializado em estética
              avançada facial e corporal.
            </p>

            {/* Redes sociais oficiais */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href={CLINIC_CONFIG.social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram oficial da ${CLINIC_CONFIG.name} (${CLINIC_CONFIG.social.instagram.label})`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rosegold/55 bg-wine-900/60 text-blush-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-blush-200 hover:bg-blush-200 hover:text-wine-900"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={CLINIC_CONFIG.social.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Facebook da ${CLINIC_CONFIG.social.facebook.label}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rosegold/55 bg-wine-900/60 text-blush-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-blush-200 hover:bg-blush-200 hover:text-wine-900"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* ÁREA CENTRAL — NAVEGAÇÃO VERTICAL EM UMA ÚNICA COLUNA */}
          <div className="md:col-span-3 md:justify-self-center">
            <h3 className="font-serif text-xl font-semibold text-ivory">Navegação</h3>
            <div aria-hidden="true" className="mt-2 h-[1.5px] w-12 bg-rosegold/80" />
            <nav aria-label="Navegação do rodapé" className="mt-4">
              <ul className="flex flex-col space-y-2 text-sm">
                {FOOTER_NAV_ORDER.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => handleAnchorClick(e, link.id)}
                      className="inline-flex items-center gap-2 text-blush-100/85 transition-all duration-200 hover:translate-x-1 hover:text-ivory"
                    >
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 rounded-full bg-rosegold-light/80"
                      />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ÁREA DIREITA — DOIS BLOCOS INDEPENDENTES: CONTATO E ENDEREÇO */}
          <div className="space-y-4 md:col-span-5">
            {/* Bloco Independente 1: Contato */}
            <div className="rounded-2xl border border-rosegold/30 bg-wine-900/40 p-4">
              <h3 className="font-serif text-lg font-semibold text-ivory">Contato</h3>
              <div aria-hidden="true" className="mt-1.5 h-[1px] w-10 bg-rosegold/70" />
              <ul className="mt-3 space-y-2 text-sm text-blush-100/90">
                <li>
                  <a
                    href={CLINIC_CONFIG.contact.whatsappBaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 transition-colors hover:text-ivory"
                  >
                    <WhatsAppIcon className="h-4 w-4 shrink-0 text-[#25D366]" />
                    <span>
                      <strong className="font-medium text-rosegold-light">WhatsApp:</strong>{' '}
                      {CLINIC_CONFIG.contact.whatsappDisplay}
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${CLINIC_CONFIG.contact.email}`}
                    className="inline-flex items-center gap-2.5 transition-colors hover:text-ivory"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-rosegold-light" aria-hidden="true" />
                    <span className="break-all sm:break-normal">
                      <strong className="font-medium text-rosegold-light">E-mail:</strong>{' '}
                      {CLINIC_CONFIG.contact.email}
                    </span>
                  </a>
                </li>
                <li className="inline-flex items-center gap-2.5 text-blush-100/90">
                  <MapPin className="h-4 w-4 shrink-0 text-rosegold-light" aria-hidden="true" />
                  <span>
                    {CLINIC_CONFIG.contact.address.city} - {CLINIC_CONFIG.contact.address.state}
                  </span>
                </li>
              </ul>
            </div>

            {/* Bloco Independente 2: Endereço */}
            <div className="rounded-2xl border border-rosegold/30 bg-wine-900/40 p-4">
              <h3 className="font-serif text-lg font-semibold text-ivory">Endereço</h3>
              <div aria-hidden="true" className="mt-1.5 h-[1px] w-10 bg-rosegold/70" />
              <div className="mt-3 space-y-2 text-sm leading-relaxed text-blush-100/90">
                <p className="flex items-start gap-2.5">
                  <MapPin
                    className="mt-1 h-4 w-4 shrink-0 text-rosegold-light"
                    aria-hidden="true"
                  />
                  <span>{CLINIC_CONFIG.contact.address.full}.</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <ShieldCheck
                    className="h-4 w-4 shrink-0 text-rosegold-light"
                    aria-hidden="true"
                  />
                  <span>
                    <strong className="font-medium text-rosegold-light">
                      Registro profissional:
                    </strong>{' '}
                    {CLINIC_CONFIG.professional.registration}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Linha divisória + Copyright + Desenvolvido por Avacus Digital + Links Legais */}
        <div className="mt-10 border-t border-rosegold/30 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-blush-200/85 lg:flex-row lg:text-left">
            <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              <p>
                © {currentYear} {CLINIC_CONFIG.name}. Todos os direitos reservados.
              </p>
              <span aria-hidden="true" className="hidden text-rosegold/60 sm:inline">
                ·
              </span>
              <p className="text-blush-100/90">
                Desenvolvido por{' '}
                <a
                  href="https://avacusdigital.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold tracking-wide text-rosegold-light underline decoration-rosegold-light/40 underline-offset-4 transition-colors hover:text-ivory hover:decoration-ivory"
                >
                  Avacus Digital
                </a>
              </p>
            </div>

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
