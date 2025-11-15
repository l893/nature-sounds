import type { WeatherButtonProps, ActiveButtonState } from './types';

export function createWeatherButton(
  props: WeatherButtonProps,
): HTMLButtonElement {
  const { key, iconClass, label, thumb } = props;

  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.dataset.key = key;
  btn.dataset.iconClass = iconClass;
  btn.dataset.pauseClass = 'icon-pause';

  if (thumb) {
    btn.style.setProperty('--thumb', `url('${thumb}')`);
  }

  const icon = document.createElement('i');
  icon.className = `icon ${iconClass}`;
  icon.setAttribute('aria-hidden', 'true');

  const labelSpan = document.createElement('span');
  labelSpan.className = 'btn__label';
  labelSpan.textContent = label;

  btn.append(icon, labelSpan);
  return btn;
}

export function mountWeatherButtons(
  root: HTMLElement,
  buttons: WeatherButtonProps[],
): void {
  const fragment = document.createDocumentFragment();
  buttons.forEach((button) => {
    fragment.appendChild(createWeatherButton(button));
  });
  root.replaceChildren(fragment);
}

export function setActiveWeatherButton(
  root: HTMLElement,
  state: ActiveButtonState,
): void {
  const { key: activeKey, playing } = state;
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('.btn'));

  buttons.forEach((button) => {
    const isCurrent = button.dataset.key === activeKey;
    button.classList.toggle('is-active', isCurrent && playing);

    const iconElement = button.querySelector('.icon');
    if (!iconElement) return;

    const weatherIconClass = button.dataset.iconClass ?? '';
    const pauseIconClass = button.dataset.pauseClass ?? 'icon-pause';

    if (isCurrent && playing) {
      iconElement.classList.remove(weatherIconClass);
      iconElement.classList.add(pauseIconClass);
    } else {
      iconElement.classList.remove(pauseIconClass);
      if (weatherIconClass) {
        iconElement.classList.add(weatherIconClass);
      }
    }
  });
}
