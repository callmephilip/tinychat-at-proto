export const message = (message: string) => (
  <div id="messages" hx-swap-oob="beforeend">
    {message}
  </div>
);
