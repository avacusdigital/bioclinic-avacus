import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { CLINIC_CONFIG, NAV_LINKS } from '../config/clinic';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('inicio');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
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
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${id}`);
      setActiveSection(id);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-500 ${
        scrolled
          ? 'border-b border-rosegold/25 bg-ivory/95 py-2.5 shadow-[0_10px_34px_-16px_rgba(74,16,16,0.16)] backdrop-blur-md'
          : 'border-b border-transparent bg-ivory/80 py-4 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Identidade à esquerda: Logo circular + Nome */}
        <a
          href="#inicio"
          onClick={(e) => handleNavClick(e, 'inicio')}
          className="group flex items-center gap-3 focus-visible:rounded-full"
          aria-label={`${CLINIC_CONFIG.name} — Ir para o início`}
        >
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full p-[1.5px] rosegold-border-ring shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12">
            <img
              src={CLINIC_CONFIG.logo.circleSrc}
              alt={CLINIC_CONFIG.logo.alt}
              width={48}
              height={48}
              className="h-full w-full rounded-full bg-blush-200 object-cover"
            />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-lg font-semibold tracking-wide text-wine-800 sm:text-xl">
              BioClinic
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-rosegold-dark sm:text-[11px]">
              Estética Avançada
            </span>
          </div>
        </a>

        {/* Navegação horizontal Desktop (sem botão WhatsApp no header) */}
        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => handleNavClick(e, link.id)}
                    aria-current={isActive ? 'location' : undefined}
                    className={`relative rounded-full px-3 py-2 text-[13px] font-medium tracking-wide transition-all duration-300 xl:px-3.5 ${
                      isActive
                        ? 'bg-blush-200/80 text-wine-800'
                        : 'text-wine-800/80 hover:bg-blush-100 hover:text-wine-800'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-1 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-rosegold"
                      />
                    )}
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
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rosegold/35 bg-blush-50 text-wine-800 transition-all duration-300 hover:bg-blush-200/70 active:scale-95 lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Menu Mobile */}
      <div
        id="mobile-navigation"
        aria-hidden={!mobileOpen}
        className={`fixed inset-x-0 top-[68px] z-40 transition-all duration-300 lg:hidden ${
          mobileOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-3 opacity-0'
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 top-[68px] bg-wine-900/25 backdrop-blur-[2px]"
          aria-hidden="true"
        />

        {/* Drawer compacto e elegante */}
        <nav
          aria-label="Navegação móvel"
          className="relative mx-4 mt-2 overflow-hidden rounded-3xl border border-rosegold/30 bg-ivory/95 p-4 shadow-editorial backdrop-blur-xl"
        >
          <ul className="grid grid-cols-1 gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => handleNavClick(e, link.id)}
                    tabIndex={mobileOpen ? 0 : -1}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blush-200/80 text-wine-800'
                        : 'text-wine-800/85 hover:bg-blush-100'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full transition-opacity ${
                        isActive ? 'bg-rosegold opacity-100' : 'opacity-0'
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 border-t border-rosegold/20 px-4 pt-3 text-center text-[11px] tracking-wider text-wine-800/65">
            {CLINIC_CONFIG.professional.name} · {CLINIC_CONFIG.professional.registration}
          </div>
        </nav>
      </div>
    </header>
  );
};
