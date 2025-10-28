import './styles/custom.scss';

import rainyBg from './assets/images/rainy-bg.jpg';
import summerBg from './assets/images/summer-bg.jpg';
import winterBg from './assets/images/winter-bg.jpg';

import rainMp3 from './assets/audio/rain.mp3';
import summerMp3 from './assets/audio/summer.mp3';
import winterMp3 from './assets/audio/winter.mp3';

import { SoundPlayer } from './js/player.js';
import { mountButtons, setActiveButton } from './js/dom.js';

const VOLUME_INPUT_ID = 'volume';
const BUTTONS_ROOT_ID = 'buttons';

const sounds = {
  rain: rainMp3,
  summer: summerMp3,
  winter: winterMp3,
};

const backgrounds = {
  rain: rainyBg,
  summer: summerBg,
  winter: winterBg,
};

const buttons = [
  { key: 'summer', iconClass: 'icon-sun', label: 'Summer', thumb: summerBg },
  { key: 'rain', iconClass: 'icon-cloud-rain', label: 'Rain', thumb: rainyBg },
  {
    key: 'winter',
    iconClass: 'icon-cloud-snow',
    label: 'Winter',
    thumb: winterBg,
  },
];

function main() {
  const volumeInput = document.getElementById(VOLUME_INPUT_ID);
  const btnRoot = document.getElementById(BUTTONS_ROOT_ID);

  mountButtons(btnRoot, buttons);

  const player = new SoundPlayer({
    sounds,
    backgrounds,
    onStateChange: ({ key, playing }) => setActiveButton(btnRoot, key, playing),
  });

  player.setVolume(volumeInput.value);

  volumeInput.addEventListener('input', (e) =>
    player.setVolume(e.target.value),
  );

  btnRoot.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const key = btn.dataset.key;
    player.play(key); // player вызовет onStateChange -> setActiveButton
  });

  // стартовый глобальный фон
  document.body.style.backgroundImage = `url('${backgrounds.summer}')`;
}

window.addEventListener('DOMContentLoaded', main);
