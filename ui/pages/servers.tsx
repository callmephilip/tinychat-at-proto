import { Page } from "@tinychat/ui/page.tsx";
import { ServerSummaryView } from "tinychat/api/types/chat/tinychat/server/defs.ts";
import { slugify, urlFromServerAtURI } from "tinychat/utils.ts";

export const ServersPage = ({ servers }: { servers: ServerSummaryView[] }) => {
  return (
    <Page>
      <h1>Servers</h1>
      <ul>
        {servers.map((server) => (
          <li key={server.id}>
            <a
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
    </Page>
  );
};
