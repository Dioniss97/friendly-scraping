const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');

// Código para recorrer galerías paginadas y obtener sus datos.

async function example() {

    const driver = await new Builder().forBrowser('chrome').build();

    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();

    await driver.get('https://glovoapp.com/es/es/palma/restaurantes_1&#39');

    // Contamos las páginas para saber las iteraciones que tiene que tener el primer bucle.
    let pages = await driver.findElement(By.className('current-page-text')).getText()
    pages = pages.split(' ')[2];

    for (let i = 1; i <= pages; i++) {

        await driver.get('https://glovoapp.com/es/es/palma/restaurantes_1/?page=&#39; + i');
       
        let restaurants_links = await driver.findElements(By.xpath("//div[@class='store-cards-wrapper hidden-when-search']//a[@class='collection-item hover-effect full-width--mobile']"));
        let restaurants_hrefs = [];
        
        // Capturamos el atributo href de las anclas de los restaurantes.
        for ( let restaurant_link of restaurants_links ) {
            restaurants_hrefs.push(await restaurant_link.getAttribute('href'));
        }

        for( let restaurant_href of restaurants_hrefs ) {

            // Entramos en todos los links de los restaurantes que hemos obtenido.
            await driver.get(restaurant_href);
            
            // Obtenemos los datos del restaurante.
            let restaurantName = await driver.findElement(By.xpath("//span[@data-e2e-id='breadcrumbs-store']")).getText();
            let minimumPayment = "";
            let minimumPaymentFee = "";

            let serviceFee = await driver.findElement(By.xpath(".//div[@data-test-id='service-fee-label']")).getText();

            // Cogemos solo el número del precio, sin el simbolo de euro y cambiamos las comas por puntos para no desgraciar el csv que montemos.
            serviceFee = serviceFee.split(" ")[0].replace(",", ".");

            try {
                minimumPayment = await driver.wait(until.elementLocated(By.xpath("//span[@data-test-id='surcharge-button']//span//b[1]")), 10000).getText();
                minimumPayment = minimumPayment.split(" ")[0].replace(",", ".");
               
                minimumPaymentFee = await driver.findElement(By.xpath("//span[@data-test-id='surcharge-button']//span//b[2]")).getText();
                minimumPaymentFee = minimumPaymentFee.split(" ")[0].replace(",", ".");
            } catch {
                minimumPayment = "";
                minimumPaymentFee = "";
            }
           
            let categoriesLinks = await driver.findElements(By.xpath("//div[@class='image-preview-card']//a[@class='card__link']"));

            if(categoriesLinks.length > 0) {

                let categoriesHrefs = [];
           
                for ( let categoryLink of categoriesLinks ) {
                    categoriesHrefs.push(await categoryLink.getAttribute('href'));
                }
           
                for( let category_href of categoriesHrefs ) {
           
                    await driver.get(category_href);
                   
                    let dishElements = await driver.findElements(By.xpath("//div[@type='PRODUCT_ROW']"));
               
                    for(let dishElement of dishElements) {
               
                        let dishName = await dishElement.findElement(By.xpath(".//div[@class='product-row__name']/span/span")).getText();
                        let dishprice = await dishElement.findElement(By.xpath(".//span[@class='product-price__effective product-price__effective--new-card']")).getText();
                        dishprice = dishprice.split(" ")[0].replace(",", ".");
                       
                        let extractData = ",Glovo," + restaurantName + "," + serviceFee + "," + minimumPayment + "," + minimumPaymentFee + "," + dishName + "," + dishprice + "," + date + "\n";
               
                        fs.appendFile('glovo.csv', extractData, function (err) {
                            if (err) throw err;
                        });
                    }
                }

            } else {
               
                let dishElements = await driver.findElements(By.xpath("//div[@type='PRODUCT_ROW']"));
               
                for(let dishElement of dishElements) {
           
                    let dishName = await dishElement.findElement(By.xpath(".//div[@class='product-row__name']/span/span")).getText();
                    let dishprice = await dishElement.findElement(By.xpath(".//span[@class='product-price__effective product-price__effective--new-card']")).getText();
                    dishprice = dishprice.split(" ")[0].replace(",", ".");
                    
                    // Dejamos una coma al principio para el campo "id".

                    let extractData = ",Glovo," + restaurantName + ","  + serviceFee + "," + minimumPayment + "," + minimumPaymentFee + "," + dishName + "," + dishprice + "," + date + "\n";
           
                    fs.appendFile('glovo.csv', extractData, function (err) {
                        if (err) throw err;
                    });
                }
            }
        }
    }
}

example();