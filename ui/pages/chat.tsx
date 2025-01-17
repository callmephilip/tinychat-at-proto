import { AppAuthContext, AuthContext } from "@tinychat/ui/context/auth.tsx";
import { Chat } from "@tinychat/ui/chat.tsx";

export const ChatPage = (c: AuthContext) => {
  return (
    <AppAuthContext.Provider value={c}>
      <Chat />
    </AppAuthContext.Provider>
  );
};
