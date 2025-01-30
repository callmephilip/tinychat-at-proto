import { PropsWithChildren } from "hono/jsx";
import { getNotificationsWsUrl } from "tinychat/config.ts";
import { ActorView } from "tinychat/api/types/chat/tinychat/actor/defs.ts";

type PageProps = PropsWithChildren<{
  hideOverflow?: boolean;
  htmx?: boolean;
  user?: ActorView | undefined;
  flex?: boolean;
  tcScripts?: boolean;
}>;

export const Page = ({
  hideOverflow,
  htmx,
  user,
  flex = true,
  tcScripts = false,
  children,
}: PageProps) => {
  const htmxAttrs = htmx
    ? {
      "hx-ext": "ws",
      "ws-connect": getNotificationsWsUrl({ user }),
    }
    : {};
  const bodyClasses = `font-sans antialiased h-dvh bg-background ${
    hideOverflow ? "overflow-hidden" : ""
  } ${flex ? "flex" : ""}`;
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Tinychat</title>
        <script src="https://cdn.tailwindcss.com" />
        <style href="/static/styles.css" />
        <script src="https://unpkg.com/htmx.org@2.0.4" />
        <script src="/static/htmx-ws.js" />
        <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
             /* when loading messages, show a loading indicator */
            .messages-loading.htmx-request {
              padding: 10px;
              background-image: url("https://htmx.org/img/bars.svg");
              background-repeat: no-repeat;
              background-position: center;
            }

            /* style links in messages */
            .chat-message a {
              text-underline-offset: 4px;
              text-decoration-line: underline;
              font-weight: 500;
            }

            /* home made tabs */ 
            input[name=channel-tab]:checked + div { display: flex; }
            div[role=tabpanel] { display: none; }

            /* channel nav */
            .channel-label.has-new-messages { font-weight: 700;}
          `,
          }}
        />
      </head>
      <body {...htmxAttrs} className={bodyClasses}>
        {children}
        {tcScripts
          ? <script src={`/static/tc.js?${Math.random() * 100000}`} />
          : null}
      </body>
    </html>
  );
};
