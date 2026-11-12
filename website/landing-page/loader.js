(() => {
  const loadGzip = async (path) => {
    if (!("DecompressionStream" in window)) throw new Error("This browser does not support gzip decompression.");
    const response = await fetch(path);
    if (!response.ok) throw new Error("Unable to load " + path + " (" + response.status + ")");
    const stream = response.body.pipeThrough(new DecompressionStream("gzip"));
    return await new Response(stream).text();
  };
  (async () => {
    try {
      const css = await loadGzip("styles.css.gz");
      const style = document.createElement("style");
      style.textContent = css;
      document.head.appendChild(style);
      const js = await loadGzip("script.js.gz");
      const script = document.createElement("script");
      script.textContent = js;
      document.body.appendChild(script);
    } catch (error) {
      console.error("ShieldCore landing page failed to load:", error);
      const notice = document.createElement("p");
      notice.textContent = "تعذر تحميل ملفات الموقع. افتح الصفحة عبر استضافة HTTP/HTTPS حديثة.";
      notice.style.cssText = "position:fixed;bottom:12px;left:12px;right:12px;z-index:9999;padding:12px;background:#311018;color:#fff;border:1px solid #e11d35;border-radius:8px;text-align:center";
      document.body.appendChild(notice);
    }
  })();
})();