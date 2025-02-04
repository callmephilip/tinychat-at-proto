import { test, expect, Page } from "playwright/test";
import { settings } from "./settings.ts";
import { user1Login, user2Login } from "./helpers.ts";

test("login flow: agent 1", async ({ page }) => {
  await page.goto(settings.baseUrl + "/login");

  await user1Login({
    page,
  });

  await page.waitForURL("**/chat/**");
  expect(page.locator("#main")).toContainText("#general");
});

test("login flow: agent 2", async ({ page }) => {
  await page.goto(settings.baseUrl + "/login");

  await user2Login({
    page,
  });

  await page.waitForURL("**/chat/**");

  expect(page.locator("#main")).toContainText("#general");
});
