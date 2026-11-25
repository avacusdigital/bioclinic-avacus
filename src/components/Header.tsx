import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { CLINIC_CONFIG, NAV_LINKS } from '../config/clinic';

export function scrollToSectionId(id: string): void {
  const target = document.getElementById(id);
  if (!target) return;
  const header = document.querySelector('header');
  const headerHeight = header ? header.getBoundingClientRect().height : 64;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;
  window.scrollTo({
    top: Math.max(0, Math.round(targetTop)),
    behavior: 'smooth',
  });
}

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('inicio');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 18);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: 0 },
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileOpen(false);
    scrollToSectionId(id);
    window.history.replaceState(null, '', `#${id}`);
    setActiveSection(id);
  };

  return (
    <header
      className={`sticky top-0 z-40 h-16 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-rosegold/30 bg-ivory/95 shadow-[0_10px_28px_-16px_rgba(74,16,16,0.18)] backdrop-blur-md'
          : 'border-b border-rosegold/15 bg-ivory/90 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Identidade à esquerda: Logo circular com maior destaque + Nome */}
        <a
          href="#inicio"
          onClick={(e) => handleNavClick(e, 'inicio')}
          className="group flex items-center gap-3 focus-visible:rounded-full"
          aria-label={`${CLINIC_CONFIG.name} — Ir para o início`}
        >
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full p-[1.5px] rosegold-border-ring shadow-sm transition-transform duration-300 group-hover:scale-105">
            <img
              src={CLINIC_CONFIG.logo.circleSrc}
              alt={CLINIC_CONFIG.logo.alt}
              width={48}
              height={48}
              className="h-full w-full rounded-full bg-blush-200 object-cover"
            />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-lg font-semibold tracking-wide text-wine-800 sm:text-[1.22rem]">
              BioClinic
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rosegold-dark">
              Estética Avançada
            </span>
          </div>
        </a>

        {/* Navegação horizontal Desktop com linha animada ao passar o mouse */}
        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-0.5 xl:gap-1.5">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => handleNavClick(e, link.id)}
                    data-active={isActive ? 'true' : 'false'}
                    aria-current={isActive ? 'location' : undefined}
                    className={`nav-link-item inline-block rounded-full px-3 py-2 text-[13px] font-medium tracking-wide transition-colors duration-200 xl:px-3.5 ${
                      isActive
                        ? 'bg-blush-200/75 font-semibold text-wine-800'
                        : 'text-wine-800/80 hover:bg-blush-100/70 hover:text-wine-800'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Botão menu hambúrguer Mobile */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rosegold/45 bg-blush-50 text-wine-800 transition-all duration-200 hover:bg-blush-200/75 active:scale-95 lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Menu Mobile: Painel compacto flutuante no lado direito (não ocupa a tela inteira) */}
      <div
        id="mobile-navigation"
        aria-hidden={!mobileOpen}
        className={`fixed left-0 top-16 z-40 h-[calc(100dvh-4rem)] w-screen transition-opacity duration-300 lg:hidden ${
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {/* Backdrop leve com desfoque — fecha ao tocar fora em qualquer ponto da tela */}
        <div
          onClick={() => setMobileOpen(false)}
          className="h-full w-full bg-wine-900/20 backdrop-blur-[2px]"
          aria-hidden="true"
        />

        {/* Painel compacto alinhado à direita */}
        <nav
          aria-label="Navegação móvel"
          className={`fixed right-3 top-[74px] w-[248px] max-w-[78vw] overflow-hidden rounded-3xl border border-rosegold/40 bg-ivory/95 p-3 shadow-editorial backdrop-blur-xl transition-all duration-300 ${
            mobileOpen ? 'translate-x-0 opacity-100' : 'translate-x-5 opacity-0'
          }`}
        >
          <div className="mb-1.5 flex items-center justify-between border-b border-rosegold/20 px-2.5 pb-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rosegold-dark">
              Menu
            </span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              tabIndex={mobileOpen ? 0 : -1}
              aria-label="Fechar painel de menu"
              className="flex h-7 w-7 items-center justify-center rounded-full text-wine-800/75 transition-colors hover:bg-blush-100 hover:text-wine-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <ul className="flex flex-col gap-0.5">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => handleNavClick(e, link.id)}
                    tabIndex={mobileOpen ? 0 : -1}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blush-200/85 font-semibold text-wine-800'
                        : 'text-wine-800/85 hover:bg-blush-100/80 hover:text-wine-800'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full transition-opacity ${
                        isActive ? 'bg-wine-800 opacity-100' : 'opacity-0'
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
};
