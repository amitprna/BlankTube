// Live copy of the panel's switches, read by the other scripts. On YouTube it also marks <html>
// with data-ytf-off-<feature> for each switched-off feature, so focus.css shows those parts again.
const ytfSettings = { ...YTF_DEFAULTS };

function ytfMark() {
  if (location.hostname !== 'www.youtube.com') return;
  for (const [key, on] of Object.entries(ytfSettings)) {
    document.documentElement.toggleAttribute(`data-ytf-off-${key.toLowerCase()}`, !on);
  }
}

chrome.storage.sync.get(YTF_DEFAULTS, (saved) => {
  Object.assign(ytfSettings, saved);
  ytfMark();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;
  for (const [key, change] of Object.entries(changes)) {
    if (key in YTF_DEFAULTS) ytfSettings[key] = change.newValue;
  }
  ytfMark();
});
