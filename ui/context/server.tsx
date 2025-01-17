import { createContext, useContext } from "hono/jsx";
import { ServerView } from "tinychat/api/types/chat/tinychat/server/defs.ts";
import { ChannelView } from "tinychat/api/types/chat/tinychat/server/defs.ts";

export interface ServerContext {
  server?: ServerView;
  currentChannel?: ChannelView;
}

export const AppServerContext = createContext<ServerContext>({});

export const useServer = (): ServerContext => {
  return useContext(AppServerContext);
};
