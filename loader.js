(() => {
  const loadGzip = async path => {
    if (!('DecompressionStream' in window)) throw new Error('This browser does not support gzip decompression.');
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Unable to load ${path} (${response.status})`);
    const stream = response.body.pipeThrough(new DecompressionStream('gzip'));
    return new Response(stream).text();
  };
  (async () => {
    try {
      const css = await loadGzip('styles.css.gz');
      const style = document.createElement('style');
      style.id = 'shieldcore-styles';
      style.textContent = css + `
        :root { --font: 'Inter', system-ui, sans-serif; --latin: 'Inter', sans-serif; }
        html { direction: ltr; }
        body { direction: ltr; font-family: var(--font); }
        .scroll-progress { right: auto; left: 0; }
        .eyebrow b { border-right: 0; padding-right: 0; border-left: 1px solid var(--line-strong); padding-left: 10px; }
        .nav-cta span, .text-link span, .scenario-btn span { margin-right: 0; margin-left: 7px; }
        .caption-arrow, .swot-title small, .footer-links { margin-right: 0; margin-left: auto; }
        .menu-toggle { margin-right: 0; margin-left: auto; }
        .business-card ul, .swot-card ul { padding-right: 0; padding-left: 18px; }
        .transaction-info small { direction: ltr; text-align: left; }
        .console-state i, .console-foot span:first-child i { margin-right: 0; margin-left: 5px; }
        .proof-divider { margin-inline: 12px; }
        @media (max-width: 760px) {
          .menu-toggle { margin-right: 0; margin-left: auto; }
          .footer-links { margin-left: 0; margin-right: 0; }
        }
      `;
      document.head.appendChild(style);
      const script = document.createElement('script');
      script.src = 'script.js';
      script.defer = true;
      document.body.appendChild(script);
    } catch (error) {
      console.error('ShieldCore website assets could not be loaded:', error);
      const notice = document.createElement('p');
      notice.textContent = 'The website assets could not be loaded. Please open this page through a modern HTTP/HTTPS host.';
      notice.style.cssText = 'position:fixed;bottom:12px;left:12px;right:12px;z-index:9999;padding:12px;background:#311018;color:#fff;border:1px solid #e11d35;border-radius:8px;text-align:center;font-family:Inter,sans-serif';
      document.body.appendChild(notice);
    }
  })();
})();
