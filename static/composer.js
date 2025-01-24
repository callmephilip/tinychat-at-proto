document.querySelector("#composer").addEventListener("submit", () => {
  setTimeout(() => {
    document.querySelector("#msg").value = "";
  }, 500);
  setTimeout(() => {
    tc.markAllMessagesAsReadInCurrentChannel();
  }, 2000);
});
