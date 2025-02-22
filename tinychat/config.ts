import { ActorView } from "@tinychat/lexicons/types/chat/tinychat/actor/defs.ts";
// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: config.ipynb

export const getNotificationsWsUrl = (params?: {
  appViewUrl?: string | undefined;
  user?: ActorView | undefined;
}) => {
  const { appViewUrl, user } = Object.assign({
    appViewUrl: Deno.env.get("APPVIEW_URL")!,
  }, params);
  const base = `${appViewUrl.replace(/\/$/ig, "")}`.replace("http", "ws");
  return `${base}/ws` + (user ? `?did=${encodeURIComponent(user.did)}` : "");
};
