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
