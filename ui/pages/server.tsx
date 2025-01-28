import { Page } from "@tinychat/ui/page.tsx";
import { ServerView } from "tinychat/api/types/chat/tinychat/server/defs.ts";
import { slugify, urlFromServerAtURI } from "tinychat/utils.ts";

export const ServerPage = ({ server }: { server: ServerView }) => {
  const baseURIForChannel = urlFromServerAtURI(server.uri, `server`) + "/" +
    slugify(server.name);
  return (
    <Page flex={false}>
      <h1>{server.name}</h1>
      <p>by {server.creator}</p>
      <h2>Channels</h2>
      <ul>
        {server.channels.map((channel) => (
          <li key={server.id}>
            <a href={`${baseURIForChannel}/${channel.id}`}>{channel.name}</a>
          </li>
        ))}
      </ul>
    </Page>
  );
};
