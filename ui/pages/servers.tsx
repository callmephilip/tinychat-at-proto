import { ServerSummaryView } from "@tinychat/lexicons/types/chat/tinychat/server/defs.ts";
import { slugify, urlFromServerAtURI } from "tinychat/utils.ts";

import { DigestCard } from "@tinychat/ui/layout/digest-card.tsx";

export const ServersPage = ({ servers }: { servers: ServerSummaryView[] }) => {
  return (
    <DigestCard
      title="tinychat directory"
      subtitle="Here is a list of tinychat server instances"
    >
      <ul>
        {servers.map((server) => (
          <li key={server.id}>
            <a
              class="underline font-bold"
              href={`${urlFromServerAtURI(server.uri, "server")}/${
                slugify(
                  server.name,
                )
              }`}
            >
              {server.name}
            </a>
          </li>
        ))}
      </ul>
    </DigestCard>
  );
};
