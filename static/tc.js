document.addEventListener("DOMContentLoaded", () => {
  window.tc = {
    onChannelChange: (selctedChannelId) => {
      document
        .querySelector("#main")
        .setAttribute("data-current-channel", selctedChannelId);
      tc.markAllMessagesAsReadInCurrentChannel();
      const url = new URL(location);
      url.searchParams.set("ch", selctedChannelId);
      history.pushState({}, "", url);
    },
    getCurrentChannel: () => {
      return document
        .querySelector("#main")
        .getAttribute("data-current-channel");
    },
    getCurrentServer: () => {
      return document
        .querySelector("#main")
        .getAttribute("data-current-server");
    },
    markAllMessagesAsReadInCurrentChannel: () => {
      const channel = tc.getCurrentChannel();
      document
        .querySelector(`#nav-channel-label-${channel}`)
        .classList.remove("has-new-messages");
      htmx.ajax("POST", "/mark-all-as-read", {
        swap: "none",
        values: {
          channel,
          server: tc.getCurrentServer(),
        },
      });
    },
  };

  // mark current channel as read after 5 seconds
  setTimeout(() => {
    tc.markAllMessagesAsReadInCurrentChannel();
  }, 4000);

  document.querySelectorAll("[name=channel-tab]").forEach((t) => {
    t.addEventListener("change", (e) => {
      if (!e.target.checked) {
        return;
      }
      const channelId = e.target.id.split("-")[1];
      tc.onChannelChange(channelId);

      // toggle nav selector
      // bg-red-100;
      const selectedClass = "bg-red-100";
      document.querySelectorAll("[id^=nav-channel]").forEach((nav) => {
        if (nav.id === `nav-channel-${channelId}`) {
          nav.classList.add(selectedClass);
        } else {
          nav.classList.remove(selectedClass);
        }
      });

      // update target on composer
      document
        .querySelector("#composer")
        .setAttribute("hx-target", `#channel-${channelId}`);
      document.querySelector("#composer input[name=channel]").value = channelId;

      // focus on composer
      document.querySelector("#msg").focus();
    });
  });
});
