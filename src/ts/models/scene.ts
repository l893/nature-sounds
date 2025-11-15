export type SceneKey = 'rain' | 'summer' | 'winter';

export type IconClass =
  | 'icon-sun'
  | 'icon-cloud-rain'
  | 'icon-cloud-snow'
  | 'icon-pause';

export type ButtonSpec = {
  key: SceneKey;
  iconClass: Exclude<IconClass, 'icon-pause'>;
  label: string;
  thumb?: string;
};

export type SoundPlayerState = {
  key: SceneKey | null;
  playing: boolean;
};
