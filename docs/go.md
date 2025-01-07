---
outline: deep
---

# Idea

![plan](plan.png)
> [source: excalidraw](https://excalidraw.com/#json=Attle1yXmypzM1RGWJ9Mo,Hd83DD1mNX85E7kjIGDE_w)


Build a public group chat app running on @proto. 

Inspiration/building blocks:

- https://github.com/mary-ext/atcute
- https://github.com/psky-atp/client
- https://github.com/psky-atp/appview
- https://github.com/nperez0111/bookhive
- https://github.com/bluesky-social/ozone/
- https://github.com/bluesky-social/atproto/tree/main/lexicons/chat/bsky

What do i need to build:

- Lexicons
- Client app (Deno + Hono on deno deploy):
  - oauth, read/write records
- App view (Deno inside docker on DO):
  - firehouse listener pulling messages and storing them
  - websockets for connected client apps

How messages are sent:

https://github.com/psky-atp/client/blob/3e2e4564f8ad7f8a894fe53db7bf6c6747a6287c/src/components/PostComposer.tsx#L109C5-L124C41


Questions

- can appview websocket deliver html?
- identity piece
  - /image-profile?fasdf
  - /author-identity?adfasdf


  