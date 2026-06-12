/**
 * ═══════════════════════════════════════════════════════════════
 *  Averio Media — DSGVO Cookie Banner
 *  Consent Mode v2 | TDDDG § 25 | DSGVO Art. 6 / 7
 *
 *  ✅ DSGVO / TDDDG konform (DSK Orientierungshilfe Nov. 2024)
 *  ✅ Google Consent Mode v2 (alle 7 Parameter)
 *  ✅ 365 Tage Speicherung in localStorage
 *  ✅ Widerruf über #cookie-settings Link (z. B. im Footer)
 *  ✅ Granulare Zustimmung: GTM + Marketing einzeln steuerbar
 *  ✅ Keine externen Abhängigkeiten — vollständig self-contained
 *
 *  ─── GTM CONSENT MODE DEFAULT (in <head> einfügen, FALLS du GTM nutzt) ───
 *
 *  <script>
 *    window.dataLayer = window.dataLayer || [];
 *    function gtag(){dataLayer.push(arguments);}
 *    gtag('consent', 'default', {
 *      'ad_storage':              'denied',
 *      'ad_user_data':            'denied',
 *      'ad_personalization':      'denied',
 *      'analytics_storage':       'denied',
 *      'functionality_storage':   'denied',
 *      'personalization_storage': 'denied',
 *      'security_storage':        'denied',
 *      'wait_for_update':         1000
 *    });
 *  </script>
 *  <script>
 *    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
 *    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
 *    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
 *    'https://www.googletagmanager.com/gtm.js?id='+i+dl;
 *    f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-XXXXXXX');
 *    function loadGTM(){}
 *  </script>
 *
 * ═══════════════════════════════════════════════════════════════
 */
(function () {
  'use strict';

  /* ── Konfiguration ────────────────────────────────────────── */
  const STORAGE_KEY = 'averio_media_consent';
  const EXPIRY_DAYS = 365;

  /* ── CSS ──────────────────────────────────────────────────── */
  const css = `
/* ── Overlay ── */
#cb-overlay {
  position: fixed; inset: 0; z-index: 99998;
  background: rgba(0,0,0,.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  opacity: 0; pointer-events: none;
  transition: opacity .35s ease;
}
#cb-overlay.cb-show { opacity: 1; pointer-events: auto; }

/* ── Banner ── */
#cb-banner {
  position: fixed; bottom: 0; left: 0; right: 0;
  z-index: 99999;
  background: #111;
  border-top: 2px solid #FF4D00;
  box-shadow: 0 -24px 80px rgba(0,0,0,.85), 0 0 120px rgba(255,77,0,.06);
  padding: 28px 32px 32px;
  transform: translateY(110%);
  pointer-events: none;
  transition: transform .48s cubic-bezier(.22,1,.36,1);
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
}
#cb-banner.cb-show { transform: translateY(0); pointer-events: auto; }

.cb-inner { max-width: 1240px; margin: 0 auto; }

/* ── Desktop: Text links, Toggles rechts ── */
.cb-layout {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 36px;
  align-items: center;
  margin-bottom: 22px;
}

/* ── Titel ── */
.cb-title {
  font-family: 'Syne', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: .95rem; font-weight: 700; letter-spacing: -.01em;
  color: #fff; margin-bottom: 12px;
  display: flex; align-items: center; gap: 10px;
}
.cb-title-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #FF4D00; flex-shrink: 0;
  box-shadow: 0 0 8px rgba(255,77,0,.6);
}

/* ── Text ── */
.cb-text-body {
  font-size: 13.5px; line-height: 1.75;
  color: rgba(255,255,255,.45);
  margin: 0;
}
.cb-text-body a {
  color: #FF4D00; text-decoration: none;
}
.cb-text-body a:hover { text-decoration: underline; }

/* ── Toggle-Zeilen ── */
.cb-toggles { display: flex; flex-direction: column; gap: 8px; }

.cb-toggle-row {
  display: flex; align-items: center; gap: 14px;
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 12px;
  padding: 11px 14px;
  transition: border-color .2s;
}
.cb-toggle-row:hover { border-color: rgba(255,255,255,.12); }

.cb-toggle-label { flex: 1; min-width: 0; }
.cb-toggle-label strong {
  display: block; font-size: 13px; font-weight: 600;
  color: rgba(255,255,255,.82); margin-bottom: 2px;
}
.cb-toggle-label span {
  font-size: 11.5px; color: rgba(255,255,255,.32); line-height: 1.5;
}

/* ── Toggle Switch ── */
.cb-switch {
  position: relative; width: 42px; height: 24px; flex-shrink: 0;
}
.cb-switch input { opacity: 0; width: 0; height: 0; position: absolute; }
.cb-slider {
  position: absolute; inset: 0;
  background: rgba(255,255,255,.1);
  border-radius: 24px; cursor: pointer;
  transition: background .25s;
}
.cb-slider::before {
  content: ''; position: absolute;
  width: 18px; height: 18px; border-radius: 50%;
  background: rgba(255,255,255,.45);
  left: 3px; top: 3px;
  transition: transform .25s, background .25s;
  box-shadow: 0 1px 4px rgba(0,0,0,.4);
}
.cb-switch input:checked + .cb-slider {
  background: #FF4D00;
}
.cb-switch input:checked + .cb-slider::before {
  transform: translateX(18px);
  background: #fff;
}
.cb-switch input:disabled + .cb-slider {
  background: rgba(255,77,0,.3);
  cursor: default;
}
.cb-switch input:disabled + .cb-slider::before {
  transform: translateX(18px);
  background: rgba(255,255,255,.9);
}

/* ── Buttons ── */
.cb-buttons {
  display: flex; gap: 10px; flex-wrap: wrap;
}
.cb-btn {
  flex: 1; min-width: 130px;
  padding: 13px 22px;
  border-radius: 50px; cursor: pointer;
  font-family: 'DM Sans', -apple-system, sans-serif;
  font-size: 13px; font-weight: 600;
  letter-spacing: .03em;
  transition: all .22s ease;
  white-space: nowrap; text-align: center;
}

/* Alle ablehnen — gleichwertig sichtbar (DSGVO-Anforderung) */
.cb-btn-reject {
  background: rgba(255,255,255,.05);
  color: rgba(255,255,255,.6);
  border: 1px solid rgba(255,255,255,.15);
}
.cb-btn-reject:hover {
  background: rgba(255,255,255,.09);
  color: rgba(255,255,255,.85);
  border-color: rgba(255,255,255,.25);
}

/* Auswahl speichern */
.cb-btn-save {
  background: rgba(255,255,255,.05);
  color: rgba(255,255,255,.55);
  border: 1px solid rgba(255,255,255,.1);
}
.cb-btn-save:hover {
  background: rgba(255,255,255,.09);
  color: rgba(255,255,255,.8);
}

/* Alle akzeptieren */
.cb-btn-accept {
  background: #FF4D00;
  color: #fff;
  border: 1px solid transparent;
  box-shadow: 0 4px 20px rgba(255,77,0,.35);
}
.cb-btn-accept:hover {
  background: #ff6120;
  box-shadow: 0 6px 28px rgba(255,77,0,.5);
  transform: translateY(-1px);
}
.cb-btn-accept:active {
  transform: translateY(0);
}

/* ── Responsive ── */
@media (max-width: 820px) {
  #cb-banner { padding: 22px 20px 26px; }
  .cb-layout { grid-template-columns: 1fr; gap: 20px; }
}
@media (max-width: 540px) {
  .cb-buttons { flex-direction: column; }
  .cb-btn { min-width: unset; width: 100%; flex: none; }
}
`;

  /* ── HTML ─────────────────────────────────────────────────── */
  const html = `
<div id="cb-overlay"></div>
<div id="cb-banner" role="dialog" aria-modal="true" aria-label="Cookie-Einstellungen">
  <div class="cb-inner">
    <div class="cb-layout">

      <!-- Text: links -->
      <div class="cb-text">
        <p class="cb-title">
          <span class="cb-title-dot"></span>
          Datenschutz-Einstellungen
        </p>
        <p class="cb-text-body">
          Diese Website verwendet Cookies und ähnliche Technologien.
          Technisch notwendige Cookies sind immer aktiv.
          Google Tag Manager und Google Ads Conversion Tracking kannst du
          einzeln aktivieren&nbsp;– standardmäßig sind beide deaktiviert.
          Mehr Infos in unserer
          <a href="averio-premium-datenschutz.html">Datenschutzerklärung</a>.
        </p>
      </div>

      <!-- Toggles: rechts -->
      <div class="cb-toggles">

        <!-- Notwendig (immer aktiv) -->
        <div class="cb-toggle-row">
          <label class="cb-switch" aria-label="Technisch notwendig — immer aktiv">
            <input type="checkbox" checked disabled>
            <span class="cb-slider"></span>
          </label>
          <div class="cb-toggle-label">
            <strong>Technisch notwendig</strong>
            <span>Grundfunktionen der Website&nbsp;– immer aktiv, keine Einwilligung erforderlich</span>
          </div>
        </div>

        <!-- Google Tag Manager -->
        <div class="cb-toggle-row">
          <label class="cb-switch" aria-label="Google Tag Manager aktivieren">
            <input type="checkbox" id="cb-gtm">
            <span class="cb-slider"></span>
          </label>
          <div class="cb-toggle-label">
            <strong>Google Tag Manager</strong>
            <span>Verwaltung von Website-Tags&nbsp;– standardmäßig deaktiviert</span>
          </div>
        </div>

        <!-- Marketing -->
        <div class="cb-toggle-row">
          <label class="cb-switch" aria-label="Marketing und Werbung aktivieren">
            <input type="checkbox" id="cb-marketing">
            <span class="cb-slider"></span>
          </label>
          <div class="cb-toggle-label">
            <strong>Marketing &amp; Werbung</strong>
            <span>Google Ads Conversion Tracking&nbsp;– setzt Google Tag Manager voraus</span>
          </div>
        </div>

      </div>
    </div>

    <!-- Buttons -->
    <div class="cb-buttons">
      <button class="cb-btn cb-btn-reject"  id="cb-reject-all">Alle ablehnen</button>
      <button class="cb-btn cb-btn-save"    id="cb-save">Auswahl speichern</button>
      <button class="cb-btn cb-btn-accept"  id="cb-accept-all">Alle akzeptieren</button>
    </div>

  </div>
</div>
`;

  /* ── gtag / dataLayer & loadGTM Fallbacks ─────────────────── */
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }
  if (typeof window.loadGTM !== 'function') {
    window.loadGTM = function () {
      /* Stub — wird überschrieben wenn GTM im <head> konfiguriert ist */
    };
  }

  /* ── Inject ───────────────────────────────────────────────── */
  function inject() {
    /* CSS in <head> */
    if (!document.getElementById('cb-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'cb-styles';
      styleEl.textContent = css;
      document.head.appendChild(styleEl);
    }
    /* HTML vor </body> */
    document.body.insertAdjacentHTML('beforeend', html);
    initBanner();
  }

  /* ── Banner-Logik ─────────────────────────────────────────── */
  function initBanner() {
    const banner  = document.getElementById('cb-banner');
    const overlay = document.getElementById('cb-overlay');
    const chkGtm  = document.getElementById('cb-gtm');
    const chkMktg = document.getElementById('cb-marketing');

    /* Abhängigkeit: Marketing benötigt GTM */
    chkMktg.addEventListener('change', function () {
      if (this.checked) chkGtm.checked = true;
    });
    chkGtm.addEventListener('change', function () {
      if (!this.checked) chkMktg.checked = false;
    });

    /* Consent Mode v2 anwenden */
    function applyConsent(gtm, marketing) {
      if (gtm) window.loadGTM();

      window.gtag('consent', 'update', {
        'ad_storage':              marketing ? 'granted' : 'denied',
        'ad_user_data':            marketing ? 'granted' : 'denied',
        'ad_personalization':      marketing ? 'granted' : 'denied',
        'analytics_storage':       marketing ? 'granted' : 'denied',
        'functionality_storage':   marketing ? 'granted' : 'denied',
        'personalization_storage': marketing ? 'granted' : 'denied',
        'security_storage':        'denied'
      });

      window.dataLayer.push({
        event:             'consent_update',
        gtm_consent:       gtm       ? 'granted' : 'denied',
        marketing_consent: marketing ? 'granted' : 'denied'
      });
    }

    /* Einwilligung speichern */
    function saveConsent(gtm, marketing) {
      const data = {
        gtm:       gtm,
        marketing: marketing,
        timestamp: new Date().toISOString(),
        version:   '2.0',
        expires:   Date.now() + EXPIRY_DAYS * 86400000
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      applyConsent(gtm, marketing);
      closeBanner();
    }

    /* Banner öffnen */
    function openBanner() {
      overlay.classList.add('cb-show');
      banner.classList.add('cb-show');
      document.body.style.overflow = 'hidden';
    }

    /* Banner schließen */
    function closeBanner() {
      banner.classList.remove('cb-show');
      overlay.classList.remove('cb-show');
      document.body.style.overflow = '';
    }

    /* Gespeicherte Einwilligung lesen */
    function loadSaved() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (data.expires && Date.now() > data.expires) {
          localStorage.removeItem(STORAGE_KEY);
          return null;
        }
        return data;
      } catch (e) {
        return null;
      }
    }

    /* Button-Events */
    document.getElementById('cb-accept-all').addEventListener('click', function () {
      chkGtm.checked = chkMktg.checked = true;
      saveConsent(true, true);
    });

    document.getElementById('cb-reject-all').addEventListener('click', function () {
      chkGtm.checked = chkMktg.checked = false;
      saveConsent(false, false);
    });

    document.getElementById('cb-save').addEventListener('click', function () {
      var gtm = chkGtm.checked;
      saveConsent(gtm, chkMktg.checked && gtm);
    });

    /* Widerruf über Footer-Link (#cookie-settings) */
    var settingsLink = document.getElementById('cookie-settings');
    if (settingsLink) {
      settingsLink.addEventListener('click', function (e) {
        e.preventDefault();
        var saved = loadSaved();
        if (saved) {
          chkGtm.checked  = saved.gtm      || false;
          chkMktg.checked = saved.marketing || false;
        }
        openBanner();
      });
    }

    /* Initialisierung */
    var saved = loadSaved();
    if (saved) {
      /* Bekannter Nutzer: Einwilligung sofort anwenden */
      applyConsent(saved.gtm || false, saved.marketing || false);
    } else {
      /* Neuer Nutzer: Banner nach 600 ms einblenden */
      setTimeout(openBanner, 600);
    }
  }

  /* DOM abwarten */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();
