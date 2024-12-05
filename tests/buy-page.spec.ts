import {test, expect} from '@playwright/test';

test.beforeEach(async ({context}) => {
    const cookieConsent = {
        name: 'jb_cookies_consent_closed', value: 'true', url: 'https://.jetbrains.com/',
    }
    await context.addCookies([cookieConsent])
})

let product = [{
    address: 'idea',
    name: 'IntelliJ IDEA',
    price_yearly: '€599.00',
    price_monthly: '€59.90',
    product_card_id: 'IntelliJ-IDEA-Ultimate'
}, {
    address: 'pycharm',
    name: 'PyCharm',
    price_yearly: '€249.00',
    price_monthly: '€24.90',
    product_card_id: 'PyCharm-Professional'
}, {
    address: 'clion',
    name: 'CLion',
    price_yearly: '€229.00',
    price_monthly: '€22.90',
    product_card_id: 'CLion'
}, {
    address: 'rider',
    name: 'Rider',
    price_yearly: '€149.00',
    price_monthly: '€14.90',
    product_card_id: 'Rider-Commercial'
}, {
    address: 'datagrip',
    name: 'DataGrip',
    price_yearly: '€229.00',
    price_monthly: '€22.90',
    product_card_id: 'DataGrip'
}, {
    address: 'goland',
    name: 'GoLand',
    price_yearly: '€249.00',
    price_monthly: '€24.90',
    product_card_id: 'GoLand'
}, {
    address: 'webstorm',
    name: 'WebStorm',
    price_yearly: '€69.00',
    price_monthly: '€6.90',
    product_card_id: 'WebStorm-Commercial'
}, {
    address: 'phpstorm',
    name: 'PhpStorm',
    price_yearly: '€249.00',
    price_monthly: '€24.90',
    product_card_id: 'PhpStorm'
}, {
    address: 'aqua',
    name: 'Aqua',
    price_yearly: '€249.00',
    price_monthly: '€24.90',
    product_card_id: 'Aqua'
}, /*{
    address: 'rubymine', // RubyMine's buy page differs significantly
    name: 'RubyMine',
    price_yearly: '',
    price_monthly: '',
    product_card_id: 'RubyMine'
},*/ {
    address: 'rust',
    name: 'RustRover',
    price_yearly: '€69.00',
    price_monthly: '€6.90',
    product_card_id: 'RustRover'
}, {
    address: 'dataspell',
    name: 'DataSpell',
    price_yearly: '€229.00',
    price_monthly: '€22.90',
    product_card_id: 'DataSpell'
},]

product.forEach((product) => {
    test(`title starts with Buy ${product.name}`, async ({page}) => {
        await page.goto(`https://www.jetbrains.com/${product.address}/buy/`);

        await expect(page).toHaveTitle(new RegExp(`Buy ${product.name}*`));
    })

    test(`${product.name} page has \'Subscription Options and Pricing\' heading`, async ({page}) => {
        await page.goto(`https://www.jetbrains.com/${product.address}/buy/`);

        await expect(page.getByRole('heading', {name: 'Subscription Options and Pricing'})
            .or(page.getByRole('heading', {name: 'Subscription Plans'}))).toBeVisible();
    })

    test(`${product.name} page has 'Buy' buttons`, async ({page}) => {
        await page.goto(`https://www.jetbrains.com/${product.address}/buy/`);

        const buyButtons = await page.getByRole('link', {name: 'Buy'}).all();
        for (const buyButton of buyButtons) {
            await buyButton.click();
            await expect(page).toHaveTitle('JetBrains eStore');
            await page.goBack();
        }
    })

    test(`${product.name} page has a billing switcher`, async ({page}) => {
        await page.goto(`https://www.jetbrains.com/${product.address}/buy/`);

        await page.getByRole('button', {name: 'Yearly billing'}).click()
        await expect(page.getByTestId(`product-card-${product.product_card_id}`).getByTestId('product-price').first()).toHaveText(product.price_yearly);

        await page.getByRole('button', {name: 'Monthly billing'}).click();
        await expect(page.getByTestId(`product-card-${product.product_card_id}`).getByTestId('product-price').first()).toHaveText(product.price_monthly);
    })

    test(`${product.name} page has 'Get quote' links`, async ({page}) => {
        await page.goto(`https://www.jetbrains.com/${product.address}/buy/`);

        const getQuoteLinks = await page.getByRole('link', {name: 'Get quote'}).all();
        for (const link of getQuoteLinks) {
            await link.click();
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

        await page.getByRole('button', {name: 'For Organizations', exact: true})
            .or(page.getByRole('button', {name: 'Organizations', exact: true})).first().click();
        const productCardsOrg = await page.getByTestId(`product-card-${product.product_card_id}`).all();

        let orgPrice
        for (const productCard of productCardsOrg) {
            if (await productCard.isVisible()) {
                orgPrice = await productCard.getByTestId("product-price").textContent();
            }
        }
        let indPrice
        await page.getByRole('button', {name: 'For Individual Use'})
            .or(page.getByRole('button', {name: 'Individuals'})).first().click();
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


