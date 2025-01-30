import { PropsWithChildren } from "hono/jsx";
import { Page } from "@tinychat/ui/page.tsx";
import { Logo } from "@tinychat/ui/logo.tsx";

export const DigestCard = ({
  title,
  subtitle,
  children,
}: PropsWithChildren<{ title: string; subtitle?: string | undefined }>) => {
  return (
    <Page flex={false}>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-neutral-50 p-6 md:p-10">
        <div className="flex w-full max-w-md flex-col gap-6">
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium"
          >
            <Logo />
          </a>
          <div class="rounded-xl border bg-white text-card-foreground shadow">
            <div class="flex flex-col space-y-1.5 p-6 text-center">
              <div class="font-semibold tracking-tight text-xl">{title}</div>
              {subtitle
                ? <div class="text-sm text-muted-foreground">{subtitle}</div>
                : null}
            </div>
            <div class="p-6 pt-0">{children}</div>
          </div>
        </div>
      </div>
    </Page>
  );
};
