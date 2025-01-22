export const LoginForm = () => (
  <form method="post" data-testid="login-form" action="/login">
    <input
      data-testid="login-handle"
      value="callmephilip.com"
      name="handle"
      placeholder="your bsky handle"
    />
  </form>
);
