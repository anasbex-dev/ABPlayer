const video = document.getElementById('video');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const progressBar = document.getElementById('progressBar');
const timeLabel = document.getElementById('timeLabel');
const loadingOverlay = document.getElementById('loadingOverlay');

// Load Lottie animation
lottie.loadAnimation({
  container: document.getElementById('lottieLoading'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'lottie/ldp.json' // Ganti ini sesuai nama file animasi lo
});

// Fullscreen
function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    video.parentElement.requestFullscreen();
  }
}


playBtn.addEventListener('click', () => {
  if (video.paused) {
    video.play();
    playIcon.src = 'icons/pause.png';
  } else {
    video.pause();
    playIcon.src = 'icons/play.png';
  }
});

video.addEventListener('timeupdate', () => {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.value = percent;
  timeLabel.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  
  // Tambahin ini buat gradient-nya
  progressBar.style.background = `linear-gradient(90deg, #ff6a00 ${percent}%, #cccccc ${percent}%)`;
});

progressBar.addEventListener('input', () => {
  const percent = progressBar.value; // Value sudah dari 0–100
  video.currentTime = video.duration * (percent / 100);
  
  // Update background gradient
  progressBar.style.background = `linear-gradient(90deg, #ff6a00 ${percent}%, #cccccc ${percent}%)`;
});

function skip(seconds) {
  video.currentTime += seconds;
}

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Auto Play & Loading
video.addEventListener('loadeddata', () => {
  loadingOverlay.style.display = 'none';
  video.play();
  playIcon.src = 'icons/pause.png';
});

// Externally triggered from Android
function loadVideo(url) {
  loadingOverlay.style.display = 'flex';
  video.src = url;
  video.load();
}

// Controll UI Video

let controlTimeout;

// Tampilkan kontrol dan reset timer
function showControlsTemporarily() {
  document.querySelector('.controls').style.opacity = '1';
  document.querySelector('.controls').style.pointerEvents = 'auto';
  resetAutoHideControls();
}

// Sembunyikan kontrol
function hideControls() {
  document.querySelector('.controls').style.opacity = '0';
  document.querySelector('.controls').style.pointerEvents = 'none';
}

// Reset timer untuk hide
function resetAutoHideControls() {
  clearTimeout(controlTimeout);
  controlTimeout = setTimeout(() => {
    hideControls();
  }, 5000); // 5 detik
}

// Set semua listener di awal
function setupAutoHideControls() {
  video.parentElement.addEventListener('mousemove', showControlsTemporarily);
  video.parentElement.addEventListener('click', showControlsTemporarily);
  showControlsTemporarily(); // awal muncul dulu
}

// Panggil setelah DOM siap
document.addEventListener('DOMContentLoaded', () => {
  setupAutoHideControls();
});