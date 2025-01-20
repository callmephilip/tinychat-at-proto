import { ChannelView } from "tinychat/api/types/chat/tinychat/server/defs.ts";
import { shortIdFromAtUri } from "tinychat/utils.ts";

const hasUnreadMessages = (channel: ChannelView): boolean => {
  if (!channel.latestMessageReceivedTime) {
    return false;
  }

  if (!channel.lastMessageReadTime) {
    return true;
  }

  return channel.latestMessageReceivedTime > channel.lastMessageReadTime;
};

// channel as it appears in the sidebar
export const Channel = ({ channel }: { channel: ChannelView }) => {
  return (
    <a
      id={`nav-channel-${shortIdFromAtUri(channel.uri)}`}
      href="#"
      hx-get="/c/1"
      hx-push-url="true"
      hx-target="#main"
      class={
        (hasUnreadMessages(channel) ? "font-bold " : "") +
        "w-full justify-start inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 rounded-md px-3 bg-primary text-primary-foreground hover:bg-primary/90"
      }
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
      <div>{channel.name}</div>
    </a>
  );
};
