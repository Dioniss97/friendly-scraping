const { Builder, By, until } = require('selenium-webdriver');

async function vera() {

    let driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();

    await driver.get('https://tienda.comercialvera.eu/es/3-carne');

    // Para que se haga click en la página siguiente
    let nextPage = await driver.findElement(By.xpath("//a[@class='next js-search-link']"));

    while (nextPage !== undefined) {

        driver.sleep(2000);

        let products = await driver.findElements(By.xpath("//div[contains(@class, 'ajax_block_product')]"));
        console.log(products.length);

        for (let product of products) {

            let name = await product.findElement(By.xpath(".//h3[1]"));
            console.log(await name.getText());
            
        }
        nextPage.click();
    }
}

vera();