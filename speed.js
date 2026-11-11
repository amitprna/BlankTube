// 5. Speed (on every website): + and - change speed by 0.25, * goes back to 1x, Shift + mouse wheel over a video also works.
// The chosen speed is kept for the next video. A small label on the video shows the speed when it changes.

const STEP = 0.25;
const MIN = 0.25;
const MAX = 16;

let speed = 1;

chrome.storage.local.get({ speed: 1 }, (saved) => {
  speed = saved.speed;
  document.querySelectorAll('video').forEach(applySpeed);
});

function applySpeed(video) {
  if (!ytfSettings.speedKeys) return;
  if (Math.abs(video.playbackRate - speed) > 0.001) video.playbackRate = speed;
}

function setSpeed(next, video) {
  speed = Math.min(MAX, Math.max(MIN, Math.round(next / STEP) * STEP));
  chrome.storage.local.set({ speed });
  document.querySelectorAll('video').forEach(applySpeed);
  showLabel(video);
}

// The video the keys act on: one that is playing, otherwise the biggest one on screen.
// Videos scrolled out of view are ignored, so the keys keep working normally on pages where no video is in sight.
function mainVideo() {
  const videos = [...document.querySelectorAll('video')].filter((v) => {
    const r = v.getBoundingClientRect();
    return r.width > 0 && r.bottom > 0 && r.top < innerHeight;
  });
  const playing = videos.find((v) => !v.paused);
  if (playing) return playing;
  return videos.sort((a, b) => b.offsetWidth * b.offsetHeight - a.offsetWidth * a.offsetHeight)[0];
}

function isTyping(target) {
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}

document.addEventListener('keydown', (e) => {
  if (!ytfSettings.speedKeys || e.ctrlKey || e.altKey || e.metaKey || isTyping(e.target)) return;
  const video = mainVideo();
  if (!video) return;
  if (e.key === '+' || e.key === '=') setSpeed(speed + STEP, video);
  else if (e.key === '-' || e.key === '_') setSpeed(speed - STEP, video);
  else if (e.key === '*') setSpeed(1, video);
  else return;
  // Stop YouTube's own use of these keys (caption size).
  e.preventDefault();
  e.stopImmediatePropagation();
}, true);

document.addEventListener('wheel', (e) => {
  if (!ytfSettings.speedKeys || !e.shiftKey) return;
  const video = [...document.querySelectorAll('video')].find((v) => {
    const r = v.getBoundingClientRect();
    return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  });
  if (!video) return;
  const delta = e.deltaY || e.deltaX;
  setSpeed(speed + (delta < 0 ? STEP : -STEP), video);
  e.preventDefault();
  e.stopImmediatePropagation();
}, { capture: true, passive: false });

// A new video starts at 1x, so put the chosen speed back.
for (const type of ['loadeddata', 'play']) {
  document.addEventListener(type, (e) => {
    if (e.target instanceof HTMLVideoElement) applySpeed(e.target);
  }, true);
}

// If the speed is picked from YouTube's own menu (or its < > keys), keep that one.
let lastYouTubeSpeedUse = 0;
document.addEventListener('click', (e) => {
  if (e.target.closest && e.target.closest('.ytp-settings-menu, .ytp-popup')) lastYouTubeSpeedUse = Date.now();
}, true);
document.addEventListener('keydown', (e) => {
  if (e.key === '<' || e.key === '>') lastYouTubeSpeedUse = Date.now();
}, true);
document.addEventListener('ratechange', (e) => {
  if (!(e.target instanceof HTMLVideoElement) || Date.now() - lastYouTubeSpeedUse > 1000) return;
  speed = e.target.playbackRate;
  chrome.storage.local.set({ speed });
}, true);

let label;
let hideTimer;

function showLabel(video) {
  if (!label) {
    label = document.createElement('div');
    label.style.cssText = [
      'position: fixed', 'z-index: 2147483647', 'pointer-events: none',
      'padding: 6px 12px', 'border-radius: 8px',
      'background: rgba(0, 0, 0, 0.6)', 'color: #fff',
      'font: 600 16px/1.2 system-ui, sans-serif',
      'transition: opacity 0.3s', 'opacity: 0',
    ].join(';');
  }
  (document.fullscreenElement || document.body).appendChild(label);
  const r = video.getBoundingClientRect();
  label.textContent = `${speed}x`;
  label.style.top = `${Math.max(r.top, 0) + 16}px`;
  label.style.left = `${Math.min(r.right, innerWidth) - 16}px`;
  label.style.transform = 'translateX(-100%)';
  label.style.opacity = '1';
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => { label.style.opacity = '0'; }, 1000);
}
