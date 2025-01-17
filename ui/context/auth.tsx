import { createContext, useContext } from "hono/jsx";
import { ActorView } from "tinychat/api/types/chat/tinychat/actor/defs.ts";

export interface AuthContext {
  user?: ActorView | undefined;
}

export const AppAuthContext = createContext<AuthContext>({});

export const useAuth = (): AuthContext => {
  return useContext(AppAuthContext);
};
