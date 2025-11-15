import type { ButtonSpec } from '../../ts/models/scene';

export type WeatherButtonProps = ButtonSpec;

export interface WeatherButtonConfig {
  root: HTMLElement;
  buttons: ButtonSpec[];
  onButtonClick: (key: string) => void;
}

export interface ActiveButtonState {
  key: string | null;
  playing: boolean;
}
