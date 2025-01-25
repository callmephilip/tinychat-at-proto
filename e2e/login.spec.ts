import { test, expect } from "playwright/test";

const settings = {
  baseUrl: process.env["PUBLIC_URL"]!,
  testUserService: process.env["TEST_AGENT_SERVICE"]!,
  testUserIdentifier: process.env["TEST_AGENT_IDENTIFIER"]!,
  testUserPassword: process.env["TEST_AGENT_PASSWORD"]!,
};

test("login flow", async ({ page }) => {
  await page.goto(settings.baseUrl + "/login");

  await page.getByTestId("login-handle").focus();
  await page.keyboard.type(settings.testUserIdentifier);
  await page.keyboard.press("Enter");

  // find input with placeholder "password"
  await page.getByPlaceholder("password").focus();
  await page.keyboard.type(settings.testUserPassword);

  // press next button
  await page.getByRole("button", { name: /next/gi }).click();

  // press accept button
  await page.getByRole("Button", { name: /accept/gi }).click();

  await page.waitForURL("**/chat/**");

  expect(page.locator("#main")).toContainText("#general");
});
