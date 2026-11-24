const installButton = document.querySelector('[data-install-app]');
const installHelp = document.querySelector('#install-help');

if (installButton && installHelp) {
  let installPrompt;

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    installButton.hidden = false;
  });

  installButton.addEventListener('click', async () => {
    const prompt = installPrompt;
    if (!prompt) return;
    installPrompt = undefined;
    installButton.hidden = true;
    try {
      const { outcome } = await prompt.prompt();
      if (outcome !== 'accepted') installHelp.open = true;
    } catch {
      installHelp.open = true;
    }
  });

  window.addEventListener('appinstalled', () => {
    installPrompt = undefined;
    installButton.hidden = true;
    installHelp.open = false;
  });
}
