(() => {
 const dictionary = window.portfolioTranslations || {};
 const original = new Map();
 const originalAttributes = [];
 const originalTitle = document.title;
 const toggle = document.querySelector('[data-language-toggle]');
 let language = 'en';
 const translate = value => language === 'ar' ? (dictionary[value] || value) : value;
 window.portfolioText = translate;
 const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
 let node;
 while ((node = walker.nextNode())) {
  if (!node.nodeValue.trim() || node.parentElement.closest('script, style, pre, code, [data-language-toggle], [data-i18n-dynamic]')) continue;
  original.set(node, node.nodeValue);
 }
 document.querySelectorAll('[alt], [aria-label]').forEach(element => {
  if (element === toggle) return;
  ['alt', 'aria-label'].forEach(attribute => {
   if (element.hasAttribute(attribute)) originalAttributes.push([element, attribute, element.getAttribute(attribute)]);
  });
 });
 function apply(next) {
  language = next === 'ar' ? 'ar' : 'en';
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  for (const [textNode, source] of original) {
   textNode.nodeValue = source.replace(source.trim(), translate(source.trim()));
  }
  originalAttributes.forEach(([element, attribute, source]) => element.setAttribute(attribute, translate(source)));
  document.title = translate(originalTitle);
  toggle.textContent = language === 'ar' ? 'English' : 'العربية';
  toggle.setAttribute('aria-label', language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
  const zoom = document.querySelector('.viewer-zoom');
  if (zoom) zoom.textContent = translate(zoom.getAttribute('aria-pressed') === 'true' ? 'Zoom out' : 'Zoom in');
  const title = document.querySelector('#viewer-title');
  if (title?.dataset.source) title.textContent = translate(title.dataset.source);
  try { localStorage.setItem('portfolio-language', language); } catch {}
  document.querySelectorAll('a[href]').forEach(link => {
   const href = link.getAttribute('href');
   if (!/^[\w-]+\.html(?:[?#]|$)/.test(href)) return;
   const url = new URL(href, location.href);
   url.searchParams.set('lang', language);
   link.setAttribute('href', url.pathname.split('/').pop() + url.search + url.hash);
  });
 }
 toggle.addEventListener('click', () => apply(language === 'ar' ? 'en' : 'ar'));
 let stored;
 try { stored = localStorage.getItem('portfolio-language'); } catch {}
 const requested = new URLSearchParams(location.search).get('lang');
 apply(requested === 'ar' || requested === 'en' ? requested : stored || 'en');
})();
