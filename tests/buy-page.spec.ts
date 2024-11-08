import {test, expect} from '@playwright/test';

let product = [
    {address: 'idea', name: 'IntelliJ IDEA', price_yearly: '€599.00', price_monthly: '€59.90'},
    {address: 'pycharm', name: 'PyCharm', price_yearly: '€249.00', price_monthly: '€24.90'}
] // todo lada add more products

product.forEach(
    (product) => {
        test(`title starts with Buy ${product.name}`, async ({page}) => {
            await page.goto(`https://www.jetbrains.com/${product.address}/buy/`);

            await expect(page).toHaveTitle(new RegExp(`Buy ${product.name}*`));
        })

        test(`${product.name} page has \'Subscription Options and Pricing\' heading`, async ({page}) => {
            await page.goto(`https://www.jetbrains.com/${product.address}/buy/`);

            await expect(page.getByRole('heading', {name: 'Subscription Options and Pricing'})).toBeVisible();
        })

        test(`${product.name} page has a 'Buy' button`, async ({page}) => {
            await page.goto(`https://www.jetbrains.com/${product.address}/buy/`);

            await page.getByRole('link', {name: 'Buy'}).first().click(); //todo lada how to locate the exact Buy button I need?
            await page.goForward();

            await expect(page).toHaveTitle('JetBrains eStore');
        })

        test(`${product.name} page has a billing switcher`, async ({page}) => {
            await page.goto(`https://www.jetbrains.com/${product.address}/buy/`);

            // await page.getByRole('button', {name: 'Yearly billing'}).click()
            // await page.goForward()
            await expect(page.getByTestId('product-price').first()).toHaveText(product.price_yearly);

            await page.getByRole('button', {name: 'Monthly billing'}).click();
            await page.goForward();
            await expect(page.getByTestId('product-price').first()).toHaveText(product.price_monthly);
        })
    })


