import { AppAuthContext, AuthContext } from "@tinychat/ui/context/auth.tsx";
import {
  AppServerContext,
  ServerContext,
} from "@tinychat/ui/context/server.tsx";
import { Chat } from "@tinychat/ui/chat.tsx";

export const ChatPage = ({
  auth,
  server,
}: {
  auth: AuthContext;
  server: ServerContext;
}) => {
  return (
    <AppAuthContext.Provider value={auth}>
      <AppServerContext.Provider value={server}>
        <Chat />
      </AppServerContext.Provider>
    </AppAuthContext.Provider>
  );
};
