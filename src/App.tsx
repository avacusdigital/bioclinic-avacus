import React, { useEffect, useState } from 'react';
import { ServiceItem } from './config/clinic';
import { useGlobalRevealInit } from './hooks/useReveal';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { BeforeAfterSection } from './components/BeforeAfterSection';
import { ReviewsSection } from './components/ReviewsSection';
import { BookingSection } from './components/BookingSection';
import { ContactSection } from './components/ContactSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import {
  CookieBanner,
  CookiePreferences,
  CookiePreferencesModal,
  LegalDocType,
  LegalDocumentModal,
  loadStoredConsent,
} from './components/LegalAndCookies';

export const App: React.FC = () => {
  useGlobalRevealInit();

  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [preselectNonce, setPreselectNonce] = useState<number>(0);

  // Estado LGPD / Cookies
  const [cookieConsent, setCookieConsent] = useState<CookiePreferences | null>(null);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [cookieModalOpen, setCookieModalOpen] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType | null>(null);

  useEffect(() => {
    const existing = loadStoredConsent();
    if (existing) {
      setCookieConsent(existing);
      setShowCookieBanner(false);
    } else {
      setShowCookieBanner(true);
    }
  }, []);

  const handleSelectServiceFromCatalog = (service: ServiceItem) => {
    setSelectedService(service);
    setSelectedServiceId(service.id);
    setPreselectNonce((n) => n + 1);
  };

  const applyConsent = (analytics: boolean, marketing: boolean) => {
    const prefs: CookiePreferences = {
      necessary: true,
      analytics,
      marketing,
      updatedAt: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem('bioclinic_cookie_consent_v1', JSON.stringify(prefs));
    } catch {
      // Ignora erro de storage bloqueado
    }
    setCookieConsent(prefs);
    setShowCookieBanner(false);
    setCookieModalOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-wine-800">
      {/* Atalho de acessibilidade para leitores de tela e teclado */}
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-wine-800 focus:px-5 focus:py-2.5 focus:text-xs focus:font-semibold focus:text-blush-50 focus:shadow-editorial"
      >
        Pular para o conteúdo principal
      </a>

      <Header />

      <main id="conteudo-principal" className="flex-1">
        {/* 1. Início — Hero */}
        <HeroSection />

        {/* 2. Serviços */}
        <ServicesSection
          selectedServiceId={selectedServiceId}
          onSelectService={handleSelectServiceFromCatalog}
        />

        {/* 3. Sobre a Clínica */}
        <AboutSection />

        {/* 4. Antes e Depois */}
        <BeforeAfterSection />

        {/* 5. Avaliações */}
        <ReviewsSection />

        {/* 6. Agendamento */}
        <BookingSection
          preselectedService={selectedService}
          preselectNonce={preselectNonce}
          onSyncSelectedService={setSelectedServiceId}
        />

        {/* 7. Contato */}
        <ContactSection />

        {/* 8. FAQ */}
        <FaqSection />
      </main>

      {/* 9. Rodapé */}
      <Footer
        onOpenLegalDoc={setActiveLegalDoc}
        onOpenCookiePreferences={() => setCookieModalOpen(true)}
      />

      {/* Botão flutuante oficial do WhatsApp */}
      <WhatsAppFloat elevatedAboveBanner={showCookieBanner} />

      {/* Banner de Consentimento de Cookies (primeira visita) */}
      <CookieBanner
        visible={showCookieBanner}
        onAcceptAll={() => applyConsent(true, true)}
        onRejectNonEssential={() => applyConsent(false, false)}
        onCustomize={() => setCookieModalOpen(true)}
        onOpenCookiePolicy={() => setActiveLegalDoc('cookies')}
      />

      {/* Modal de Preferências de Cookies */}
      <CookiePreferencesModal
        open={cookieModalOpen}
        initialPreferences={cookieConsent}
        onClose={() => setCookieModalOpen(false)}
        onSave={(prefs) => {
          setCookieConsent(prefs);
          setShowCookieBanner(false);
          setCookieModalOpen(false);
        }}
      />

      {/* Modais de Política de Privacidade, Política de Cookies e Termos de Uso */}
      <LegalDocumentModal
        activeDoc={activeLegalDoc}
        onClose={() => setActiveLegalDoc(null)}
        onOpenCookiePreferences={() => setCookieModalOpen(true)}
      />
    </div>
  );
};

export default App;
