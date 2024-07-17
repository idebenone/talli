import { test, expect } from '@playwright/test';

test("user authenticates themselves", async ({ page }) => {
    await page.goto(`${process.env.NEXT_PUBLIC_URL}`);
    await page.getByTestId("google_auth").click();
    await expect(page.getByTestId("profile_picture")).toBeVisible();
})

// test("user logout froom the session", async ({ page }) => {
//     await page.goto("/");
//     await page.getByTestId("profile_picture").click();
//     await page.getByTestId("popover_logout").click();
//     await page.getByTestId("confirm_signout").click();
// })