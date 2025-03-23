import { useServer } from "@tinychat/ui/context/server.tsx";

// emojis per tutti - https://github.com/missive/emoji-mart

export const Composer = () => {
  const { server, currentChannel } = useServer();
  return (
    <>
      <template x-if="$store.replyTo.message">
        <strong x-text="$store.replyTo.message.record.text" />
      </template>
      <form
        enctype="multipart/form-data"
        hx-post="/messages/send"
        hx-swap="afterbegin"
        hx-target={`#channel-${currentChannel?.id!}`}
        data-channel={currentChannel?.uri}
        id="composer"
        class="w-full"
      >
        <input
          type="text"
          autofocus
          id="msg"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          name="msg"
          required
          data-testid="composer"
        />
        <trix-toolbar onKeyDown="handleSubmitKeyDown" id="my_toolbar"></trix-toolbar>
        <div class="more-stuff-inbetween"></div>
        <trix-editor toolbar="my_toolbar" input="msg"></trix-editor>
        <input type="hidden" name="channel" value={currentChannel?.id} />
        <input type="hidden" name="server" value={server?.uri} />
        <template x-if="$store.replyTo.reply">
          <input type="hidden" name="reply" x-model="$store.replyTo.reply" />
        </template>
      </form>
      <script src={`/static/composer.js?${Math.random() * 10000}`} />
    </>
  );
};
