import type { SceneKey } from './player';

export type IconClass =
  | 'icon-sun'
  | 'icon-cloud-rain'
  | 'icon-cloud-snow'
  | 'icon-pause';

export interface ButtonSpec {
  key: SceneKey;
  iconClass: Exclude<IconClass, 'icon-pause'>;
  label: string;
  thumb?: string;
}

export function createButton({
  key,
  iconClass,
  label,
  thumb,
}: ButtonSpec): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.dataset.key = key;
  btn.dataset.iconClass = iconClass;
  btn.dataset.pauseClass = 'icon-pause';

  if (thumb) btn.style.setProperty('--thumb', `url('${thumb}')`);

  const ico = document.createElement('i');
  ico.className = `icon ${iconClass}`;
  ico.setAttribute('aria-hidden', 'true');

  const span = document.createElement('span');
  span.className = 'btn__label';
  span.textContent = label;

  btn.append(ico, span);
  return btn;
}

export function mountButtons(root: HTMLElement, buttons: ButtonSpec[]): void {
  const frag = document.createDocumentFragment();
  buttons.forEach((b) => frag.appendChild(createButton(b)));
  root.replaceChildren(frag);
}

export function setActiveButton(
  root: HTMLElement,
  key: string | null,
  playing: boolean,
): void {
  const cards = Array.from(root.querySelectorAll<HTMLButtonElement>('.btn'));
  cards.forEach((b) => {
    const isCurrent = b.dataset.key === key;
    b.classList.toggle('is-active', isCurrent && playing);

    const iconEl = b.querySelector('.icon');
    if (!iconEl) return;

    const weather = b.dataset.iconClass ?? '';
    const pause = b.dataset.pauseClass ?? 'icon-pause';

    if (isCurrent && playing) {
      iconEl.classList.remove(weather);
      iconEl.classList.add(pause);
    } else {
      iconEl.classList.remove(pause);
      if (weather) iconEl.classList.add(weather);
    }
  });
}
