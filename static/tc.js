window.tc = {
  onChannelChange: () => {
    tc.markAllMessagesAsReadInCurrentChannel();
  },
  getCurrentChannel: () => {
    return document.querySelector("#main").getAttribute("data-current-channel");
  },
  getCurrentServer: () => {
    return document.querySelector("#main").getAttribute("data-current-server");
  },
  markAllMessagesAsReadInCurrentChannel: () => {
    htmx.ajax("POST", "/mark-all-as-read", {
      swap: "none",
      values: {
        channel: tc.getCurrentChannel(),
        server: tc.getCurrentServer(),
      },
    });
  },
};

// re https://github.com/bigskysoftware/htmx/issues/183#issuecomment-2594701369
document.addEventListener("DOMContentLoaded", function () {
  document.body.addEventListener(
    "mousedown",
    function (event) {
      const anchor = event.target.closest("a");
      const isButtonOrInput =
        event.target.tagName === "BUTTON" || event.target.tagName === "INPUT";

      if (
        (anchor &&
          (anchor.hasAttribute("hx-get") || anchor.hasAttribute("hx-post"))) ||
        isButtonOrInput
      ) {
        if (event.button > 0) {
          event.stopImmediatePropagation();
        }
      }
    },
    true
  );
});
