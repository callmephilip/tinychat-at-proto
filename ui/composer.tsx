import { useServer } from "@tinychat/ui/context/server.tsx";

// emojis per tutti - https://github.com/missive/emoji-mart

export const Composer = () => {
  const { server, currentChannel } = useServer();
  return (
    <>
      <form
        enctype="multipart/form-data"
        hx-post="/messages/send"
        hx-swap="afterbegin"
        hx-target={`#channel-${currentChannel?.id!}`}
        data-channel={currentChannel?.uri}
        id="f-1"
        class="w-full"
        name="f-1"
      >
        {" "}
        <input
          type="text"
          autofocus
          id="msg"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          name="msg"
        />
        <input type="hidden" name="channel" value={currentChannel?.id} />
        <input type="hidden" name="server" value={server?.uri} />
        {
          /* <div
          id="editor-container"
          class="editor-container editor-container_classic-editor flex flex-col rounded-lg border-2 border-grey overflow-hidden"
        >
          <div class="editor-container__editor w-full">

          </div>
           <div class="pl-2">
            <div id="attachments"></div>
          </div>
          <div>
            <button
              id="f-1_upload_pick"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
              name="f-1_upload_pick"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                height="24"
                width="24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4"
              >
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
            </button>{" "}
          </div>
        </div> */
        }
      </form>
      {
        /* <form
        enctype="multipart/form-data"
        hx-post="/upload"
        hx-swap="beforeend"
        hx-target="#f-1"
        id="f-1_upload"
        name="f-1_upload"
      >
        {" "}
        <input
          type="file"
          accept="image/*,.pdf,audio/*"
          id="file"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          style="display: none"
          name="file"
        />
      </form> */
      }
      <script src="/static/composer.js" />
    </>
  );
};
