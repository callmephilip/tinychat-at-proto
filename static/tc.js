window.tc = {
  onChannelChange: () => {
    tc.markAllMessagesAsReadInCurrentChannel();
  },
  getCurrentChannel: () => {
    return document.querySelector("#main").getAttribute("data-current-channel");
  },
  markAllMessagesAsReadInCurrentChannel: () => {
    htmx.ajax("POST", "/mark-all-as-read", {
      swap: "none",
      values: {
        channel: tc.getCurrentChannel(),
      },
    });
  },
};
