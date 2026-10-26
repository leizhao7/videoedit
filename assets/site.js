import {examples} from './examples.js?v=20261026-hd';

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
let resolution = 'hd';
let comparisonOpener = null;
let resumeFeature = false;

function displayMedia(side) { return resolution === 'hd' && side.hd ? side.hd : side; }

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
    $('#case-description').textContent = 'Playback could not start. Use the individual video controls to play each original clip.';
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
  video.addEventListener('loadedmetadata', updateTransport);
  video.addEventListener('timeupdate', () => { if (!playing) updateTransport(); });
  video.addEventListener('pause', () => { if (playing && !video.ended && !video.seeking) pauseBoth(); });
  video.addEventListener('error', () => { if (video.currentSrc) $('#case-description').textContent = 'This original clip could not be loaded. Try the other side or choose another example.'; });
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { pauseBoth(); featureVideo.pause(); }
  else if (featureVisible && !featurePaused && !comparisonDialog.open) featureVideo.play().catch(() => {});
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
  $('#feature-model').textContent = example.model;
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
$('.feature-compare').addEventListener('click', event => openComparison(examples[featureIndex], event.currentTarget));
$('#feature-open').addEventListener('click', event => openComparison(examples[featureIndex], event.currentTarget));
if (reduceMotion) { featureVideo.autoplay = false; featureVideo.pause(); }

function openComparison(example, opener) {
  if (comparisonDialog.open) return;
  comparisonOpener = opener;
  resumeFeature = !featureVideo.paused;
  featureVideo.pause();
  document.querySelectorAll('.tile-preview').forEach(video => video.pause());
  document.querySelectorAll('.is-previewing').forEach(tile => tile.classList.remove('is-previewing'));
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
});

function scoreLabel(side) {
  return side.invalid ? 'Submission validation failed' : `Individual score ${side.score.toFixed(3)}`;
}

function chooseExample(example) {
  pauseBoth();
  active = example;
  $('#case-title').textContent = example.model;
  $('#case-position').textContent = `${example.number} / ${String(examples.length).padStart(2, '0')}`;
  $('#case-focus').textContent = example.focus;
  $('#case-description').textContent = example.observed;
  $('#case-caveat').textContent = example.caveat;
  $('#case-provenance').textContent = `${example.title} · ${example.method} · ${example.task} · evaluation repetition ${example.rep}. A selected individual rollout, not an average training effect.`;
  $('.case-notes').open = false;
  $('#before-score').textContent = scoreLabel(example.before);
  $('#after-score').textContent = scoreLabel(example.after);
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
  document.querySelectorAll('[data-resolution]').forEach(option => option.setAttribute('aria-pressed', String(option.dataset.resolution === resolution)));
  $('#render-note').textContent = resolution === 'hd'
    ? 'HD reconstructions preserve the original frame timing and audio. Scores refer to the original evaluation renders.'
    : 'Exact 480p evaluation renders, with the original video and audio files.';
  setFeature(featureIndex);
  renderRail();
  chooseExample(active);
}));

function renderRail() {
  const rail = $('#example-rail');
  rail.querySelectorAll('video').forEach(video => video.pause());
  rail.replaceChildren();
  rail.classList.toggle('filtered', filter !== 'all');
  for (const example of examples) {
    const tile = document.createElement('button');
    tile.className = 'example-tile';
    tile.type = 'button';
    tile.dataset.id = example.id;
    tile.hidden = filter !== 'all' && example.size !== filter;
    tile.setAttribute('aria-haspopup', 'dialog');
    tile.setAttribute('aria-controls', 'comparison-dialog');
    tile.setAttribute('aria-label', `Compare ${example.title}, ${example.model}, example ${example.number}`);
    const poster = document.createElement('img');
    poster.src = displayMedia(example.after).poster;
    poster.alt = '';
    poster.loading = 'lazy';
    poster.width = 604;
    poster.height = 340;
    const preview = document.createElement('video');
    preview.className = 'tile-preview';
    preview.muted = true;
    preview.loop = true;
    preview.playsInline = true;
    preview.preload = 'none';
    preview.setAttribute('aria-hidden', 'true');
    preview.tabIndex = -1;
    const previewStart = () => {
      if (comparisonDialog.open || reduceMotion || !window.matchMedia('(hover: hover)').matches) return;
      if (!preview.getAttribute('src')) preview.src = displayMedia(example.after).video;
      preview.play().then(() => tile.classList.add('is-previewing')).catch(() => {});
    };
    const previewStop = () => { preview.pause(); tile.classList.remove('is-previewing'); };
    tile.addEventListener('pointerenter', previewStart);
    tile.addEventListener('pointerleave', previewStop);
    tile.addEventListener('focus', previewStart);
    tile.addEventListener('blur', previewStop);
    const title = document.createElement('span');
    title.className = 'tile-title';
    title.textContent = example.model;
    const prompt = document.createElement('span');
    prompt.className = 'tile-open';
    prompt.append(icon('play'));
    tile.append(poster, preview, title, prompt);
    tile.addEventListener('click', () => {
      previewStop();
      openComparison(example, tile);
    });
    rail.append(tile);
  }
}

document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  if (filter !== 'all' && active.size !== filter) active = examples.find((item) => item.size === filter);
  renderRail();
  const count = examples.filter((item) => filter === 'all' || item.size === filter).length;
  $('#example-count').textContent = `/ ${count} selected pairs`;
}));

const taskDescriptions = {
  CS: {category:'CHOOSE WHAT BELONGS', title:'Content Selection', description:'Inspect candidate shots and select the footage that belongs in a trailer segment. The agent must connect a written brief to visual evidence.', deliverable:'Output: a selection of shots'},
  NS: {category:'MAKE THE SEQUENCE WORK', title:'Narrative Sequencing', description:'Arrange a given set of shots into a coherent sequence. The agent must reason about visual continuity, narrative progression, and the order of events.', deliverable:'Output: an ordered shot sequence'},
  RC: {category:'FIND THE RIGHT MOMENT', title:'Rough Cut', description:'Set clip boundaries within a fixed shot sequence. The agent must inspect the source footage and decide where each shot should begin and end.', deliverable:'Output: clip in-points and out-points'},
  FC: {category:'BRING PICTURE AND SOUND TOGETHER', title:'Fine Cut', description:'Keep picture timing fixed while selecting and trimming dialogue, placing music, and coordinating picture and sound transitions. Submit the edit and a rendered artifact.', deliverable:'Output: editing decisions and a rendered video'}
};

function shot(number, chosen = false, dim = false) {
  const item = document.createElement('div');
  item.className = `mini-shot${chosen ? ' chosen' : ''}${dim ? ' dim' : ''}`;
  const image = document.createElement('img');
  image.src = examples[number % examples.length].after.poster;
  image.alt = '';
  image.loading = 'lazy';
  const label = document.createElement('span');
  label.textContent = `Shot ${String.fromCharCode(65 + number)}`;
  item.append(image, label);
  return item;
}

function setTask(key, focus = false) {
  const task = taskDescriptions[key];
  for (const [selector, value] of [['#task-category',task.category],['#task-title',task.title],['#task-description',task.description],['#task-deliverable',task.deliverable]]) $(selector).textContent = value;
  document.querySelectorAll('[data-task]').forEach((button) => {
    button.setAttribute('aria-selected', String(button.dataset.task === key));
    button.tabIndex = button.dataset.task === key ? 0 : -1;
    if (focus && button.dataset.task === key) button.focus();
  });
  $('#task-panel').setAttribute('aria-labelledby', `tab-${key.toLowerCase()}`);
  const demo = $('#mini-edit');
  demo.replaceChildren();
  if (key === 'CS') [0,1,2,3].forEach((n) => demo.append(shot(n, n === 0 || n === 2, n === 1 || n === 3)));
  if (key === 'NS') [2,0,3].forEach((n,index) => {
    if (index) { const arrow = document.createElement('span'); arrow.className = 'mini-arrow'; arrow.textContent = '→'; demo.append(arrow); }
    demo.append(shot(n));
  });
  if (key === 'RC') [0,1,2].forEach((n) => { const zone = document.createElement('div'); zone.className = 'cut-zone'; zone.append(shot(n)); demo.append(zone); });
  if (key === 'FC') {
    const tracks = document.createElement('div'); tracks.className = 'mini-tracks';
    for (const [label, kind, blocks] of [['Picture','',4],['Dialogue','audio',2],['Music','music',1]]) {
      const track = document.createElement('div'); track.className = 'track';
      const name = document.createElement('span'); name.className = 'track-label'; name.textContent = label; track.append(name);
      for (let i=0;i<blocks;i++) { const block = document.createElement('span'); block.className = `track-block ${kind}`; track.append(block); }
      tracks.append(track);
    }
    demo.append(tracks);
  }
}

document.querySelectorAll('[data-task]').forEach((button) => {
  button.addEventListener('click', () => setTask(button.dataset.task));
  button.addEventListener('keydown', (event) => {
    const keys = ['CS','NS','RC','FC'];
    let index = keys.indexOf(button.dataset.task);
    if (event.key === 'ArrowRight') index = (index + 1) % 4;
    else if (event.key === 'ArrowLeft') index = (index + 3) % 4;
    else if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = 3;
    else return;
    event.preventDefault(); setTask(keys[index], true);
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
setTask('CS');
setFeature(featureIndex);
