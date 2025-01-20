document.querySelector("#f-1").addEventListener("submit", () => {
  setTimeout(() => {
    document.querySelector("#msg").value = "";
  }, 500);
});
