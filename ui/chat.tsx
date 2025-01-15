import { Page } from "@tinychat/ui/page.tsx";

export const chat = () => {
  return (
    <Page hideOverflow htmx>
      {/* Sidebar  */}
      <div class="flex-none md:w-64 block overflow-hidden">
        <div class="space-y-4">
          <div class="px-3 py-2 border-b">
            <h1 class="text-l font-bold">👨‍🏭 tinychat</h1>
          </div>
          <div id="channels">
            <div class="px-3 py-2">
              <h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">
                Groups
              </h2>
              <div class=" px-1">
                <a
                  href="#"
                  hx-get="/c/1"
                  hx-push-url="true"
                  data-testid="nav-to-channel-1"
                  hx-target="#main"
                  class="w-full justify-start inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 rounded-md px-3 bg-primary text-primary-foreground hover:bg-primary/90"
                  style="justify-content: flex-start !important;"
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
                    class="mr-2 h-4 w-4"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>{" "}
                  <div>general</div>
                </a>
                <a
                  href="#"
                  hx-get="/c/2"
                  hx-push-url="true"
                  data-testid="nav-to-channel-2"
                  hx-target="#main"
                  class="w-full justify-start inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 rounded-md px-3 hover:bg-accent hover:text-accent-foreground has-unread-messages"
                  style="justify-content: flex-start !important;"
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
                    class="mr-2 h-4 w-4"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <strong>random</strong>
                </a>
                {" "}
              </div>
            </div>
          </div>
        </div>
        <div hx-get="/stats" hx-trigger="every 2s" class="px-3 py-2 border-t">
          {" "}
          <div class="flex items-center space-x-2">
            <span class="w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full">
            </span>{" "}
            <div class="text-xs text-muted-foreground">
              1 connections, 3460 users, 25648 messages
            </div>
          </div>
        </div>
      </div>
      {/* Main */}

      <div
        id="main"
        class="flex-1 flex flex-col bg-white overflow-hidden md:border-l"
      >
        <div
          hx-trigger="load, every 5s"
          ws-send="true"
          hx-vals='{"cmd": "ping", "d": {"cid": 1}}'
          class="hidden"
        >
        </div>
        <div class="border-b flex md:px-6 py-2 items-center flex-none">
          <div class="flex flex-row items-center">
            <h3 class="text-grey-darkest font-extrabold">#general</h3>
          </div>
        </div>
        <div
          id="channel-1"
          class="scroller px-6 py-4 flex-1 flex flex-col-reverse overflow-y-scroll"
        >
          <div
            hx-get="/c/messages/1?c=MTczMjc0ODYxMjg4NS1wcmV2"
            hx-indicator=".messages-loading"
            hx-trigger="intersect once"
            hx-swap="beforeend show:#chat-message-25569:top"
            hx-target="#channel-1"
            class="messages-loading htmx-indicator"
          >
          </div>
        </div>
        <div class="pb-6 px-4 flex-none">
          <form
            enctype="multipart/form-data"
            hx-post="/messages/send/1"
            hx-swap="afterbegin"
            hx-target="#channel-1"
            id="f-1"
            class="w-full"
            name="f-1"
          >
            {" "}
            <input
              type="hidden"
              autofocus
              id="msg"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              name="msg"
            />
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
        </div>
      </div>
    </Page>
  );
};
