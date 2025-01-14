FROM denoland/deno:alpine-2.1.4

WORKDIR /app

COPY . .

USER deno
EXPOSE 8000

CMD ["run", "-A", "appview.ts"]