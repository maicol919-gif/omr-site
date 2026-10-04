/**
 * cookies.js — Aviso de cookies.
 * Google Analytics arranca con el consentimiento denegado (ver el bloque gtag de cada página)
 * y solo guarda cookies si el visitante pulsa "Aceptar".
 */
(function () {
  'use strict';
  var CLAVE = 'omr_cookies';

  function leer() { try { return localStorage.getItem(CLAVE); } catch (e) { return null; } }
  function guardar(v) { try { localStorage.setItem(CLAVE, v); } catch (e) {} }

  function aplicar(v) {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { analytics_storage: v === 'si' ? 'granted' : 'denied' });
    }
  }

  function mostrar() {
    if (document.getElementById('aviso-cookies')) return;
    var raiz = /\/blog\//.test(location.pathname) ? '../' : '';
    var caja = document.createElement('div');
    caja.id = 'aviso-cookies';
    caja.setAttribute('role', 'dialog');
    caja.setAttribute('aria-label', 'Aviso de cookies');
    caja.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:720px;margin:0 auto;' +
      'background:#0a1628;color:#fff;padding:18px 20px;border-radius:6px;box-shadow:0 8px 30px rgba(0,0,0,.25);' +
      'font-family:\'DM Sans\',sans-serif;font-size:14px;line-height:1.6;display:flex;flex-wrap:wrap;gap:12px;align-items:center;';
    caja.innerHTML =
      '<p style="margin:0;flex:1 1 320px;">Usamos cookies de analítica (Google Analytics) para saber cómo se usa la web y mejorarla. ' +
      'Solo se activan si usted las acepta. <a href="' + raiz + 'privacidad.html" style="color:#d4af37;">Más información</a></p>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
      '<button type="button" data-v="no" style="background:transparent;color:#fff;border:1px solid #fff;padding:10px 18px;border-radius:3px;cursor:pointer;font:inherit;">Rechazar</button>' +
      '<button type="button" data-v="si" style="background:#d4af37;color:#0a1628;border:0;padding:10px 18px;border-radius:3px;cursor:pointer;font:inherit;font-weight:700;">Aceptar</button>' +
      '</div>';
    caja.addEventListener('click', function (e) {
      var v = e.target.getAttribute && e.target.getAttribute('data-v');
      if (!v) return;
      guardar(v);
      aplicar(v);
      caja.remove();
    });
    document.body.appendChild(caja);
  }

  // Permite volver a mostrar el aviso (enlace en la política de privacidad).
  window.omrCookies = { cambiar: mostrar };

  if (!leer()) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mostrar);
    else mostrar();
  }
})();
