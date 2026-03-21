// ═══════════════════════════════════════════════
// PRICING — JS
// Mobile: show one plan column at a time via tabs
// Desktop (≥1024px): all three columns visible
// ═══════════════════════════════════════════════
(function () {
  'use strict';

  var DESKTOP_BP  = 1024;
  var activeIndex = 1;   // 1 = Starter, 2 = Pro, 3 = Unlimited

  var right = document.querySelector('.ps__right');
  if (!right) return;

  // ── Build tab bar ──────────────────────────
  var tabBar = document.createElement('div');
  tabBar.className = 'ps-tabs';
  tabBar.setAttribute('role', 'tablist');
  tabBar.innerHTML =
    '<button class="ps-tab ps-tab--active" data-col="1" role="tab">Starter Plan</button>' +
    '<button class="ps-tab" data-col="2" role="tab">Pro Plan</button>'                    +
    '<button class="ps-tab" data-col="3" role="tab">Unlimited Plan</button>';

  right.insertBefore(tabBar, right.firstChild);

  // ── Get all cells for a given column index ─
  function colCells(n) {
    return document.querySelectorAll('.pt__col--' + n);
  }

  // ── Show/hide plan columns ─────────────────
  function showCol(n) {
    [1, 2, 3].forEach(function (i) {
      colCells(i).forEach(function (el) {
        if (i === n) {
          el.classList.remove('pt-col-hidden');
        } else {
          el.classList.add('pt-col-hidden');
        }
      });
    });

    // sync tab button states
    tabBar.querySelectorAll('.ps-tab').forEach(function (btn) {
      var isActive = parseInt(btn.dataset.col, 10) === n;
      btn.classList.toggle('ps-tab--active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    activeIndex = n;
  }

  // ── Show all columns (desktop) ─────────────
  function showAll() {
    [1, 2, 3].forEach(function (i) {
      colCells(i).forEach(function (el) {
        el.classList.remove('pt-col-hidden');
      });
    });
  }

  // ── Apply correct layout for viewport ──────
  function applyLayout() {
    if (window.innerWidth >= DESKTOP_BP) {
      showAll();
    } else {
      showCol(activeIndex);
    }
  }

  // ── Tab click ──────────────────────────────
  tabBar.addEventListener('click', function (e) {
    var btn = e.target.closest('.ps-tab');
    if (!btn) return;
    showCol(parseInt(btn.dataset.col, 10));
  });

  // ── Init + resize ──────────────────────────
  applyLayout();

  var timer;
  window.addEventListener('resize', function () {
    clearTimeout(timer);
    timer = setTimeout(applyLayout, 100);
  });

}());