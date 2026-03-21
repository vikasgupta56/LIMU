// =============================================
// FAQ ACCORDION
// =============================================
// - Click to open / close individual items
// - Only one item open at a time
// - Smooth max-height animation (no janky height:auto jumps)
// - aria-expanded synced for accessibility
// - Keyboard accessible (Enter / Space handled by native button)
// =============================================

(function () {
  'use strict';

  const items = document.querySelectorAll('.faq__item');

  if (!items.length) return;

  /**
   * Close a single FAQ item smoothly.
   */
  function closeItem(item) {
    const btn    = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    item.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    answer.style.maxHeight = '0';
  }

  /**
   * Open a single FAQ item smoothly.
   * Sets max-height to the answer's scrollHeight so the CSS transition
   * animates from 0 → exact content height — no clipping, no overflow.
   */
  function openItem(item) {
    const btn    = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    item.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    answer.style.maxHeight = answer.scrollHeight + 'px';
  }

  /**
   * Toggle an item. Close all siblings first (accordion behaviour).
   */
  function toggleItem(item) {
    const isOpen = item.classList.contains('is-open');

    // close every item
    items.forEach(closeItem);

    // if it was closed, open it
    if (!isOpen) {
      openItem(item);
    }
  }

  // attach click listeners
  items.forEach(item => {
    const btn = item.querySelector('.faq__question');
    if (!btn) return;
    btn.addEventListener('click', () => toggleItem(item));
  });

})();