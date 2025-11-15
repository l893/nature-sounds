import './styles/custom.scss';

import rainyBackground from './assets/images/rainy-bg.jpg';
import summerBackground from './assets/images/summer-bg.jpg';
import winterBackground from './assets/images/winter-bg.jpg';

import rainAudio from './assets/audio/rain.mp3';
import summerAudio from './assets/audio/summer.mp3';
import winterAudio from './assets/audio/winter.mp3';

import { SoundPlayer } from './ts/player';
import { mountWeatherButtons, setActiveWeatherButton } from './ts/dom';
import type { SceneKey, ButtonSpec } from './ts/models/scene';
import type { ActiveButtonState } from './components/WeatherButton/types';

const VOLUME_INPUT_ID = 'volume';
const BUTTONS_ROOT_ID = 'buttons';

const sounds: Record<SceneKey, string> = {
  rain: rainAudio,
  summer: summerAudio,
  winter: winterAudio,
};

const backgrounds: Record<SceneKey, string> = {
  rain: rainyBackground,
  summer: summerBackground,
  winter: winterBackground,
};

const buttons: ButtonSpec[] = [
  {
    key: 'summer',
    iconClass: 'icon-sun',
    label: 'Summer',
    thumb: summerBackground,
  },
  {
    key: 'rain',
    iconClass: 'icon-cloud-rain',
    label: 'Rain',
    thumb: rainyBackground,
  },
  {
    key: 'winter',
    iconClass: 'icon-cloud-snow',
    label: 'Winter',
    thumb: winterBackground,
  },
];

function isSceneKey(value: string): value is SceneKey {
  return value === 'rain' || value === 'summer' || value === 'winter';
}

function handleStateChange(state: ActiveButtonState): void {
  const buttonsRoot = document.getElementById(BUTTONS_ROOT_ID);
  if (buttonsRoot instanceof HTMLElement) {
    setActiveWeatherButton(buttonsRoot, state);
  }
}

function main(): void {
  const volumeElement = document.getElementById(VOLUME_INPUT_ID);
  const buttonsRoot = document.getElementById(BUTTONS_ROOT_ID);

  if (
    !(volumeElement instanceof HTMLInputElement) ||
    !(buttonsRoot instanceof HTMLElement)
  ) {
    console.error('Required DOM elements not found');
    return;
  }

  mountWeatherButtons(buttonsRoot, buttons);

  const player = new SoundPlayer({
    sounds,
    backgrounds,
    onStateChange: handleStateChange,
  });

  player.setVolume(volumeElement.value);

  volumeElement.addEventListener('input', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      player.setVolume(target.value);
    }
  });

  buttonsRoot.addEventListener('click', (event) => {
    const target = event.target as Element | null;
    const button = target?.closest<HTMLButtonElement>('.btn');

    if (!button) return;

    const dataKey = button.dataset.key;
    if (!dataKey || !isSceneKey(dataKey)) return;

    player.play(dataKey);
  });

  document.body.style.backgroundImage = `url('${backgrounds.summer}')`;
}

window.addEventListener('DOMContentLoaded', main);
