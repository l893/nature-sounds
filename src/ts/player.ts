import type { SceneKey, SoundPlayerState } from './models/scene';

export interface SoundPlayerOptions {
  sounds: Record<SceneKey, string>;
  backgrounds: Record<SceneKey, string>;
  onStateChange?: (state: SoundPlayerState) => void;
}

export class SoundPlayer {
  private readonly audio: HTMLAudioElement = new Audio();
  private _currentKey: SceneKey | null = null;
  private _isPlaying = false;

  constructor(private readonly options: SoundPlayerOptions) {
    this.audio.preload = 'auto';
    this.audio.loop = true;

    this.audio.addEventListener('ended', () => {
      this._isPlaying = false;
      this.options.onStateChange?.(this.getCurrentState());
    });
  }

  get currentKey(): SceneKey | null {
    return this._currentKey;
  }

  get isPlaying(): boolean {
    return this._isPlaying;
  }

  private getCurrentState(): SoundPlayerState {
    return {
      key: this._currentKey,
      playing: this._isPlaying,
    };
  }

  setVolume(value: number | string): void {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    const clampedVolume = Number.isFinite(numericValue)
      ? Math.min(Math.max(numericValue, 0), 1)
      : 1;
    this.audio.volume = clampedVolume;
  }

  private applyBackground(key: SceneKey): void {
    const background = this.options.backgrounds[key];
    if (background) {
      document.body.style.backgroundImage = `url('${background}')`;
    }
  }

  play(key: SceneKey): void {
    if (!this.options.sounds[key]) return;

    if (this._currentKey !== key) {
      this.audio.pause();
      this.audio.src = this.options.sounds[key];
      this._currentKey = key;
      this.applyBackground(key);
    }

    if (!this.audio.paused) {
      this.audio.pause();
      this._isPlaying = false;
      this.options.onStateChange?.(this.getCurrentState());
      return;
    }

    this.audio
      .play()
      .then(() => {
        this._isPlaying = true;
        this.options.onStateChange?.(this.getCurrentState());
      })
      .catch((error) => {
        console.error('Audio play error:', error);
      });
  }
}
