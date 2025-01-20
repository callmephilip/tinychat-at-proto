import { shortIdFromAtUri } from "tinychat/utils.ts";
import { Page } from "@tinychat/ui/page.tsx";
import { Composer } from "@tinychat/ui/composer.tsx";
import { Channel } from "@tinychat/ui/channel.tsx";
import { useAuth } from "./context/auth.tsx";
import { useServer } from "./context/server.tsx";

export const Chat = () => {
  const { user } = useAuth();
  const { server, currentChannel } = useServer();
  console.log(">>>>>>>>> user  inside chat is", user);
  return (
    <Page user={user} hideOverflow htmx>
      {/* Sidebar  */}
      <div class="flex-none md:w-64 block overflow-hidden">
        <div class="space-y-4">
          <div class="px-3 py-2 border-b">
            <h1 class="text-l font-bold">👨‍🏭 tinychat</h1>
          </div>
          <div id="channels">
            <strong>{server?.name}</strong>
            <div class="px-3 py-2">
              <div class=" px-1">
                {(server?.channels || []).map((channel) => (
                  <Channel key={channel.uri} channel={channel} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div class="px-3 py-2 border-t">
          {/* hx-get="/stats" hx-trigger="every 2s" */}
          <div class="flex items-center space-x-2">
            <span class="w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full">
            </span>{" "}
            <div class="text-xs text-muted-foreground">
              1 connections, 3460 users, 25648 messages
            </div>
          </div>
        </div>
        {/* Profile */}
        {user
          ? (
            <button class="flex items-center px-4 mx-4 fixed bottom-6">
              <img src={user.avatar} class="w-10 h-10 mr-3" />
              <div class="text-sm">
                <div class="font-bold">{user.displayName}</div>
                <div class="text-xs font-bold text-green-400">Online</div>
              </div>
            </button>
          )
          : null}
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
            <h3 class="text-grey-darkest font-extrabold">
              {`#${currentChannel?.name}`}
            </h3>
          </div>
        </div>
        <div
          id={`channel-${
            currentChannel?.uri && shortIdFromAtUri(currentChannel.uri)
          }`}
          class="scroller px-6 py-4 flex-1 flex flex-col-reverse overflow-y-scroll"
        >
          {/* style="padding-top: 60px; padding-bottom: 130px;" if is_mobile else "" */}
          {/* Lazy load first batch of messages */}
          <div
            hx-trigger="load"
            hx-get={`/messages/list/${
              encodeURIComponent(
                currentChannel?.uri!,
              )
            }`}
            hx-swap="outerHTML"
          />
        </div>
        <div class="pb-6 px-4 flex-none">
          {
            /* style="position: fixed; bottom: 0; width: 100%; background-color:
          white;" if is_mobile else "" */
          }
          {user ? <Composer /> : null}
        </div>
      </div>
    </Page>
  );
};
