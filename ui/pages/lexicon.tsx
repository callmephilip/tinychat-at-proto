import { getLocalLexicon } from "tinychat/lexicons.ts";

const typeToIcon: Record<string, string> = {
  object: "iconoir-cube",
  query: "iconoir-search",
  record: "iconoir-database",
  procedure: "iconoir-cloud-upload",
};

export const LexiconPage = ({ name }: { name?: string | undefined }) => {
  const lexicon = getLocalLexicon();
  const lazyLoadData = name
    ? {
      "hx-get": `/lexicon/def?n=${encodeURIComponent(name)}`,
      "hx-trigger": "load",
    }
    : {};
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Tinychat</title>
        <script src="https://cdn.tailwindcss.com" />
        <style href="/static/styles.css" />
        <script src="https://unpkg.com/htmx.org@2.0.4" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/iconoir-icons/iconoir@main/css/iconoir.css"
        />
      </head>
      <body className="font-sans antialiased h-dvh bg-background overflow-hidden">
        <div class="flex border-b border-gray-200">
          {Object.entries(typeToIcon).map(([type, icon]) => (
            <div className="p-4">
              <i class={icon} /> {type}
            </div>
          ))}
        </div>
        <div className="flex h-full pb-14">
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto p-4">
            {lexicon.map(([name, def]) => (
              <div className="mb-4 text-xs">
                <a
                  href="#"
                  hx-get={`/lexicon/def?n=${encodeURIComponent(name)}`}
                  hx-target="#main"
                  hx-push-url
                >
                  <h2 className="font-bold">
                    <i class={typeToIcon[`${def.type}`]} /> {name}
                  </h2>
                  <p class="truncate">{def.description}</p>
                </a>
              </div>
            ))}
          </div>

          {/* Main content */}
          <div
            id="main"
            {...lazyLoadData}
            className="w-2/3 overflow-y-auto p-4"
          >
            {/* Main content */}
          </div>
        </div>
        <script type="module" src={`/static/lexicon.js?${Math.random()}`} />
      </body>
    </html>
  );
};
