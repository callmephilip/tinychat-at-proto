import { ChannelView } from "tinychat/api/types/chat/tinychat/server/defs.ts";
import { urlForChannelMessageList } from "tinychat/utils.ts";

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
export const Channel = ({
  channel,
  isSelected,
}: {
  channel: ChannelView;
  isSelected?: boolean | undefined;
}) => {
  return (
    <div
      id={`nav-channel-${channel.id}`}
      hx-trigger="click once"
      hx-target={`#channel-${channel.id}`}
      hx-get={urlForChannelMessageList(channel)}
      class={(hasUnreadMessages(channel) ? "font-bold" : "font-medium") +
        (isSelected ? " bg-red-100" : "") +
        " cursor-pointer w-full justify-start inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 rounded-md px-3 bg-primary text-primary-foreground hover:bg-primary/90"}
      style="justify-content: flex-start !important;"
      role="button"
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
      <label class="w-full" for={`tab-${channel.id}`}>
        {channel.name}
      </label>
    </div>
  );
};
