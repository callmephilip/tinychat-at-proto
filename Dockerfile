FROM denoland/deno:alpine-2.1.4

WORKDIR /app

COPY --link --chown=deno . .

# fix this: cannot get volumes to work correctly
USER root
EXPOSE 8000

CMD ["run", "-A", "appview.ts"]