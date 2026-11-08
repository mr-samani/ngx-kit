export function getOffsetPosition(evt: MouseEvent | TouchEvent, parent: HTMLElement) {
  const position = {
    x: 0,
    y: 0,
  };

  if ('touches' in evt) {
    if (evt.touches.length > 0) {
      position.x = evt.touches[0].pageX;
      position.y = evt.touches[0].pageY;
    }
  } else {
    position.x = evt.pageX;
    position.y = evt.pageY;
  }

  const parentRect = parent.getBoundingClientRect();

  position.x -= parentRect.left + window.scrollX;
  position.y -= parentRect.top + window.scrollY;

  return position;
}
