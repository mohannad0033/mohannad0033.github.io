document.querySelectorAll('.copy-code').forEach(button => {
 button.addEventListener('click', async () => {
  const code = button.closest('.code-panel').querySelector('code');
  try {
   await navigator.clipboard.writeText(code.getAttribute("data-copy-source") || code.textContent);
   button.textContent = window.portfolioText?.('Copied') || 'Copied';
   setTimeout(() => { button.textContent = window.portfolioText?.('Copy code') || 'Copy code'; }, 1600);
  } catch {
   const input = document.createElement('textarea');
   input.value = code.getAttribute('data-copy-source') || code.textContent;
   input.style.position = 'fixed'; input.style.top = '0';
   document.body.append(input); input.focus(); input.select();
   const copied = document.execCommand('copy'); input.remove(); button.focus();
   button.textContent = window.portfolioText?.(copied ? 'Copied' : 'Copy unavailable') || (copied ? 'Copied' : 'Copy unavailable');
   setTimeout(() => { button.textContent = window.portfolioText?.('Copy code') || 'Copy code'; }, 1600);
  }
 });
});
