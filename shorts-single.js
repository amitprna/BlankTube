// 7. One Short only: on a Shorts page the mouse wheel and arrow keys no longer move to the next Short.
// focus.css also locks the Shorts scroller and hides its up/down buttons.

function onShorts(e) {
  return ytfSettings.shortsScroll && location.pathname.startsWith('/shorts/') &&
    !(e.target.closest && e.target.closest('input, textarea, [contenteditable]'));
}

window.addEventListener('wheel', (e) => {
  if (e.ctrlKey || e.shiftKey || !onShorts(e)) return; // Ctrl = page zoom, Shift = speed keys
  if (!(e.target.closest && e.target.closest('ytd-shorts'))) return;
  e.preventDefault();
  e.stopImmediatePropagation();
}, { capture: true, passive: false });

window.addEventListener('keydown', (e) => {
  if (!['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].includes(e.key) || !onShorts(e)) return;
  e.preventDefault();
  e.stopImmediatePropagation();
}, true);
