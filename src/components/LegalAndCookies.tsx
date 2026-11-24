import React, { useEffect, useState } from 'react';
import { Cookie, Shield, SlidersHorizontal, X } from 'lucide-react';
import { CLINIC_CONFIG } from '../config/clinic';

export type LegalDocType = 'privacy' | 'cookies' | 'terms';

export interface CookiePreferences {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

const CONSENT_STORAGE_KEY = 'bioclinic_cookie_consent_v1';

export function loadStoredConsent(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookiePreferences>;
    if (typeof parsed.analytics === 'boolean' && typeof parsed.marketing === 'boolean') {
      return {
        necessary: true,
        analytics: parsed.analytics,
        marketing: parsed.marketing,
        updatedAt: parsed.updatedAt || new Date().toISOString(),
      };
    }
    return null;
  } catch {
    return null;
  }
}

function saveConsent(prefs: CookiePreferences): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Armazenamento indisponível em modo restrito
  }
}

interface CookieBannerProps {
  visible: boolean;
  onAcceptAll: () => void;
  onRejectNonEssential: () => void;
  onCustomize: () => void;
  onOpenCookiePolicy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({
  visible,
  onAcceptAll,
  onRejectNonEssential,
  onCustomize,
  onOpenCookiePolicy,
}) => {
  if (!visible) return null;

  return (
    <aside
      role="dialog"
      aria-label="Consentimento de cookies"
      className="animate-step-in fixed inset-x-3 bottom-3 z-50 mx-auto max-w-5xl rounded-3xl border border-rosegold/40 bg-ivory/95 p-5 shadow-editorial backdrop-blur-xl sm:inset-x-6 sm:bottom-5 sm:p-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blush-200 text-wine-800">
            <Cookie className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="text-xs leading-relaxed text-wine-800/85 sm:text-[13px]">
            <p className="font-semibold text-wine-800">Sua privacidade na {CLINIC_CONFIG.name}</p>
            <p className="mt-1">
              Utilizamos cookies estritamente necessários para o funcionamento seguro deste site.
              Cookies analíticos e de marketing permanecem desativados até o seu consentimento.
              Consulte nossa{' '}
              <button
                type="button"
                onClick={onOpenCookiePolicy}
                className="font-semibold text-wine-800 underline decoration-rosegold underline-offset-2 hover:text-wine-700"
              >
                Política de Cookies
              </button>
              .
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 lg:shrink-0">
          <button
            type="button"
            onClick={onCustomize}
            className="inline-flex items-center gap-1.5 rounded-full border border-rosegold/45 bg-ivory px-4 py-2.5 text-xs font-medium text-wine-800 transition-all hover:bg-blush-100"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Personalizar</span>
          </button>
          <button
            type="button"
            onClick={onRejectNonEssential}
            className="rounded-full border border-wine-800/30 bg-blush-100 px-4 py-2.5 text-xs font-semibold text-wine-800 transition-all hover:bg-blush-200"
          >
            Rejeitar não essenciais
          </button>
          <button
            type="button"
            onClick={onAcceptAll}
            className="rounded-full bg-wine-800 px-5 py-2.5 text-xs font-semibold text-blush-50 shadow-sm transition-all hover:bg-wine-700"
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </aside>
  );
};

interface CookiePreferencesModalProps {
  open: boolean;
  initialPreferences: CookiePreferences | null;
  onClose: () => void;
  onSave: (prefs: CookiePreferences) => void;
}

export const CookiePreferencesModal: React.FC<CookiePreferencesModalProps> = ({
  open,
  initialPreferences,
  onClose,
  onSave,
}) => {
  const [analytics, setAnalytics] = useState(initialPreferences?.analytics ?? false);
  const [marketing, setMarketing] = useState(initialPreferences?.marketing ?? false);

  useEffect(() => {
    setAnalytics(initialPreferences?.analytics ?? false);
    setMarketing(initialPreferences?.marketing ?? false);
  }, [initialPreferences, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSave = () => {
    const next: CookiePreferences = {
      necessary: true,
      analytics,
      marketing,
      updatedAt: new Date().toISOString(),
    };
    saveConsent(next);
    onSave(next);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-prefs-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-wine-900/45 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-step-in max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[2rem] border border-rosegold/35 bg-ivory p-6 shadow-editorial sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-rosegold-dark">
              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              <span>LGPD & Privacidade</span>
            </span>
            <h3 id="cookie-prefs-title" className="mt-1 font-serif text-3xl font-semibold text-wine-800">
              Preferências de Cookies
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar preferências de cookies"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-rosegold/35 text-wine-800 hover:bg-blush-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-wine-800/75 sm:text-sm">
          Gerencie suas escolhas de consentimento. Cookies não essenciais permanecem desativados por
          padrão e só são ativados caso você autorize.
        </p>

        <div className="mt-6 space-y-4">
          {/* Estritamente Necessários */}
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-rosegold/25 bg-blush-50 p-4">
            <div>
              <p className="text-sm font-semibold text-wine-800">Estritamente Necessários</p>
              <p className="mt-1 text-xs leading-relaxed text-wine-800/75">
                Essenciais para a navegação segura, acessibilidade e armazenamento da sua escolha de
                cookies. Sempre ativos.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-wine-800/10 px-3 py-1 text-[11px] font-semibold text-wine-800">
              Sempre ativo
            </span>
          </div>

          {/* Analíticos */}
          <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-rosegold/25 bg-ivory p-4 transition-colors hover:bg-blush-50/70">
            <div>
              <p className="text-sm font-semibold text-wine-800">Cookies Analíticos</p>
              <p className="mt-1 text-xs leading-relaxed text-wine-800/75">
                Ajudam a compreender estatísticas agregadas de acesso e desempenho do site, caso
                ferramentas de medição sejam habilitadas futuramente.
              </p>
            </div>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 accent-wine-800"
            />
          </label>

          {/* Marketing */}
          <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-rosegold/25 bg-ivory p-4 transition-colors hover:bg-blush-50/70">
            <div>
              <p className="text-sm font-semibold text-wine-800">Cookies de Marketing</p>
              <p className="mt-1 text-xs leading-relaxed text-wine-800/75">
                Utilizados apenas quando autorizados para mensuração de campanhas de comunicação
                externas. Desativados por padrão.
              </p>
            </div>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 accent-wine-800"
            />
          </label>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => {
              const next: CookiePreferences = {
                necessary: true,
                analytics: false,
                marketing: false,
                updatedAt: new Date().toISOString(),
              };
              saveConsent(next);
              onSave(next);
            }}
            className="btn-secondary py-2.5 text-xs"
          >
            Rejeitar não essenciais
          </button>
          <button type="button" onClick={handleSave} className="btn-primary py-2.5 text-xs">
            Salvar preferências
          </button>
        </div>
      </div>
    </div>
  );
};

interface LegalDocumentModalProps {
  activeDoc: LegalDocType | null;
  onClose: () => void;
  onOpenCookiePreferences: () => void;
}

export const LegalDocumentModal: React.FC<LegalDocumentModalProps> = ({
  activeDoc,
  onClose,
  onOpenCookiePreferences,
}) => {
  useEffect(() => {
    if (!activeDoc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [activeDoc, onClose]);

  if (!activeDoc) return null;

  const titles: Record<LegalDocType, string> = {
    privacy: 'Política de Privacidade (LGPD)',
    cookies: 'Política de Cookies',
    terms: 'Termos de Uso',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-wine-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-step-in flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-rosegold/35 bg-ivory shadow-editorial"
      >
        <div className="flex items-center justify-between border-b border-rosegold/20 bg-blush-50 px-6 py-5 sm:px-8">
          <h3 id="legal-modal-title" className="font-serif text-3xl font-semibold text-wine-800">
            {titles[activeDoc]}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar documento"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-rosegold/35 text-wine-800 hover:bg-blush-200/70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto px-6 py-6 text-sm leading-relaxed text-wine-800/85 sm:px-8">
          {activeDoc === 'privacy' && (
            <>
              <p>
                A <strong>{CLINIC_CONFIG.name}</strong> respeita a sua privacidade e trata dados
                pessoais em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº
                13.709/2018 — LGPD).
              </p>

              <h4 className="font-serif text-2xl font-semibold text-wine-800">
                1. Quais dados são coletados
              </h4>
              <p>
                Ao utilizar o formulário de solicitação de agendamento neste site, coletamos apenas
                os dados estritamente necessários para encaminhar seu pedido ao WhatsApp da clínica:
                nome completo, endereço de e-mail, número de telefone/WhatsApp, procedimento de
                interesse, data e horário desejados. Não solicitamos dados sensíveis de saúde nem
                endereço residencial no site.
              </p>

              <h4 className="font-serif text-2xl font-semibold text-wine-800">
                2. Finalidade e forma de utilização
              </h4>
              <p>
                As informações preenchidas no formulário são organizadas localmente no seu
                navegador para gerar a mensagem enviada voluntariamente por você ao WhatsApp oficial
                da clínica ({CLINIC_CONFIG.contact.whatsappDisplay}). A equipe utiliza esses dados
                unicamente para responder à sua solicitação, verificar disponibilidade e confirmar o
                atendimento.
              </p>

              <h4 className="font-serif text-2xl font-semibold text-wine-800">
                3. Compartilhamento com terceiros
              </h4>
              <p>
                Ao prosseguir para o envio via WhatsApp ou acessar o mapa incorporado do Google Maps
                e o link de avaliações do Google, aplicam-se também as respectivas políticas de
                privacidade dessas plataformas externas. Não comercializamos nem cedemos dados
                pessoais a terceiros para fins publicitários.
              </p>

              <h4 className="font-serif text-2xl font-semibold text-wine-800">
                4. Direitos dos titulares (Art. 18 da LGPD)
              </h4>
              <p>
                Você pode solicitar, a qualquer momento: confirmação da existência de tratamento,
                acesso aos dados, correção de dados incompletos ou desatualizados, eliminação de
                dados tratados com consentimento, revogação do consentimento e informações sobre
                eventual compartilhamento.
              </p>

              <h4 className="font-serif text-2xl font-semibold text-wine-800">
                5. Canais de contato e identificação do controlador
              </h4>
              <p>
                <strong>Controlador:</strong> {CLINIC_CONFIG.name} — Responsável:{' '}
                {CLINIC_CONFIG.professional.name} ({CLINIC_CONFIG.professional.registration})
                <br />
                <strong>Endereço:</strong> {CLINIC_CONFIG.contact.address.full}
                <br />
                <strong>E-mail para assuntos de privacidade:</strong> {CLINIC_CONFIG.contact.email}
                <br />
                <strong>Telefone / WhatsApp:</strong> {CLINIC_CONFIG.contact.phoneDisplay}
              </p>

              <div className="rounded-2xl border border-rosegold/35 bg-blush-100/75 p-4 text-xs text-wine-800">
                <strong>Nota de revisão antes da publicação:</strong> Caso aplicável à estrutura
                jurídica da clínica, incluir antes do lançamento oficial a Razão Social, o número de
                CNPJ e a identificação formal do Encarregado pelo Tratamento de Dados Pessoais
                (DPO).
              </div>
            </>
          )}

          {activeDoc === 'cookies' && (
            <>
              <p>
                Esta Política de Cookies explica o que são cookies e tecnologias semelhantes, como a{' '}
                <strong>{CLINIC_CONFIG.name}</strong> os utiliza neste site e como você pode
                gerenciar suas preferências.
              </p>

              <h4 className="font-serif text-2xl font-semibold text-wine-800">
                1. Categorias de cookies
              </h4>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Estritamente necessários:</strong> indispensáveis para o funcionamento
                  técnico do site e para registrar sua escolha no banner de consentimento. Não podem
                  ser desativados.
                </li>
                <li>
                  <strong>Analíticos (opcionais):</strong> permanecem desativados por padrão e só
                  poderão ser carregados caso você conceda consentimento expresso.
                </li>
                <li>
                  <strong>Marketing (opcionais):</strong> permanecem desativados por padrão e só
                  poderão ser utilizados mediante autorização expressa do titular.
                </li>
              </ul>

              <h4 className="font-serif text-2xl font-semibold text-wine-800">
                2. Como alterar ou revogar seu consentimento
              </h4>
              <p>
                Você pode revisar ou modificar suas escolhas a qualquer momento clicando no botão
                abaixo ou no link &ldquo;Preferências de Cookies&rdquo; disponível no rodapé deste
                site.
              </p>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCookiePreferences();
                }}
                className="btn-secondary py-2.5 text-xs"
              >
                Abrir Preferências de Cookies
              </button>
            </>
          )}

          {activeDoc === 'terms' && (
            <>
              <p>
                Ao acessar e navegar no site institucional da <strong>{CLINIC_CONFIG.name}</strong>,
                você concorda com os presentes Termos de Uso.
              </p>

              <h4 className="font-serif text-2xl font-semibold text-wine-800">
                1. Caráter informativo do conteúdo
              </h4>
              <p>
                As informações apresentadas sobre procedimentos estéticos faciais e corporais possuem
                caráter exclusivamente informativo e não substituem avaliação presencial realizada
                pela profissional responsável ({CLINIC_CONFIG.professional.name} —{' '}
                {CLINIC_CONFIG.professional.registration}).
              </p>

              <h4 className="font-serif text-2xl font-semibold text-wine-800">
                2. Solicitação de agendamento
              </h4>
              <p>
                O preenchimento do formulário de agendamento no site envia uma solicitação ao
                WhatsApp oficial da clínica e não constitui reserva automática de horário. A
                confirmação da data e do horário depende de validação pela equipe de atendimento.
              </p>

              <h4 className="font-serif text-2xl font-semibold text-wine-800">
                3. Galeria ilustrativa
              </h4>
              <p>
                Imagens identificadas como demonstrações ilustrativas têm finalidade exclusiva de
                apresentação visual da interface e não representam promessa ou garantia de resultado
                clínico individual.
              </p>

              <h4 className="font-serif text-2xl font-semibold text-wine-800">
                4. Propriedade intelectual
              </h4>
              <p>
                A marca, o logotipo oficial, os textos institucionais e o design deste site pertencem
                à {CLINIC_CONFIG.name} e são protegidos pela legislação aplicável.
              </p>

              <div className="rounded-2xl border border-rosegold/35 bg-blush-100/75 p-4 text-xs text-wine-800">
                <strong>Nota de revisão antes da publicação:</strong> Confirmar razão social, CNPJ e
                foro competente conforme orientação jurídica da clínica antes da publicação final.
              </div>
            </>
          )}
        </div>

        <div className="border-t border-rosegold/20 bg-blush-50/70 px-6 py-4 text-right sm:px-8">
          <button type="button" onClick={onClose} className="btn-primary py-2.5 text-xs">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
