import { Page } from "@tinychat/ui/page.tsx";
import { Composer } from "@tinychat/ui/composer.tsx";

interface User {
  name: string;
}

export const Chat = ({ user }: { user?: User | undefined }) => {
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
        <div class="pb-6 px-4 flex-none">{user ? <Composer /> : null}</div>
      </div>
    </Page>
  );
};
