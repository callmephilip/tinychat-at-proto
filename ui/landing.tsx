import { Page } from "@tinychat/ui/page.tsx";

export const landing = () => (
  <Page>
    <div className="container relative flex-col h-full items-center justify-center md:grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="absolute left-4 top-4 z-20 flex items-center text-lg font-medium">
        <a href="/">👨‍🏭 tinychat</a>
        {" "}
      </div>
      <div className="mx-auto my-24 flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome to tinychat
            </h1>
            <p>Chat so small it fits in 1 python file</p>
            <p className="text-sm text-muted-foreground">
              Try it, fork it, make it yours.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <a
              href="/login"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                height="24"
                width="24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="mr-2 h-4 w-4"
              >
                <polygon points="6 3 20 12 6 21 6 3"></polygon>
              </svg>
              Try it
            </a>
            <a
              href="https://github.com/callmephilip/tinychat"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                height="24"
                width="24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4">
                </path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
              Github
            </a>
            {" "}
          </div>
        </div>
      </div>
      <img
        src="/static/desktop.png"
        className="hidden md:block w-[80%] mx-auto shadow-xl bg-slate-800"
      />
      <img
        src="/static/mobile.png"
        className="md:hidden mx-auto shadow-xl bg-slate-800"
      />{" "}
      <div className="pt-8 md:pt-16"></div>
    </div>
  </Page>
);
