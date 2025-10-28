export class SoundPlayer {
  constructor({ sounds, backgrounds, onStateChange }) {
    this.sounds = sounds;
    this.backgrounds = backgrounds;
    this.onStateChange = onStateChange;

    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.audio.loop = true;
    this.currentKey = null;
    this.isPaused = true;

    this.audio.addEventListener('ended', () => {
      this.isPaused = true;
      this.onStateChange?.({ key: this.currentKey, playing: false });
    });
  }

  setVolume(value) {
    const v = typeof value === 'string' ? parseFloat(value) : value;
    this.audio.volume = Number.isFinite(v) ? Math.min(Math.max(v, 0), 1) : 1;
  }

  _applyBackground(key) {
    const bg = this.backgrounds[key];
    if (bg) {
      document.body.style.backgroundImage = `url('${bg}')`;
    }
  }

  play(key) {
    if (!this.sounds[key]) return;

    // Если играет другой трек — переключаемся
    if (this.currentKey !== key) {
      this.audio.pause();
      this.audio.src = this.sounds[key];
      this.currentKey = key;
      this._applyBackground(key);
    }

    // Если нажали повторно на ту же кнопку — toggle
    if (!this.audio.paused) {
      this.audio.pause();
      this.isPaused = true;
      this.onStateChange?.({ key, playing: false });
      return;
    }

    // Старт/резюм
    this.audio
      .play()
      .then(() => {
        this.isPaused = false;
        this.onStateChange?.({ key, playing: true });
      })
      .catch((err) => {
        console.error('Audio play error:', err);
      });
  }
}
