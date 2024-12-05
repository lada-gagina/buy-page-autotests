import {test, expect} from '@playwright/test';

test.beforeEach(async ({context}) => {
    const cookieConsent = {
        name: 'jb_cookies_consent_closed', value: 'true', url: 'https://.jetbrains.com/',
    }
    await context.addCookies([cookieConsent])
})

let product = [{
    address: 'idea', name: 'IntelliJ IDEA', price_yearly: '€599.00', price_monthly: '€59.90', product_card_id: 'IntelliJ-IDEA-Ultimate'
}, {
    address: 'pycharm', name: 'PyCharm', price_yearly: '€249.00', price_monthly: '€24.90', product_card_id: 'PyCharm-Professional'
}] // todo lada add more products

product.forEach((product) => {
    test(`title starts with Buy ${product.name}`, async ({page}) => {
        await page.goto(`https://www.jetbrains.com/${product.address}/buy/`);

        await expect(page).toHaveTitle(new RegExp(`Buy ${product.name}*`));
    })

    test(`${product.name} page has \'Subscription Options and Pricing\' heading`, async ({page}) => {
        await page.goto(`https://www.jetbrains.com/${product.address}/buy/`);

        await expect(page.getByRole('heading', {name: 'Subscription Options and Pricing'})).toBeVisible();
    })

    test(`${product.name} page has 'Buy' buttons`, async ({page}) => {
        await page.goto(`https://www.jetbrains.com/${product.address}/buy/`);

        const buyButtons = await page.getByRole('link', {name: 'Buy'}).all();
        expect(buyButtons).toHaveLength(2);
        for (const buyButton of buyButtons) {
            await buyButton.click();
            await page.goForward();
            await expect(page).toHaveTitle('JetBrains eStore');
            await page.goBack();
        }
    })

    test(`${product.name} page has a billing switcher`, async ({page}) => {
        await page.goto(`https://www.jetbrains.com/${product.address}/buy/`);

        await page.getByRole('button', {name: 'Yearly billing'}).click()
        await expect(page.getByTestId('product-price').first()).toHaveText(product.price_yearly);

        await page.getByRole('button', {name: 'Monthly billing'}).click();
        await expect(page.getByTestId('product-price').first()).toHaveText(product.price_monthly);
    })

    test(`${product.name} page has 'Get quote' links`, async ({page}) => {
        await page.goto(`https://www.jetbrains.com/${product.address}/buy/`);

        const getQuoteLinks = await page.getByRole('link', {name: 'Get quote'}).all();
        expect(getQuoteLinks).toHaveLength(2);
        for (const link of getQuoteLinks) {
            await link.click();
            await page.goForward();//todo
            await expect(page).toHaveTitle('JetBrains eStore');
            await page.goBack();
        }
    })

    test(`${product.name} page has a 'Learn more' link`, async ({page}) => {
        await page.goto(`https://www.jetbrains.com/${product.address}/buy/`);

        const learnMore = await page.getByTestId("product-card-All-Products-Pack")
            .getByRole("link", {name: "Learn more"}).all()
        expect(learnMore).toHaveLength(1);
        await learnMore[0].click();
        await expect(page.getByRole('heading', {name: "All Products Pack", exact: true})).toBeVisible();
        await page.goBack();
    })

    test(`${product.name} page has a subscription category switcher`, async ({page}) => {
        await page.goto(`https://www.jetbrains.com/${product.address}/buy/`);

        await page.getByRole('button', {name: 'For Organizations'}).click();
        const productCardsOrg = await page.getByTestId(`product-card-${product.product_card_id}`).all();

        let orgPrice
        for (const productCard of productCardsOrg) {
            if (await productCard.isVisible()) {
                orgPrice = await productCard.getByTestId("product-price").textContent();
            }
        }
        let indPrice
        await page.getByRole('button', {name: 'For Individual Use'}).click();
        await page.waitForTimeout(200)
        const productCardsInd = await page.getByTestId(`product-card-${product.product_card_id}`).all();
        for (const productCard of productCardsInd) {
            console.log(await productCard.isVisible())
            if (await productCard.isVisible()) {
                indPrice = await productCard.getByTestId("product-price").textContent();
                console.log(await productCard.getByTestId("product-price").textContent())
            }
        }
        expect(orgPrice).not.toEqual(indPrice);
    })
})


