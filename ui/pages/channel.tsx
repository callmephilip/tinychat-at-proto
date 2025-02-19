import { ServerView } from "@tinychat/lexicons/types/chat/tinychat/server/defs.ts";
import { MessageView } from "tinychat/core/base.ts";
import { Message } from "@tinychat/ui/message.tsx";
import { slugify, urlFromServerAtURI } from "tinychat/utils.ts";
import { DigestCard } from "@tinychat/ui/layout/digest-card.tsx";

export const ChannelPage = ({
  server,
  channel,
  messages,
  prevCursor,
  nextCursor,
}: {
  server: ServerView;
  channel: string;
  messages: MessageView[];
  prevCursor?: string | undefined;
  nextCursor?: string | undefined;
}) => {
  console.log(server, channel, messages, prevCursor, nextCursor);
  const currentChannel = server.channels.find((c) => c.id === channel);
  const buildURLWithCursor = (cursor: string) => {
    return (
      [
        urlFromServerAtURI(server.uri, "server"),
        slugify(server.name),
        channel,
      ].join("/") +
      "?cursor=" +
      cursor
    );
  };
  return (
    <DigestCard title={`${server.name} > #${currentChannel?.name}`}>
      <ul>
        {messages.map((message) => (
          <li>
            <Message oob={false} message={message} />
          </li>
        ))}
      </ul>
      <hr />
      <div class="py-4 text-sm">
        {prevCursor
          ? (
            <a
              class="font-bold underline"
              href={buildURLWithCursor(prevCursor)}
            >
              previous{" | "}
            </a>
          )
          : null}
        {nextCursor
          ? (
            <a
              class="font-bold underline"
              href={buildURLWithCursor(nextCursor)}
            >
              next
            </a>
          )
          : null}
      </div>
    </DigestCard>
  );
};
