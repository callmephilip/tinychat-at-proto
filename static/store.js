document.addEventListener("alpine:init", () => {
  Alpine.store("replyTo", {
    message: null,
    reply: null,
    set(m) {
      const root = m.record.reply ? m.record.reply.root : m;
      this.message = m;
      this.reply = JSON.stringify({
        root: {
          uri: root.uri,
          cid: root.cid,
        },
        parent: {
          uri: m.uri,
          cid: m.cid,
        },
      });
    },
  });
});
