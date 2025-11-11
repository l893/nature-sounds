export type SceneKey = 'rain' | 'summer' | 'winter';

export interface SoundPlayerOptions {
  sounds: Record<SceneKey, string>;
  backgrounds: Record<SceneKey, string>;
  onStateChange?: (state: { key: SceneKey | null; playing: boolean }) => void;
}

export class SoundPlayer {
  private readonly audio: HTMLAudioElement = new Audio();
  private _currentKey: SceneKey | null = null;
  private _isPlaying = false;

  constructor(private readonly opts: SoundPlayerOptions) {
    this.audio.preload = 'auto';
    this.audio.loop = true;

    this.audio.addEventListener('ended', () => {
      this._isPlaying = false;
      this.opts.onStateChange?.({ key: this._currentKey, playing: false });
    });
  }

  get currentKey(): SceneKey | null {
    return this._currentKey;
  }

  get isPlaying(): boolean {
    return this._isPlaying;
  }

  setVolume(value: number | string): void {
    const n = typeof value === 'string' ? parseFloat(value) : value;
    const clamped = Number.isFinite(n) ? Math.min(Math.max(n, 0), 1) : 1;
    this.audio.volume = clamped;
  }

  private applyBackground(key: SceneKey): void {
    const bg = this.opts.backgrounds[key];
    if (bg) document.body.style.backgroundImage = `url('${bg}')`;
  }

  play(key: SceneKey): void {
    if (!this.opts.sounds[key]) return;

    if (this._currentKey !== key) {
      this.audio.pause();
      this.audio.src = this.opts.sounds[key];
      this._currentKey = key;
      this.applyBackground(key);
    }

    if (!this.audio.paused) {
      this.audio.pause();
      this._isPlaying = false;
      this.opts.onStateChange?.({ key, playing: false });
      return;
    }

    void this.audio
      .play()
      .then(() => {
        this._isPlaying = true;
        this.opts.onStateChange?.({ key, playing: true });
      })
      .catch((err) => console.error('Audio play error:', err));
  }
}
