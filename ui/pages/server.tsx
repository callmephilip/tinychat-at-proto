import { ServerView } from "@tinychat/lexicons/types/chat/tinychat/server/defs.ts";
import { slugify, urlFromServerAtURI } from "tinychat/utils.ts";
import { DigestCard } from "@tinychat/ui/layout/digest-card.tsx";

export const ServerPage = ({ server }: { server: ServerView }) => {
  const baseURIForChannel = urlFromServerAtURI(server.uri, `server`) + "/" +
    slugify(server.name);
  return (
    <DigestCard
      title={server.name}
      subtitle={`admin: @${server.creator.handle}`}
    >
      <ul>
        {server.channels.map((channel) => (
          <li key={server.id}>
            <a
              class="font-bold underline"
              href={`${baseURIForChannel}/${channel.id}`}
            >
              #{channel.name}
            </a>
          </li>
        ))}
      </ul>
    </DigestCard>
  );
};
