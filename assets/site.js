import {examples} from './examples.js?v=20261030-rough-cut';

const $ = (selector) => document.querySelector(selector);
const before = $('#video-before');
const after = $('#video-after');
const players = [before, after];
const playButton = $('#play-both');
const timeline = $('#timeline');
const timeDisplay = $('#playback-time');
const featureVideo = $('#feature-video');
const comparisonDialog = $('#comparison-dialog');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let featureIndex = 6;
let featurePaused = reduceMotion;
let featureVisible = true;
let active = examples[0];
let audio = 'after';
let playing = false;
let playRequest = 0;
let animation = 0;
let seeking = false;
let filter = 'all';
const requestedTask = new URLSearchParams(window.location.search).get('task')?.toUpperCase();
let taskFilter = ['RC', 'FC'].includes(requestedTask) ? requestedTask : 'all';
let resolution = 'hd';
let comparisonOpener = null;
let resumeFeature = false;
let galleryPaused = reduceMotion;
const galleryPreviews = new Map();
const galleryObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  for (const entry of entries) {
    const state = galleryPreviews.get(entry.target);
    if (state) state.visible = entry.isIntersecting;
  }
  syncGalleryPreviews();
}, {threshold:.05}) : null;

function displayMedia(side) { return resolution === 'hd' && side.hd ? side.hd : side; }
function taskType(example) { return example.task.startsWith('s_3_') ? 'RC' : 'FC'; }
function matchesFilters(example) {
  return (filter === 'all' || example.size === filter) &&
    (taskFilter === 'all' || taskType(example) === taskFilter);
}

function icon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'icon');
  const use = document.createElementNS(svg.namespaceURI, 'use');
  use.setAttribute('href', `#i-${name}`);
  svg.append(use);
  return svg;
}

function duration() { return Math.max(...players.map((v, index) => Number.isFinite(v.duration) ? v.duration : active[index ? 'after' : 'before'].duration)); }
function clock(seconds) { return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`; }
function currentTime() { return Math.max(before.currentTime || 0, after.currentTime || 0); }

function updateTransport() {
  const total = duration();
  if (!seeking) timeline.value = String(total ? Math.min(1000, currentTime() / total * 1000) : 0);
  timeDisplay.textContent = `${clock(currentTime())} / ${clock(total)}`;
  playButton.replaceChildren(icon(playing ? 'pause' : 'play'));
  const label = document.createElement('span');
  label.textContent = playing ? 'Pause both' : 'Play both';
  playButton.append(label);
}

function applyAudio() {
  before.muted = audio !== 'before';
  after.muted = audio !== 'after';
  document.querySelectorAll('[data-audio]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.audio === audio)));
}

function pauseBoth() {
  playing = false;
  playRequest++;
  players.forEach((v) => v.pause());
  cancelAnimationFrame(animation);
  updateTransport();
}

function seekBoth(seconds) {
  for (const video of players) {
    const total = Number.isFinite(video.duration) ? video.duration : duration();
    if (video.readyState > 0) video.currentTime = Math.max(0, Math.min(seconds, total));
  }
  updateTransport();
}

function tick() {
  if (!playing) return;
  const running = players.filter((v) => !v.paused && !v.ended);
  if (!running.length) { playing = false; updateTransport(); return; }
  if (running.length === 2 && !seeking && !players.some((v) => v.seeking || v.readyState < 3)) {
    if (Math.abs(before.currentTime - after.currentTime) > .25) {
      const follower = audio === 'before' ? after : before;
      const leader = audio === 'before' ? before : after;
      follower.currentTime = Math.min(leader.currentTime, follower.duration);
    }
  }
  updateTransport();
  animation = requestAnimationFrame(tick);
}

async function playBoth() {
  if (playing) { pauseBoth(); return; }
  featureVideo.pause();
  if (currentTime() >= duration() - .1) seekBoth(0);
  applyAudio();
  const request = ++playRequest;
  playing = true;
  updateTransport();
  const results = await Promise.allSettled(players.map((v) => v.play()));
  if (request !== playRequest) return;
  if (results.every((r) => r.status === 'rejected')) {
    pauseBoth();
    showPlayerError('Playback could not start. Try replaying or choose another example.');
    return;
  }
  animation = requestAnimationFrame(tick);
}

playButton.addEventListener('click', playBoth);
$('#replay').addEventListener('click', () => { pauseBoth(); seekBoth(0); playBoth(); });
timeline.addEventListener('input', () => { seeking = true; seekBoth(Number(timeline.value) / 1000 * duration()); });
timeline.addEventListener('change', () => { seeking = false; updateTransport(); });
document.querySelectorAll('[data-audio]').forEach((button) => button.addEventListener('click', () => { audio = button.dataset.audio; applyAudio(); }));
players.forEach((video) => {
  video.addEventListener('click', playBoth);
  video.addEventListener('loadedmetadata', updateTransport);
  video.addEventListener('timeupdate', () => { if (!playing) updateTransport(); });
  video.addEventListener('pause', () => { if (playing && !video.ended && !video.seeking) pauseBoth(); });
  video.addEventListener('error', () => { if (video.currentSrc) showPlayerError('This clip could not be loaded. Try the original render or choose another example.'); });
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { pauseBoth(); featureVideo.pause(); }
  else if (featureVisible && !featurePaused && !comparisonDialog.open) featureVideo.play().catch(() => {});
  syncGalleryPreviews();
});

function setFeature(index) {
  featureIndex = index;
  const example = examples[index];
  const media = displayMedia(example.after);
  featureVideo.autoplay = !featurePaused && featureVisible && !document.hidden && !comparisonDialog.open;
  featureVideo.pause();
  featureVideo.poster = media.poster;
  if (featureVideo.getAttribute('src') !== media.video) {
    featureVideo.src = media.video;
    featureVideo.load();
  }
  $('#feature-open').setAttribute('aria-label', `Compare ${example.title} edits`);
  document.querySelectorAll('[data-feature]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.feature) === index)));
  if (!featurePaused && featureVisible && !document.hidden && !comparisonDialog.open) featureVideo.play().catch(() => {});
}

function updateFeatureControl() {
  const paused = featureVideo.paused;
  const button = $('#feature-pause');
  button.setAttribute('aria-label', paused ? 'Play featured preview' : 'Pause featured preview');
  button.replaceChildren(icon(paused ? 'play' : 'pause'));
}

document.querySelectorAll('[data-feature]').forEach(button => button.addEventListener('click', () => setFeature(Number(button.dataset.feature))));
$('#feature-pause').addEventListener('click', () => {
  featurePaused = !featureVideo.paused;
  if (featurePaused) featureVideo.pause();
  else featureVideo.play().catch(() => {});
});
featureVideo.addEventListener('play', updateFeatureControl);
featureVideo.addEventListener('pause', updateFeatureControl);
$('#feature-open').addEventListener('click', event => openComparison(examples[featureIndex], event.currentTarget));
if (reduceMotion) { featureVideo.autoplay = false; featureVideo.pause(); }

function openComparison(example, opener) {
  if (comparisonDialog.open) return;
  comparisonOpener = opener;
  resumeFeature = !featureVideo.paused;
  featureVideo.pause();
  document.querySelectorAll('.tile-preview').forEach(video => video.pause());
  chooseExample(example);
  comparisonDialog.showModal();
  document.body.classList.add('modal-open');
}

$('#close-comparison').addEventListener('click', () => comparisonDialog.close());
comparisonDialog.addEventListener('click', event => {
  if (event.target !== comparisonDialog) return;
  const bounds = comparisonDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) comparisonDialog.close();
});
comparisonDialog.addEventListener('close', () => {
  pauseBoth();
  document.body.classList.remove('modal-open');
  if (comparisonOpener && !comparisonOpener.isConnected) {
    comparisonOpener = Array.from(document.querySelectorAll('.example-tile')).find(tile => tile.dataset.id === comparisonOpener.dataset.id) || $('#feature-open');
  }
  comparisonOpener?.focus({preventScroll:true});
  if (resumeFeature && featureVisible && !featurePaused && !document.hidden) featureVideo.play().catch(() => {});
  syncGalleryPreviews();
});

function showPlayerError(message) {
  const status = $('#player-status');
  status.textContent = message;
  status.hidden = false;
}

function chooseExample(example) {
  pauseBoth();
  active = example;
  $('#case-title').textContent = example.model;
  const hasHD = Boolean(example.before.hd && example.after.hd);
  const roughCut = taskType(example) === 'RC';
  document.querySelector('[data-resolution="original"]').textContent = roughCut ? 'Cut-list render' : 'Original';
  document.querySelector('[data-resolution="original"]').disabled = roughCut;
  document.querySelector('.audio-switch').hidden = roughCut;
  $('#dialog-description').textContent = roughCut
    ? 'Rough Cut comparison rendered from the original submitted cut lists and verified task footage. This picture-only task is silent; clip order and model-selected cut points are preserved.'
    : 'Compare the untrained and RL-trained models on the same editing task. HD reconstructions preserve original frame timing and audio. Original opens the exact evaluated files.';
  document.querySelectorAll('[data-resolution]').forEach(button => {
    button.hidden = button.dataset.resolution === 'hd' && !hasHD;
    button.setAttribute('aria-pressed', String(button.dataset.resolution === (resolution === 'hd' && hasHD ? 'hd' : 'original')));
  });
  $('#player-status').hidden = true;
  $('#player-status').textContent = '';
  for (const [index, video] of players.entries()) {
    const side = example[index ? 'after' : 'before'];
    const media = displayMedia(side);
    video.poster = media.poster;
    video.src = media.video;
    video.load();
    video.setAttribute('aria-label', `${example.title}: ${index ? example.method : 'untrained'} output, ${example.size}`);
  }
  applyAudio();
  timeline.value = '0';
  updateTransport();
}

document.querySelectorAll('[data-resolution]').forEach(button => button.addEventListener('click', () => {
  if (resolution === button.dataset.resolution) return;
  resolution = button.dataset.resolution;
  setFeature(featureIndex);
  chooseExample(active);
}));

function shouldRunPreview(state) {
  return state.visible && state.tile.isConnected && !state.tile.hidden && !galleryPaused && !document.hidden && !comparisonDialog.open;
}

function syncGalleryPreviews() {
  for (const state of galleryPreviews.values()) {
    if (!shouldRunPreview(state)) { state.video.pause(); continue; }
    if (!state.video.getAttribute('src')) state.video.src = state.source;
    if (!state.video.paused || state.pending) continue;
    state.pending = true;
    state.video.play().then(() => {
      state.pending = false;
      if (shouldRunPreview(state)) state.tile.classList.add('is-previewing');
      else state.video.pause();
    }).catch(() => { state.pending = false; });
  }
}

function updateGalleryControl() {
  const button = $('#gallery-motion');
  const label = galleryPaused ? 'Play previews' : 'Pause previews';
  button.setAttribute('aria-label', label);
  button.title = label;
  button.replaceChildren(icon(galleryPaused ? 'play' : 'pause'));
}

$('#gallery-motion').addEventListener('click', () => {
  galleryPaused = !galleryPaused;
  updateGalleryControl();
  syncGalleryPreviews();
});

function renderRail() {
  const rail = $('#example-rail');
  galleryObserver?.disconnect();
  galleryPreviews.forEach(state => state.video.pause());
  galleryPreviews.clear();
  rail.replaceChildren();
  let visibleIndex = 0;
  for (const example of [...examples].sort((a,b) => a.galleryOrder - b.galleryOrder)) {
    const tile = document.createElement('button');
    tile.className = 'example-tile';
    tile.type = 'button';
    tile.dataset.id = example.id;
    tile.hidden = !matchesFilters(example);
    if (!tile.hidden) {
      tile.dataset.layout = visibleIndex === 0 ? 'lead' : visibleIndex === 1 ? 'wide' : 'standard';
      visibleIndex++;
    }
    tile.setAttribute('aria-haspopup', 'dialog');
    tile.setAttribute('aria-controls', 'comparison-dialog');
    tile.setAttribute('aria-label', `Compare ${example.title}, ${example.model}, ${taskType(example) === 'RC' ? 'Rough Cut' : 'Fine Cut'}, example ${example.number}`);
    const poster = document.createElement('img');
    poster.src = example.preview?.poster || example.after.poster;
    poster.alt = '';
    poster.loading = 'lazy';
    poster.width = 854;
    poster.height = 480;
    const preview = document.createElement('video');
    preview.className = 'tile-preview';
    preview.muted = true;
    preview.loop = true;
    preview.playsInline = true;
    preview.preload = 'none';
    preview.setAttribute('aria-hidden', 'true');
    preview.tabIndex = -1;
    const prompt = document.createElement('span');
    prompt.className = 'tile-open';
    prompt.setAttribute('aria-hidden', 'true');
    prompt.append(icon('play'));
    tile.append(poster, preview, prompt);
    tile.addEventListener('click', () => openComparison(example, tile));
    rail.append(tile);
    const state = {tile,video:preview,source:example.preview?.video || example.after.video,visible:!galleryObserver,pending:false};
    galleryPreviews.set(tile, state);
    if (!tile.hidden) galleryObserver?.observe(tile);
  }
  $('#example-count').textContent = `/ ${visibleIndex} selected pairs`;
  updateGalleryControl();
  syncGalleryPreviews();
}

document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  if (filter !== 'all' && active.size !== filter) active = examples.find((item) => item.size === filter);
  renderRail();
  const count = examples.filter(matchesFilters).length;
  $('#example-count').textContent = `/ ${count} selected pairs`;
}));

document.querySelectorAll('[data-task-filter]').forEach((button) => {
  button.setAttribute('aria-pressed', String(button.dataset.taskFilter === taskFilter));
  button.addEventListener('click', () => {
    taskFilter = button.dataset.taskFilter;
    document.querySelectorAll('[data-task-filter]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    renderRail();
  });
});

$('#copy-citation').addEventListener('click', async () => {
  const text = $('#bibtex').textContent;
  try {
    await navigator.clipboard.writeText(text);
    $('#copy-status').textContent = 'BibTeX copied.';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents($('#bibtex')); selection.removeAllRanges(); selection.addRange(range);
    $('#copy-status').textContent = 'Citation selected. Use your browser’s copy command.';
  }
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) {
      document.querySelectorAll('.site-header nav a').forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }
  }, {rootMargin:'-20% 0px -60% 0px'});
  document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
  const featureObserver = new IntersectionObserver(entries => {
    featureVisible = entries[0].isIntersecting;
    if (!featureVisible) featureVideo.pause();
    else if (!featurePaused && !document.hidden && !comparisonDialog.open) featureVideo.play().catch(() => {});
  }, {threshold:.15});
  featureObserver.observe(featureVideo);
}

renderRail();
applyAudio();
updateTransport();
setFeature(featureIndex);

// README and model-card links can open a specific selected comparison.
const requestedExample = new URLSearchParams(window.location.search).get('example');
const linkedExample = examples.find(example => example.number === requestedExample || example.id === requestedExample);
if (linkedExample) {
  const opener = Array.from(document.querySelectorAll('.example-tile')).find(tile => tile.dataset.id === linkedExample.id) || $('#feature-open');
  openComparison(linkedExample, opener);
}
