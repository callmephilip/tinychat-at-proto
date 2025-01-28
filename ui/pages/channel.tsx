import { Page } from "@tinychat/ui/page.tsx";
import { ServerView } from "tinychat/api/types/chat/tinychat/server/defs.ts";
import { MessageView } from "tinychat/api/types/chat/tinychat/server/defs.ts";
import { Message } from "@tinychat/ui/message.tsx";

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
  return (
    <Page flex={false}>
      <h1>
        {server.name} // {currentChannel?.name}
      </h1>
      <p>by {server.creator}</p>

      <ul>
        {messages.map((message) => (
          <li>
            <Message oob={false} message={message} />
          </li>
        ))}
      </ul>
    </Page>
  );
};
