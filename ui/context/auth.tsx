import { createContext, useContext } from "hono/jsx";
import { ActorViewWithDetails } from "@tinychat/lexicons/types/chat/tinychat/actor/defs.ts";

export interface AuthContext {
  user?: ActorViewWithDetails | undefined;
  isMemberOf: (server: string) => boolean;
}

export const AppAuthContext = createContext<AuthContext>({
  isMemberOf: () => false,
});

export const useAuth = (): AuthContext => {
  return useContext(AppAuthContext);
};
