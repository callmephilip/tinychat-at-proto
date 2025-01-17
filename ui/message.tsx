import { MessageView } from "tinychat/api/types/chat/tinychat/server/defs.ts";
import { PropsWithChildren } from "hono/jsx";

interface MessageProps {
  message: MessageView;
  oob: boolean;
}

export const Message = ({ message, oob = false }: MessageProps) => {
  const Wrapper = oob
    ? ({ children }: PropsWithChildren) => (
      <div id="messages" hx-swap-oob="beforeend">
        {children}
      </div>
    )
    : ({ children }: PropsWithChildren) => <>{children}</>;

  const avatar = message.sender.avatar ||
    `https://ui-avatars.com/api/?name=${
      encodeURI(
        message.sender.displayName,
      )
    }&background=random&size=256`;
  return (
    <Wrapper>
      <div
        id={`chat-message-${message.uri}`}
        class="chat-message flex items-start mb-4 text-sm"
      >
        <img src={avatar} class="w-10 h-10 rounded mr-3" />{" "}
        <div class="flex-1 overflow-hidden">
          <div>
            <span class="font-bold">{message.sender.displayName}</span>
            <span
              x-text="Intl.DateTimeFormat(navigator.language, { month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false  }).format(new Date(1732748660151))"
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
