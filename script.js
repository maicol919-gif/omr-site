/**
 * script.js
 * Responsabilidades:
 *  1. Navegación: sticky highlight + menú hamburguesa móvil
 *  2. FAQ: acordeón accesible (aria-expanded)
 *  3. Scroll animations: Intersection Observer para .fade-up
 *  4. Formulario de contacto: validación + envío por WhatsApp
 *  5. Smooth scroll a secciones desde nav
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
   * 1. NAVEGACIÓN HAMBURGUESA
   * ───────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Cerrar al hacer click en un link del menú
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ─────────────────────────────────────────
   * 2. NAV: sombra al hacer scroll
   * ───────────────────────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        nav.style.boxShadow = '0 2px 16px rgba(11,25,41,0.14)';
      } else {
        nav.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
   * 3. FAQ ACORDEÓN
   * ───────────────────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const isOpen = this.getAttribute('aria-expanded') === 'true';
      const targetId = this.getAttribute('aria-controls');
      const answer   = document.getElementById(targetId);

      // Cerrar todos los otros
      document.querySelectorAll('.faq-q').forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const otherId = other.getAttribute('aria-controls');
          const otherA  = document.getElementById(otherId);
          if (otherA) otherA.hidden = true;
        }
      });

      // Toggle el actual
      if (answer) {
        this.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        answer.hidden = isOpen;
      }
    });
  });

  /* ─────────────────────────────────────────
   * 4. SCROLL ANIMATIONS (Intersection Observer)
   * ───────────────────────────────────────── */
  function initScrollAnimations() {
    // Agrega la clase fade-up a los elementos que deben animarse
    var targets = [
      '.service-card',
      '.step',
      '.test-card',
      '.faq-item',
      '.trust-grid',
      '.contact-grid',
      '.badge',
    ];

    targets.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        el.classList.add('fade-up');
      });
    });

    if (!('IntersectionObserver' in window)) {
      // Fallback: mostrar todo si el browser no soporta IO
      document.querySelectorAll('.fade-up').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Pequeño stagger para grids
          var siblings = Array.from(entry.target.parentElement.querySelectorAll('.fade-up'));
          var index    = siblings.indexOf(entry.target);
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, index * 80);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    });

    document.querySelectorAll('.fade-up').forEach(function (el) {
      observer.observe(el);
    });
  }

  initScrollAnimations();

  /* ─────────────────────────────────────────
   * 5. FORMULARIO DE CONTACTO
   * ───────────────────────────────────────── */
  var form      = document.getElementById('contact-form');
  var submitBtn = document.getElementById('submit-btn');
  var successEl = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validación básica
      var fields  = form.querySelectorAll('[required]');
      var isValid = true;

      fields.forEach(function (field) {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#B91C1C';
          isValid = false;
        }
      });

      if (!isValid) {
        var first = form.querySelector('[required][style*="B91C1C"]');
        if (first) first.focus();
        return;
      }

      // Construir mensaje para WhatsApp
      var nombre   = (document.getElementById('nombre')   || {}).value || '';
      var telefono = (document.getElementById('telefono') || {}).value || '';
      var email    = (document.getElementById('email')    || {}).value || '';
      var servicio = (document.getElementById('servicio') || {}).value || '';
      var mensaje  = (document.getElementById('mensaje')  || {}).value || '';

      var servicioLabel = {
        'divorcio':          'Divorcio en Colombia desde España',
        'sociedad-conyugal': 'Liquidación de sociedad conyugal',
        'custodia':          'Custodia y alimentos',
        'sucesion':          'Sucesión y herencia',
        'otro':              'Otra consulta de familia',
      }[servicio] || servicio;

      var texto = [
        '¡Hola Dr. Martínez! Solicito una valoración jurídica gratuita.',
        '',
        '📋 *Mis datos:*',
        '• Nombre: ' + nombre,
        '• Teléfono/WhatsApp: ' + telefono,
        '• Email: ' + email,
        '• Servicio: ' + servicioLabel,
        '',
        '📝 *Mi situación:*',
        mensaje,
      ].join('\n');

      var waUrl = 'https://wa.me/573194205304?text=' + encodeURIComponent(texto);

      // Feedback visual
      submitBtn.textContent = 'Enviando…';
      submitBtn.disabled    = true;

      setTimeout(function () {
        // Mostrar mensaje de éxito
        if (successEl) {
          successEl.hidden = false;
          successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.reset();
        submitBtn.textContent = 'Enviar solicitud';
        submitBtn.disabled    = false;

        // Abrir WhatsApp
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }, 600);
    });

    // Limpiar errores al escribir
    form.querySelectorAll('[required]').forEach(function (field) {
      field.addEventListener('input', function () {
        if (this.value.trim()) {
          this.style.borderColor = '';
        }
      });
    });
  }

  /* ─────────────────────────────────────────
   * 6. SMOOTH SCROLL POLYFILL PARA SAFARI
   * ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var navH   = nav ? nav.offsetHeight : 0;
        var top    = target.getBoundingClientRect().top + window.pageYOffset - navH - 12;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
