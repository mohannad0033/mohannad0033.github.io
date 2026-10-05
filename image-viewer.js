(() => {
 const dialog = document.createElement('dialog');
 dialog.className = 'image-viewer';
 dialog.setAttribute('aria-label', 'Enlarged project image');
 dialog.innerHTML = '<div class="viewer-toolbar"><p id="viewer-title" data-i18n-dynamic>Project image</p><div><button type="button" class="viewer-zoom" aria-pressed="false">Zoom in</button><button type="button" class="viewer-close">Close</button></div></div><div class="viewer-scroll"><div class="viewer-canvas"><img alt=""></div></div>';
 document.body.append(dialog);
 const picture = dialog.querySelector('img');
 const canvas = dialog.querySelector('.viewer-canvas');
 const zoom = dialog.querySelector('.viewer-zoom');
 let trigger;
 function close() { dialog.close(); }
 dialog.querySelector('.viewer-close').addEventListener('click', close);
 dialog.addEventListener('click', e => { if(e.target === dialog) close(); });
 dialog.addEventListener('close', () => {
  document.body.classList.remove('viewer-open');
  picture.removeAttribute('src');
  if(trigger) trigger.focus();
 });
 zoom.addEventListener('click', () => {
  const enabled = zoom.getAttribute('aria-pressed') !== 'true';
  zoom.setAttribute('aria-pressed', String(enabled));
  zoom.textContent = window.portfolioText?.(enabled ? 'Zoom out' : 'Zoom in') || (enabled ? 'Zoom out' : 'Zoom in');
  canvas.classList.toggle('zoomed', enabled);
 });
 document.querySelectorAll('figure img').forEach(img => {
  img.setAttribute('data-source-alt', img.alt);
  const figure = img.closest('figure');
  const link = document.createElement('a');
  link.href = img.getAttribute('src');
  link.target = '_blank';
  link.rel = 'noopener';
  link.className = 'image-open-link';
  link.setAttribute('aria-label', 'Enlarged project image');
  const container = img.closest('.slide-window, .poster-window');
  if(container) { container.replaceWith(link); link.append(container); }
  else { img.replaceWith(link); link.append(img); }
  const caption = figure.querySelector('figcaption');
  if(caption) {
   const open = document.createElement('a');
   open.href = link.href; open.target = '_blank'; open.rel = 'noopener';
   open.className = 'image-open-caption'; open.textContent = 'Open image';
   caption.append(' · ', open);
   open.addEventListener('click', e => { e.preventDefault(); link.click(); });
  }
  link.addEventListener('click', e => {
   if(typeof dialog.showModal !== 'function') return;
   e.preventDefault(); trigger = link;
   picture.src = img.getAttribute('src'); picture.alt = img.alt;
   dialog.querySelector('#viewer-title').dataset.source = img.getAttribute('data-source-alt') || img.alt;
   dialog.querySelector('#viewer-title').textContent = img.alt;
   canvas.className = 'viewer-canvas' + (container?.classList.contains('slide-window') ? ' slide-window' : container?.classList.contains('poster-window') ? ' poster-window' : '');
   zoom.setAttribute('aria-pressed', 'false'); zoom.textContent = window.portfolioText?.('Zoom in') || 'Zoom in';
   dialog.showModal();
   document.body.classList.add('viewer-open');
   dialog.querySelector('.viewer-scroll').scrollTo(0, 0);
  });
 });
})();
