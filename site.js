function showConnectionStatus() {
  const banner = document.createElement("div");
  banner.id = "connectionBanner";
  banner.className = "connection-banner";
  document.body.appendChild(banner);

  function render() {
    if (navigator.onLine) {
      banner.textContent = "Back online";
      banner.classList.add("show", "online");
      banner.classList.remove("offline");
      setTimeout(() => banner.classList.remove("show"), 1500);
    } else {
      banner.textContent = "You are offline. Using cached content.";
      banner.classList.add("show", "offline");
      banner.classList.remove("online");
    }
  }

  window.addEventListener("online", render);
  window.addEventListener("offline", render);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Silent fail keeps UX smooth on unsupported contexts.
    });
  });
}

showConnectionStatus();
