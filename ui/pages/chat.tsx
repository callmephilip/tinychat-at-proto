import { AppAuthContext, AuthContext } from "@tinychat/ui/context/auth.tsx";
import {
  AppServerContext,
  ServerContext,
} from "@tinychat/ui/context/server.tsx";
import { Chat } from "@tinychat/ui/chat.tsx";

export const ChatPage = ({
  auth,
  server,
  noShell,
}: {
  auth: AuthContext;
  server: ServerContext;
  noShell?: boolean;
}) => {
  return (
    <AppAuthContext.Provider value={auth}>
      <AppServerContext.Provider value={server}>
        <Chat noShell={noShell} />
      </AppServerContext.Provider>
    </AppAuthContext.Provider>
  );
};
