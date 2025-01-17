import { shortIdFromAtUri } from "tinychat/utils.ts";
import { useServer } from "@tinychat/ui/context/server.tsx";

export const Composer = () => {
  const { server, currentChannel } = useServer();
  return (
    <>
      <form
        enctype="multipart/form-data"
        hx-post="/messages/send"
        hx-swap="afterbegin"
        hx-target={`#channel-${shortIdFromAtUri(currentChannel?.uri!)}`}
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
        <input type="hidden" name="channel" value={currentChannel?.uri} />
        <input type="hidden" name="server" value={server?.uri} />
        <div
          id="editor-container"
          class="editor-container editor-container_classic-editor flex flex-col rounded-lg border-2 border-grey overflow-hidden"
        >
          <div class="editor-container__editor w-full">
            {/* <div x-data="{ placeholder: &quot;Message #general&quot;, formId: &quot;f-1&quot;, maxUploadSizeInBytes: 10485760 }" x-init="import('editor.js').then((editor) => editor.default($el, $data))" id="editor" style="display: none;"></div><div class="ck ck-reset ck-editor ck-rounded-corners" role="application" dir="ltr" lang="en" aria-labelledby="ck-editor__label_e29a9d792075ea4342614ef9228178e3e"><label class="ck ck-label ck-voice-label" id="ck-editor__label_e29a9d792075ea4342614ef9228178e3e">Rich Text Editor</label><div class="ck ck-editor__top ck-reset_all" role="presentation"><div class="ck ck-sticky-panel"><div class="ck ck-sticky-panel__placeholder" style="display: none;"></div><div class="ck ck-sticky-panel__content"><div class="ck ck-toolbar ck-toolbar_grouping" role="toolbar" aria-label="Editor toolbar" tabindex="-1"><div class="ck ck-toolbar__items"></div><span class="ck ck-toolbar__separator"></span><div class="ck ck-dropdown ck-toolbar__grouped-dropdown ck-toolbar-dropdown"><button class="ck ck-button ck-off ck-dropdown__button" type="button" tabindex="-1" aria-labelledby="ck-editor__aria-label_ec1e256fdefab0c22a603ccff6309a124" data-cke-tooltip-text="Show more items" data-cke-tooltip-position="sw" aria-haspopup="true" aria-expanded="false"><svg class="ck ck-icon ck-reset_all-excluded ck-icon_inherit-color ck-button__icon" viewBox="0 0 20 20"><circle cx="9.5" cy="4.5" r="1.5"></circle><circle cx="9.5" cy="10.5" r="1.5"></circle><circle cx="9.5" cy="16.5" r="1.5"></circle></svg><span class="ck ck-button__label" id="ck-editor__aria-label_ec1e256fdefab0c22a603ccff6309a124">Show more items</span><svg class="ck ck-icon ck-reset_all-excluded ck-icon_inherit-color ck-dropdown__arrow" viewBox="0 0 10 10"><path d="M.941 4.523a.75.75 0 1 1 1.06-1.06l3.006 3.005 3.005-3.005a.75.75 0 1 1 1.06 1.06l-3.549 3.55a.75.75 0 0 1-1.168-.136L.941 4.523z"></path></svg></button><div class="ck ck-reset ck-dropdown__panel ck-dropdown__panel_se" tabindex="-1"></div></div></div></div></div></div><div class="ck ck-editor__main" role="presentation"><div class="ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred" lang="en" dir="ltr" role="textbox" aria-label="Rich Text Editor. Editing area: main. Press ⌥0 for help." contenteditable="true"><p class="ck-placeholder" data-placeholder="Message #general"><br data-cke-filler="true"></p></div></div></div> */}
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
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48">
                </path>
              </svg>
            </button>
            {" "}
          </div>
        </div>
      </form>
      <form
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
      </form>
    </>
  );
};
