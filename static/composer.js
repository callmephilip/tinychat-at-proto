// document.querySelector("#composer").addEventListener("submit", () => {
//   setTimeout(() => {
//     document.querySelector("#msg").value = "";
//   }, 500);
//   setTimeout(() => {
//     tc.markAllMessagesAsReadInCurrentChannel();
//   }, 2000);
// });

const element = document.querySelector("trix-editor");
// https://github.com/basecamp/trix/issues/636
element.addEventListener("keydown", (event) => {
  console.log("Key pressed", element.editor);
  if (event.key == "Enter" && !event.shiftKey) {
    console.log("Enter key pressed", element.inputElement);
    event.preventDefault();
    htmx.trigger("#composer", "submit");
    element.editor.loadHTML("");
  }
});
