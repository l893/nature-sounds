export function createButton({ key, iconClass, label, thumb }) {
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

export function mountButtons(root, buttons) {
  const frag = document.createDocumentFragment();
  buttons.forEach((b) => frag.appendChild(createButton(b)));
  root.replaceChildren(frag);
}

export function setActiveButton(root, key, playing) {
  const cards = Array.from(root.querySelectorAll('.btn'));
  cards.forEach((b) => {
    const isCurrent = b.dataset.key === key;
    b.classList.toggle('is-active', isCurrent && playing);

    const iconEl = b.querySelector('.icon');
    if (!iconEl) return;

    const weatherClass = b.dataset.iconClass;
    const pauseClass = b.dataset.pauseClass || 'icon-pause';

    if (isCurrent && playing) {
      iconEl.classList.remove(weatherClass);
      iconEl.classList.add(pauseClass);
    } else {
      iconEl.classList.remove(pauseClass);
      iconEl.classList.add(weatherClass);
    }
  });
}
