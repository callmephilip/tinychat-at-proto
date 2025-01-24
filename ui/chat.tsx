import { Page } from "@tinychat/ui/page.tsx";
import { Composer } from "@tinychat/ui/composer.tsx";
import { Channel } from "@tinychat/ui/channel.tsx";
import { useAuth } from "./context/auth.tsx";
import { useServer } from "./context/server.tsx";
import { urlForChannelMessageList } from "tinychat/utils.ts";

export const Chat = () => {
  const { user } = useAuth();
  const { server, currentChannel } = useServer();
  const main = (
    <div
      id="main"
      class="flex-1 flex flex-col bg-white overflow-hidden md:border-l"
      data-current-channel={currentChannel?.id}
      data-current-server={server?.uri}
    >
      {
        /* PING <div
          hx-trigger="load, every 5s"
          ws-send="true"
          hx-vals='{"cmd": "ping", "d": {"cid": 1}}'
          class="hidden"
        /> */
      }

      {server?.channels.map((channel) => (
        <>
          <input
            type="radio"
            name="channel-tab"
            id={`tab-${channel.id}`}
            hidden
            checked={currentChannel ? currentChannel.id === channel.id : false}
          />
          <div
            class="flex-1 flex flex-col bg-white overflow-hidden"
            role="tabpanel"
          >
            <div class="border-b flex md:px-6 py-2 items-center flex-none">
              <div class="flex flex-row items-center">
                <h3 class="text-grey-darkest font-extrabold">
                  {`#${channel.name}`}
                </h3>
              </div>
            </div>

            <div
              id={`channel-${channel.id}`}
              class="scroller px-6 py-4 flex-1 flex flex-col-reverse overflow-y-scroll"
            >
              {/* style="padding-top: 60px; padding-bottom: 130px;" if is_mobile else "" */}
              {/* lazy load messages for current channel */}
              {currentChannel?.id === channel.id
                ? (
                  <div
                    hx-trigger="revealed"
                    hx-get={urlForChannelMessageList(channel)}
                    hx-swap="outerHTML"
                  />
                )
                : null}
            </div>
          </div>
        </>
      ))}

      <div class="pb-6 px-4 flex-none">
        {/* style="position: fixed; bottom: 0; width: 100%; background-color: white;" if is_mobile else "" */}
        {user ? <Composer /> : null}
      </div>
    </div>
  );

  const nav = (
    <div id="channels" hx-swap-oob="true">
      <strong>{server?.name}</strong>
      <div class="px-3 py-2">
        <div class=" px-1">
          {(server?.channels || []).map((channel, i) => (
            <Channel
              key={channel.id}
              channel={channel}
              isSelected={currentChannel
                ? currentChannel.id === channel.id
                : i === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Page user={user} hideOverflow htmx>
      {/* Sidebar  */}
      <div class="flex-none md:w-64 block overflow-hidden">
        <div class="space-y-4">
          <div class="px-3 py-2 border-b">
            <h1 class="text-l font-bold">👨‍🏭 tinychat</h1>
          </div>
          {nav}
        </div>
        <div class="px-3 py-8">
          <a
            href="/login"
            type="button"
            class="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Join the conversation
          </a>
        </div>
        <div class="px-3 py-2 border-t">
          {/* hx-get="/stats" hx-trigger="every 2s" */}
          <div class="flex items-center space-x-2">
            <span class="w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full">
            </span>{" "}
            <div class="text-xs text-muted-foreground">
              11 connections, 3460 users, 25648 messages
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
      {main}
    </Page>
  );
};
