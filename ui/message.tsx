import { MessageView } from "tinychat/api/types/chat/tinychat/server/defs.ts";
import { PropsWithChildren } from "hono/jsx";
import { shortIdFromAtUri } from "tinychat/utils.ts";

interface MessageProps {
  message: MessageView;
  oob: boolean;
}

const messageId = (message: MessageView) =>
  `chat-message-${shortIdFromAtUri(message.uri)}`;
const channelId = (message: MessageView) =>
  `channel-${shortIdFromAtUri(message.channel!)}`;

export const LoadMoreMessages = ({
  messages,
  url,
}: {
  messages: MessageView[];
  url: string;
}) => (
  <div
    class="messages-loading htmx-indicator"
    hx-get={url}
    hx-indicator=".messages-loading"
    hx-trigger="intersect once"
    hx-target={`#${channelId(messages[0])}`}
    hx-swap={`beforeend show:#${messageId(messages[messages.length - 1])}:top`}
  />
);

export const Message = ({ message, oob = false }: MessageProps) => {
  const Wrapper = oob
    ? ({ children }: PropsWithChildren) => (
      <div
        id={channelId(message)}
        hx-swap="scroll:bottom"
        hx-swap-oob="afterbegin"
      >
        {children}
      </div>
    )
    : ({ children }: PropsWithChildren) => <>{children}</>;

  const avatar = message.sender.avatar ||
    `https://ui-avatars.com/api/?name=${
      encodeURI(
        message.sender.displayName || message.sender.handle,
      )
    }&background=random&size=256`;
  return (
    <Wrapper>
      <div
        id={messageId(message)}
        class="chat-message flex items-start mb-4 text-sm"
      >
        <img src={avatar} class="w-10 h-10 rounded mr-3" />{" "}
        <div class="flex-1 overflow-hidden">
          <div>
            <span class="font-bold">
              {message.sender.displayName || message.sender.handle}
            </span>
            <span
              x-text={`Intl.DateTimeFormat(navigator.language, { month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false  }).format(new Date('${message.createdAt}'))`}
              class="pl-2 text-grey text-xs"
            >
              {message.createdAt}
            </span>
            {" "}
          </div>
          <div class="leading-relaxed">
            <p>{message.text}</p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
