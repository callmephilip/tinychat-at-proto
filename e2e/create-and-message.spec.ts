import { test, expect } from "playwright/test";
import { user1Login, user2Login } from "./helpers.ts";
import { settings } from "./settings.ts";
import { Page } from "@tinychat/ui/page.tsx";

test("test user1 creating chat server and user 2 joining", async ({
  browser,
}) => {
  const user1Ctx = await browser.newContext();
  const user1Page = await user1Ctx.newPage();

  // try creating new server without being logged in
  await user1Page.goto(settings.baseUrl + "/new");
  await user1Page.waitForURL("**/login");
  await user1Login({ page: user1Page });
  await user1Page.goto(settings.baseUrl + "/new");

  await user1Page.getByTestId("server-name").focus();
  await user1Page.keyboard.type("tinychat-dev", { delay: 100 });
  await user1Page.getByTestId("create-server").click();
  await user1Page.waitForURL("**/chat/**");

  expect(user1Page.locator("#main")).toContainText("#general");

  const chatURL = user1Page.url();

  // wait for message seeds to load
  await user1Page.waitForTimeout(4000);

  // count number of elements with class message
  expect(await user1Page.locator(".chat-message").count()).toBeGreaterThan(20);

  const user2Ctx = await browser.newContext();
  const user2Page = await user2Ctx.newPage();

  // head to the chat server
  await user2Page.goto(chatURL);
  await user2Page.waitForSelector(".chat-message");

  // user 2 joins the conversation
  await user2Page.getByTestId("login").click();
  await user2Page.waitForURL("**/login**");
  await user2Login({ page: user2Page });
  await user2Page.waitForURL("**/chat/**");

  // TODO: ideally, person should autojoin the server after login
  // user2 joins server
  await user2Page.getByTestId("join-server").click();

  // wait for the composer to be visible
  user2Page.locator(`[data-testid="composer"]`).waitFor({ state: "visible" });

  // user2 sends a message
  await user2Page.getByTestId("composer").focus();
  await user2Page.keyboard.type("hello from user2", { delay: 100 });
  await user2Page.keyboard.press("Enter");

  expect(user2Page.locator(".chat-message").last()).toContainText(
    "hello from user2"
  );

  // user1 can see message from user2

  expect(user1Page.locator(".chat-message").last()).toContainText(
    "hello from user2"
  );
});
