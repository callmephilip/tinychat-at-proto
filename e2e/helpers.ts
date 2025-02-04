import { Page } from "playwright/test";
import { settings } from "./settings.ts";

export const login = async ({
  identifier,
  password,
  page,
}: {
  page: Page;
  identifier: string;
  password: string;
}) => {
  await page.getByTestId("login-handle").focus();
  await page.keyboard.type(identifier, { delay: 100 });
  await page.keyboard.press("Enter");

  // find input with placeholder "password"
  await page.getByRole("textbox", { name: "Password" }).focus();
  await page.keyboard.type(password, { delay: 100 });

  // press next button
  await page.getByRole("button", { name: /next/gi }).click();

  // press accept button
  await page.getByRole("button", { name: /accept/gi }).click();
};

export const user1Login = async ({ page }: { page: Page }) => {
  await login({
    identifier: settings.testUserIdentifier,
    password: settings.testUserPassword,
    page,
  });
};

export const user2Login = async ({ page }: { page: Page }) => {
  await login({
    identifier: settings.testUser2Identifier,
    password: settings.testUser2Password,
    page,
  });
};
