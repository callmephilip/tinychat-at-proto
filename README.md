deno compile --allow-all --output firehose firehose.ts

ngrok http --domain=tinychat.ngrok.app 8000 https://pdsls.dev/

cloudflared tunnel --url http://localhost:8001

here's what subscriptions look like on xrpc
https://github.com/bluesky-social/atproto/blob/d97272de0bef835a8e64e7e924e21e9bb5d012f2/packages/xrpc-server/tests/subscriptions.test.ts#L130

TODO

- look into ID resolver
  https://github.com/nperez0111/bookhive/blob/main/src/bsky/id-resolver.ts

lsof -i tcp:8000 sudo kill -9 <PID>

Run playwright UI:

`npx playwright test --ui`
