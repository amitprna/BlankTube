// 6. No auto-start: a video you open (also in a new tab) stays paused until you press play yourself.

let allowedVideo = '';   // the video you pressed play on; YouTube may play it (and its ads) freely
let lastUserAction = 0;

function videoId() {
  return new URLSearchParams(location.search).get('v') || '';
}

function isTyping(target) {
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}

// A click on the player, or a key press (space, k, ...), counts as you asking for playback.
document.addEventListener('pointerdown', (e) => {
  if (e.isTrusted && e.target.closest && e.target.closest('#movie_player')) lastUserAction = Date.now();
}, true);
document.addEventListener('keydown', (e) => {
  if (e.isTrusted && !isTyping(e.target)) lastUserAction = Date.now();
}, true);

document.addEventListener('play', (e) => {
  const video = e.target;
  if (!ytfSettings.autoStart) return;
  if (location.pathname !== '/watch' || !(video instanceof HTMLVideoElement) || !video.closest('#movie_player')) return;
  if (allowedVideo === videoId()) return;
  if (Date.now() - lastUserAction < 1500) {
    allowedVideo = videoId();
    return;
  }
  video.pause();
}, true);
