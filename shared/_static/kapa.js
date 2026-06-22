/* Kapa.ai widget loader.
 * Loaded lazily on first Ask AI tab click. The floating launcher button is
 * hidden; the modal is opened programmatically via window.Kapa.open(). */
(function () {
  function boot() {
    var script = document.createElement('script');
    script.src = 'https://widget.kapa.ai/kapa-widget.bundle.js';
    script.setAttribute('data-website-id', '88cc40d6-4b04-45c5-bfa1-e051d93ae847');
    script.setAttribute('data-project-name', 'Tenstorrent');
    script.setAttribute('data-project-color', '#7d00fa29');
    script.setAttribute('data-project-logo', 'https://avatars.githubusercontent.com/u/64161552?s=200&v=4');
    script.setAttribute('data-modal-title', 'Tenstorrent AI Assistant');
    script.setAttribute('data-modal-example-questions-title', 'Try asking me...');
    script.setAttribute('data-modal-disclaimer',
      '**This is an AI assistant trained on our [Technical Documentation](https://docs.tenstorrent.com/), ' +
      '28 core [Developer Repositories (GH)](https://github.com/tenstorrent), and ' +
      '[QEMU Documentation](https://www.qemu.org/docs/master/). Try asking it a question!');
    script.setAttribute('data-modal-example-questions',
      'How to debug TT-Forge compile errors?,' +
      'How to set up Tenstorrent Cloud SSH?,' +
      'TT-Metalium vs TT-NN differences?,' +
      'How to daisy-chain Wormhole devices?');
    script.setAttribute('data-button-text-color', '#000000');
    script.setAttribute('data-hyperlink-color', '#7d00fa');
    script.setAttribute('data-mcp-enabled', 'true');
    script.setAttribute('data-mcp-server-url', 'https://tenstorrent.mcp.kapa.ai');
    script.setAttribute('data-button-hide', 'true');
    script.async = true;
    document.head.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
