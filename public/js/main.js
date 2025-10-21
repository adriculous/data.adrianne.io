(() => {
  // <stdin>
  document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("mobile-menu-button");
    const menu = document.getElementById("mobile-menu");
    const openIcon = document.getElementById("menu-open-icon");
    const closeIcon = document.getElementById("menu-close-icon");
    if (button && menu) {
      button.addEventListener("click", () => {
        const isHidden = menu.classList.contains("hidden");
        menu.classList.toggle("hidden");
        openIcon.classList.toggle("hidden", !isHidden);
        closeIcon.classList.toggle("hidden", isHidden);
        if (!isHidden) {
          openIcon.classList.remove("hidden");
          closeIcon.classList.add("hidden");
        }
      });
    }
  });
})();
