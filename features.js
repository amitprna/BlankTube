// Every feature the panel can switch on or off. All are on by default.
const YTF_FEATURES = [
  { key: 'homeFeed', group: 'YouTube', label: 'Hide home feed', note: 'The home page shows only search and the menu.' },
  { key: 'recommendations', group: 'YouTube', label: 'Hide recommendations', note: 'Nothing suggested beside or below a video.' },
  { key: 'endScreen', group: 'YouTube', label: 'Hide end screen', note: 'No suggested videos when a video ends.' },
  { key: 'shortsLink', group: 'YouTube', label: 'Hide Shorts in the menu', note: 'Removes Shorts from the left menu.' },
  { key: 'notifications', group: 'YouTube', label: 'Hide notification bell', note: 'Removes the bell from the top bar.' },
  { key: 'autoplayNext', group: 'YouTube', label: 'Stop autoplay', note: 'The next video never starts on its own.' },
  { key: 'shortsScroll', group: 'YouTube', label: 'One Short only', note: 'An opened Short does not scroll to the next one.' },
  { key: 'autoStart', group: 'YouTube', label: 'Wait for play', note: 'A video you open stays paused until you press play.' },
  { key: 'speedKeys', group: 'Every website', label: 'Speed keys', note: '+ and - change speed, * resets, or Shift + wheel.' },
];

const YTF_DEFAULTS = Object.fromEntries(YTF_FEATURES.map((f) => [f.key, true]));
