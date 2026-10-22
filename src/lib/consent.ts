export const IUBENDA_SITE_ID = process.env.NEXT_PUBLIC_IUBENDA_SITE_ID ?? "";
export const IUBENDA_PRIVACY_POLICY_ID = process.env.NEXT_PUBLIC_IUBENDA_PRIVACY_POLICY_ID ?? "";
// Di norma coincide con l'ID della privacy policy.
export const IUBENDA_COOKIE_POLICY_ID = process.env.NEXT_PUBLIC_IUBENDA_COOKIE_POLICY_ID || IUBENDA_PRIVACY_POLICY_ID;
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export const iubendaConfigured = Boolean(IUBENDA_SITE_ID && IUBENDA_COOKIE_POLICY_ID);
export const analyticsConfigured = Boolean(iubendaConfigured && GA_ID);

/** Finalità iubenda "Misurazione" (Google Analytics). */
export const MEASUREMENT_PURPOSE = "4";

/**
 * Script inline eseguito prima di tutto il resto:
 * - Consent Mode v2 con tutto `denied` di default;
 * - configurazione iubenda con callback che caricano GA4 solo dopo il consenso alla misurazione.
 * Prima del consenso gtag.js non viene scaricato: nessun cookie e nessuna richiesta a Google.
 */
export function consentBootstrapScript() {
  const config = {
    siteId: Number(IUBENDA_SITE_ID),
    cookiePolicyId: Number(IUBENDA_COOKIE_POLICY_ID),
    lang: "it",
    perPurposeConsent: true,
    enableTcf: false,
    googleConsentMode: false,
    floatingPreferencesButtonDisplay: false,
    banner: {
      position: "float-bottom-center",
      acceptButtonDisplay: true,
      rejectButtonDisplay: true,
      customizeButtonDisplay: true,
      closeButtonRejects: true,
      explicitWithdrawal: true,
    },
  };

  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
window.__bfAnalytics = { granted: false, loaded: false };
window.__bfSetMeasurement = function (granted) {
  var state = window.__bfAnalytics;
  gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
  state.granted = granted;
  if (!granted || state.loaded || !${JSON.stringify(GA_ID)}) return;
  state.loaded = true;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ${JSON.stringify(GA_ID)};
  document.head.appendChild(s);
  gtag('js', new Date());
  gtag('config', ${JSON.stringify(GA_ID)}, { send_page_view: false });
  gtag('event', 'page_view', { page_location: location.href, page_title: document.title });
};
function __bfReadPreference(preference) {
  if (!preference) return;
  var purposes = preference.purposes || {};
  var granted = purposes[${JSON.stringify(MEASUREMENT_PURPOSE)}] === true || (preference.consent === true && !preference.purposes);
  window.__bfSetMeasurement(granted);
}
var _iub = window._iub = window._iub || [];
_iub.csConfiguration = Object.assign(${JSON.stringify(config)}, {
  callback: {
    onPreferenceExpressedOrNotNeeded: __bfReadPreference,
    onPreferenceExpressed: __bfReadPreference
  }
});
`;
}
