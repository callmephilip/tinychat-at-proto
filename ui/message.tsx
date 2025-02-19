import { MessageView } from "tinychat/core/base.ts";
import { PropsWithChildren } from "hono/jsx";
import { shortIdFromAtUri, urlForMessageThread } from "tinychat/utils.ts";
import { RichText } from "@tinychat/ui/rich-text.tsx";

interface MessageProps {
  message: MessageView;
  oob: boolean;
}

const messageId = (message: MessageView) => `chat-message-${shortIdFromAtUri(message.uri)}`;

export const LoadMoreMessages = ({ messages, url }: { messages: MessageView[]; url: string }) => (
  <div
    class="messages-loading htmx-indicator"
    hx-get={url}
    hx-indicator=".messages-loading"
    hx-trigger="intersect once"
    hx-target={`#${messages[0].record.channel}`}
    hx-swap={`beforeend show:#${messageId(messages[messages.length - 1])}:top`}
  />
);

export const MessageThread = ({ messages }: { messages: MessageView[] }) => {
  // Create a map of parent URIs to child messages
  const threadsMap = messages.reduce((acc, message) => {
    const parentUri = message.record.reply?.parent.uri;
    if (parentUri) {
      if (!acc.has(parentUri)) {
        acc.set(parentUri, []);
      }
      acc.get(parentUri)!.push(message);
    }
    return acc;
  }, new Map<string, MessageView[]>());

  console.log(">>>>>>>>> threadsMap", threadsMap);

  // Recursive component to render thread branches
  const ThreadBranch = ({ message, level = 0 }: { message: MessageView; level?: number }) => {
    const childMessages = threadsMap.get(message.uri) || [];

    return (
      <div class="thread-branch flex" x-data="{ expanded: true }">
        <div class="flex">
          <div class="flex flex-1 flex-col">
            <button class="px-0.5 py-2 mr-2" x-on:click="expanded = ! expanded">
              <span x-show="!expanded">
                <img class="w-4" src="/static/add-square.png" />
              </span>
              <span x-show="expanded">
                <img class="w-4" src="/static/subtract-square.png" />
              </span>
            </button>
            <div class="relative ml-2 flex-1 border-s border-gray-200" />
          </div>
        </div>
        <div class="pt-2" x-show="!expanded">
          <Avatar mini message={message} />
        </div>
        <div x-show="expanded">
          <Message message={message} oob={false} />
          {childMessages.length > 0 && (
            <div class="ml-4">
              {childMessages.map((childMessage) => <ThreadBranch key={childMessage.uri} message={childMessage} level={level + 1} />)}
            </div>
          )}
        </div>
      </div>
    );
  };

  const threadEntries = Object.keys(threadsMap);
  const leaves = Array.from(threadsMap.values())
    .flat()
    .map((m) => m.uri);
  console.log(">>>>>>>>> leaves are", leaves);
  const rootMessages = messages.filter(
    (message) =>
      // @ts-ignore yolo
      threadEntries.indexOf(message.record.reply?.parent.uri) === -1 &&
      // @ts-ignore yolo
      leaves.indexOf(message.record.reply?.parent.uri!) === -1,
  );
  console.log(">>>>>>>>> rootMessages", rootMessages);
  return (
    <div class="thread-view space-y-4">
      {rootMessages.map((message) => <ThreadBranch key={message.uri} message={message} />)}
    </div>
  );
};

const Avatar = ({ message, mini = false }: { message: MessageView; mini?: boolean }) => {
  const avatar = message.author.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURI(message.author.displayName || message.author.handle)}&background=random&size=256`;
  return <img src={avatar} class={`w-${mini ? "4" : "8"} h-${mini ? "4" : "8"} rounded-full mr-3`} />;
};

export const Message = ({ message, oob = false }: MessageProps) => {
  const Wrapper = oob
    ? ({ children }: PropsWithChildren) => (
      <div id={`channel-${message.record.channel}`} hx-swap="scroll:bottom" hx-swap-oob="afterbegin">
        {children}
      </div>
    )
    : ({ children }: PropsWithChildren) => <>{children}</>;

  const threadId = `thread-${shortIdFromAtUri(message.uri)}`;
  return (
    <Wrapper>
      <div id={messageId(message)} class="chat-message flex items-start mb-4 text-sm relative group">
        <Avatar message={message} />{" "}
        <div x-data={`${JSON.stringify(message)}`} class="flex-1 overflow-hidden pt-1">
          <div class="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="flex gap-2 p-2">
              <button x-on:click="$store.replyTo.set($data)" class="text-gray-600 hover:text-gray-900">
                Reply
              </button>
            </div>
          </div>
          <div>
            <span class="font-bold">{message.author.displayName || message.author.handle}</span>{" "}
            <a class="text-sm muted" style={{ "text-decoration": "none" }} href={`https://bsky.app/profile/${message.author.handle}`}>
              @{message.author.handle}
            </a>{" "}
            •{" "}
            <span
              x-text={`Intl.DateTimeFormat(navigator.language, { month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false  }).format(new Date('${message.record.createdAt}'))`}
              class="text-grey text-xs"
            >
              {message.createdAt}
            </span>
            {" "}
          </div>
          <div class="leading-relaxed mt-2">
            <RichText text={message.record.text} facets={message.record.facets} />
            {message.threadSummary
              ? (
                <div class="py-2" id={threadId}>
                  <a href="#" hx-get={urlForMessageThread(message)} hx-target={`#${threadId}`} hx-swap="innerHTML" class="underline font-bold">
                    view {message.threadSummary.size} replies
                  </a>
                </div>
              )
              : null}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
