interface PageProps {
  hideOverflow?: boolean;
  htmx?: boolean;
  // deno-lint-ignore no-explicit-any
  children: any;
}

export const Page = ({ hideOverflow, htmx, children }: PageProps) => {
  const htmxAttrs = htmx ? { "hx-ext": "ws", "ws-connect": "/ws" } : {};
  const bodyClasses = `font-sans antialiased h-dvh flex bg-background ${
    hideOverflow ? "overflow-hidden" : ""
  }`;
  // overflow-hidden
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
      </head>
      <body {...htmxAttrs} className={bodyClasses}>
        {children}
      </body>
    </html>
  );
};
