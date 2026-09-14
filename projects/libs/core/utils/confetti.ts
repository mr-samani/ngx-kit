export function makeConfetti(doc: Document, wrap: HTMLElement) {
  wrap.innerHTML = '';
  const colors = ['#3ee08f', '#43e0d8', '#8b7bff', '#ffc45c'];
  for (let i = 0; i < 24; i++) {
    const s = doc.createElement('span');
    s.style.left = Math.random() * 100 + '%';
    s.style.background = colors[i % colors.length];
    s.style.animationDelay = Math.random() * 0.4 + 's';
    s.style.animationDuration = 1.2 + Math.random() * 0.8 + 's';
    s.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    wrap.appendChild(s);
  }
}
