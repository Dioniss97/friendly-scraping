const { Builder, By, until } = require('selenium-webdriver');

async function cookie() {

    let driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();

    await driver.get('https://orteil.dashnet.org/cookieclicker/');

    await driver.wait(until.elementLocated(By.xpath("//*[@id='langSelect-EN']")), 5000).click();

    await driver.sleep(5000);

    for (let i = 0; i < 1000000; i++) {

        await driver.wait(until.elementLocated(By.xpath("//*[@id='bigCookie']")), 5000).click();

    }
}

cookie();