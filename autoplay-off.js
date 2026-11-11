// 4. Autoplay: keep the player's autoplay switch off, so the next video never starts on its own.

function turnAutoplayOff() {
  if (!ytfSettings.autoplayNext) return;
  const on = document.querySelector('.ytp-autonav-toggle-button[aria-checked="true"]');
  if (on) (on.closest('.ytp-autonav-toggle') || on).click();
}

// Backup: if autoplay is still on when a video ends, YouTube counts down to the next one.
// Press the (hidden) Cancel button on that countdown. YouTube's player marks a video as ended
// a moment before the video file itself ends, so this watches the player, not the file.
// Your own playlists are left alone (RD... lists are YouTube-made mixes, not yours).
let cancelledFor = '';

function cancelUpNext() {
  if (!ytfSettings.autoplayNext) return;
  if (!document.querySelector('#movie_player.ended-mode') || cancelledFor === location.href) return;
  const list = new URLSearchParams(location.search).get('list');
  if (list && !list.startsWith('RD')) return;
  const cancel = document.querySelector('.ytp-autonav-endscreen-upnext-cancel-button');
  if (!cancel) return;
  cancel.click();
  cancelledFor = location.href;
}

document.addEventListener('pause', () => setTimeout(cancelUpNext, 50), true);
document.addEventListener('play', () => { cancelledFor = ''; }, true);

// YouTube changes pages without reloading, so check now and then.
document.addEventListener('yt-navigate-finish', turnAutoplayOff);
setInterval(() => {
  turnAutoplayOff();
  cancelUpNext();
}, 1000);
