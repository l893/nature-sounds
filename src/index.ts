import './styles/custom.scss';

import rainyBg from './assets/images/rainy-bg.jpg';
import summerBg from './assets/images/summer-bg.jpg';
import winterBg from './assets/images/winter-bg.jpg';

import rainMp3 from './assets/audio/rain.mp3';
import summerMp3 from './assets/audio/summer.mp3';
import winterMp3 from './assets/audio/winter.mp3';

import { SoundPlayer, type SceneKey } from './ts/player';
import { mountButtons, setActiveButton, type ButtonSpec } from './ts/dom';

const VOLUME_INPUT_ID = 'volume';
const BUTTONS_ROOT_ID = 'buttons';

const sounds: Record<SceneKey, string> = {
  rain: rainMp3,
  summer: summerMp3,
  winter: winterMp3,
};

const backgrounds: Record<SceneKey, string> = {
  rain: rainyBg,
  summer: summerBg,
  winter: winterBg,
};

const buttons: ButtonSpec[] = [
  { key: 'summer', iconClass: 'icon-sun', label: 'Summer', thumb: summerBg },
  { key: 'rain', iconClass: 'icon-cloud-rain', label: 'Rain', thumb: rainyBg },
  {
    key: 'winter',
    iconClass: 'icon-cloud-snow',
    label: 'Winter',
    thumb: winterBg,
  },
];

function isSceneKey(x: string): x is SceneKey {
  return x === 'rain' || x === 'summer' || x === 'winter';
}

function main(): void {
  const volumeEl = document.getElementById(VOLUME_INPUT_ID);
  const btnRoot = document.getElementById(BUTTONS_ROOT_ID);

  if (
    !(volumeEl instanceof HTMLInputElement) ||
    !(btnRoot instanceof HTMLElement)
  ) {
    return;
  }

  mountButtons(btnRoot, buttons);

  const player = new SoundPlayer({
    sounds,
    backgrounds,
    onStateChange: ({ key, playing }) => setActiveButton(btnRoot, key, playing),
  });

  player.setVolume(volumeEl.value);

  volumeEl.addEventListener('input', (e) => {
    const t = e.target;
    if (t instanceof HTMLInputElement) {
      player.setVolume(t.value);
    }
  });

  btnRoot.addEventListener('click', (e) => {
    const target = e.target as Element | null;
    const btn = target?.closest<HTMLButtonElement>('.btn');
    if (!btn) return;

    const dk = btn.dataset.key;
    if (!dk || !isSceneKey(dk)) return;

    player.play(dk);
  });

  document.body.style.backgroundImage = `url('${backgrounds.summer}')`;
}

window.addEventListener('DOMContentLoaded', main);
