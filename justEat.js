const { Builder, By, until } = require('selenium-webdriver');
// const fs = require('fs');

async function example() {

    let driver = await new Builder().forBrowser('chrome').build();
    driver.manage().window().maximize();

    await driver.get('https://www.just-eat.es/area/07014-palma');

    // Capturamos y clicamos sobre el botón de cookies.

    let cookies = driver.findElement(By.xpath("/html/body/main/div[5]/div[4]/div/div/div/div/div/div/div[2]/button[1]"));

    if (cookies != undefined) {
        cookies.click();
    }

    // Hacemos scroll.

    let window = driver.findElement(By.xpath("/html"));
    for (let i = 0; i < 34; i++) {driver.actions().scroll(0, 0, 0, 50000, window).perform();}

    // Sacamos las URL de los 'href' de los restaurantes.

    let restaurant_links = await driver.findElements(By.xpath("//a[@data-test-id='restaurant']"));
    let restaurants_hrefs = [];

    for ( let restaurant_link of restaurant_links ) {
        restaurants_hrefs.push(await restaurant_link.getAttribute('href'));
    }

    // Abrimos cada enlace para ir a buscar los datos.

    for ( let restaurant_href of restaurants_hrefs ) {

        await driver.get(restaurant_href);

        let restaurant_name = await driver.findElement(By.xpath("//h1[@data-js-test='restaurant-heading']")).getText();
        console.log("Nombre del restaurante: " + restaurant_name);

        // 4 situaciones: 1 Envio gratuito con pedido minimo, 2 si hay reparto de pago, 3 hay reparto de pago con pedido minimo o 4 no hacen reparto.

        try {

            let delivery_fee = await driver.wait(until.elementLocated(By.xpath("//div[@data-test-id='restaurant-header-delivery-fees']/p[@class='c-orderStatus-left c-orderStatus-left--short']/span[1]")), 10000).getText();
            let delivery_price = delivery_fee.replace("€", "");
            delivery_price = delivery_fee.replace(",", ".");
            let delivery_prices = delivery_fee.split("-");

            if (delivery_fee.includes("gratuito")) {

                console.log("Envío: " + delivery_price);

                let product_names = [];
                // let product_prices = [];

                await driver.findElements(By.xpath("//div[@data-js-test='menu-item']")).then( products => {

                    Promise.all(products.map(product => {

                        console.log(product.getText());

                    }));

                    // for (let product of products) {
                    //     // product_names.push(product.findElement(By.xpath(".//header[1]/h3[1]")).getText());
                    // }
                });

                console.log("Platos: " + "\n");

                for (let product_name of product_names) {
                    console.log(product_name + "\n");
                }

                // for (let product_price of product_prices) {
                //     // product_price.replace("€", "").replace(",", ".");
                //     console.log((product_price.getText())
                //         // .replace("€", "")
                //         // .replace(",", ".")
                //     )
                // }

            } else if (delivery_prices.length > 1) {

                console.log("Envío por debajo de 16: " + delivery_prices[1].replace("€", "").replace(",", "."));
                console.log("Envío por encima de 16: " + delivery_prices[0].replace(",", "."));

                let product_names = [];
                // let product_prices = [];

                await driver.findElements(By.xpath("//div[@data-js-test='menu-item']")).then( products => {

                    Promise.all(products.map(product => {

                        console.log(product);

                    }));

                    // for (let product of products) {
                    //     // product_names.push(product.findElement(By.xpath(".//header[1]/h3[1]")).getText());
                    // }
                });

                console.log("Platos: " + "\n");

                for (let product_name of product_names) {
                    console.log(product_name + "\n");
                }

                // for (let product_price of product_prices) {
                //     // product_price.replace("€", "").replace(",", ".");
                //     console.log((product_price.getText())
                //         // .replace("€", "")
                //         // .replace(",", ".")
                //     )
                // }

            } else {

                delivery_price = delivery_fee.replace("€", "").replace(",", ".");
                console.log("Envío: " + delivery_price);

                let product_names = [];
                // let product_prices = [];

                await driver.findElements(By.xpath("//div[@data-js-test='menu-item']")).then( products => {

                    Promise.all(products.map(product => {

                        console.log(product);

                    }));

                    // for (let product of products) {
                    //     // product_names.push(product.findElement(By.xpath(".//header[1]/h3[1]")).getText());
                    // }
                });

            

                console.log("Platos: " + "\n");

                for (let product_name of product_names) {
                    console.log(product_name + "\n");
                }

                // for (let product_price of product_prices) {
                //     // product_price.replace("€", "").replace(",", ".");
                //     console.log((product_price.getText())
                //         // .replace("€", "")
                //         // .replace(",", ".")
                //     )
                // }

            }

        } catch (error) {

            console.log("Envío: Sin reparto");

            let product_names = [];
            // let product_prices = [];
    
            await driver.findElements(By.xpath("//div[@data-js-test='menu-item']")).then( products => {
    
                Promise.all(products.map(product => {
    
                    console.log(product);
    
                }));

                // for (let product of products) {
                //     // product_names.push(product.findElement(By.xpath(".//header[1]/h3[1]")).getText());
                // }
            });

            console.log("Platos: " + "\n");

            for (let product_name of product_names) {
                console.log(product_name + "\n");
            }

            // for (let product_price of product_prices) {
            //     // product_price.replace("€", "").replace(",", ".");
            //     console.log((product_price.getText())
            //         // .replace("€", "")
            //         // .replace(",", ".")
            //     )
            // }
            console.log(error.message)

        }
    }
}

example();