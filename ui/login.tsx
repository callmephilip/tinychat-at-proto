import { Page } from "@tinychat/ui/page.tsx";
export const LoginForm = () => (
  <Page hideOverflow>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4 flex-1">
      <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Login</h2>

        <form
          class="space-y-4"
          method="post"
          data-testid="login-form"
          action="/login"
        >
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Bluesky Handle
            </label>
            <input
              data-testid="login-handle"
              name="handle"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="bob.bsky.social"
              required
            />
          </div>
          <button class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
            Let's go
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <br />
          <a
            href="https://bsky.app/"
            class="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Join Bluesky
          </a>
        </div>
      </div>
    </div>
  </Page>
);
