import { MessageView } from "tinychat/core/base.ts";
import { PropsWithChildren } from "hono/jsx";
import { linkify, shortIdFromAtUri } from "tinychat/utils.ts";

interface MessageProps {
  message: MessageView;
  oob: boolean;
}

const messageId = (message: MessageView) =>
  `chat-message-${shortIdFromAtUri(message.uri)}`;

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
    hx-target={`#${messages[0].record.channel}`}
    hx-swap={`beforeend show:#${messageId(messages[messages.length - 1])}:top`}
  />
);

export const Message = ({ message, oob = false }: MessageProps) => {
  const Wrapper = oob
    ? ({ children }: PropsWithChildren) => (
      <div
        id={message.record.channel}
        hx-swap="scroll:bottom"
        hx-swap-oob="afterbegin"
      >
        {children}
      </div>
    )
    : ({ children }: PropsWithChildren) => <>{children}</>;

  const avatar = message.author.avatar ||
    `https://ui-avatars.com/api/?name=${
      encodeURI(
        message.author.displayName || message.author.handle,
      )
    }&background=random&size=256`;
  return (
    <Wrapper>
      <div
        id={messageId(message)}
        class="chat-message flex items-start mb-4 text-sm"
      >
        <img src={avatar} class="w-8 h-8 rounded-full mr-3" />{" "}
        <div class="flex-1 overflow-hidden pt-1">
          <div>
            <span class="font-bold">
              {message.author.displayName || message.author.handle}
            </span>{" "}
            <a
              class="text-sm muted"
              style={{ "text-decoration": "none" }}
              href={`https://bsky.app/profile/${message.author.handle}`}
            >
              @{message.author.handle}
            </a>{" "}
            •{" "}
            <span
              x-text={`Intl.DateTimeFormat(navigator.language, { month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false  }).format(new Date('${message.createdAt}'))`}
              class="text-grey text-xs"
            >
              {message.createdAt}
            </span>
            {" "}
          </div>
          <div class="leading-relaxed mt-2">
            <p
              dangerouslySetInnerHTML={{
                __html: linkify(message.record.text, "font-bold underline"),
              }}
            />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
