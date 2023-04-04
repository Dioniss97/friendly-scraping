const { Builder, By, until} = require('selenium-webdriver');
const fs = require('fs');

async function example() {

    const driver = await new Builder().forBrowser('chrome').build();

    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();

    await driver.get('https://www.just-eat.es');
    await driver.wait(until.elementLocated(By.xpath("//button[@data-test-id='accept-all-cookies-button']")), 10000).click();

    let postal_codes = ['07001','07002','07003','07004','07005','07006','07007','07008','07009','07010','07011','07012','07013','07014','07015'];

    for (let postal_code of postal_codes) {

        await driver.get('https://www.just-eat.es/area/'+ postal_code +'-palma');
       
        await driver.wait(until.elementLocated(By.xpath("//a[@data-test-id='restaurant']")), 10000).then( async () => {

            let scrollHeight = await driver.executeScript("return document.body.scrollHeight");

            while (true){

                await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");


                await driver.sleep(2000);

                let newScrollHeight = await driver.executeScript("return document.body.scrollHeight");
               
                if(scrollHeight == newScrollHeight){
                    break;
                }else{
                    scrollHeight = newScrollHeight;
                }
            }
        });

        let restaurantsLinks = await driver.findElements(By.xpath("//a[@data-test-id='restaurant']"));
        let restaurantsHrefs = [];

        for ( let restaurantLink of restaurantsLinks ) {
            restaurantsHrefs.push(await restaurantLink.getAttribute('href'));
        }

        for( let restaurantHref of restaurantsHrefs ) {
           
            await driver.get(restaurantHref);

            await driver.findElements(By.xpath("//h1[@data-test-id='restaurant-heading']")).then( async elements => {
               
                if(elements.length > 0){

                    let restaurantName = await driver.findElement(By.xpath("//h1[@data-test-id='restaurant-heading']")).getText();
                    restaurantName =  restaurantName.replace(",", ".");

                    let serviceFee = "";
                    let minimumPaymentFee = "";
                    let minimumPayment = "";

                    await driver.sleep(5000);

                    await driver.findElements(By.xpath("//button[@data-test-id='restaurant-header-delivery-fees-info-button']")).then( async elements => {
               
                        if(elements.length > 0){
                       
                            await driver.findElement(By.xpath("//button[@data-test-id='restaurant-header-delivery-fees-info-button']")).click();
                           
                            serviceFee = await driver.findElement(By.xpath("//table[@class='c-deliveryFeesInfo-table']//tr[3]")).getAttribute('fee');
                            serviceFee = serviceFee.split(new RegExp(String.fromCharCode(160), "g"))[0].replace(",", ".");
                           
                            minimumPaymentFee = await driver.findElement(By.xpath("//table[@class='c-deliveryFeesInfo-table']//tr[2]")).getAttribute('fee');
                            minimumPaymentFee = minimumPaymentFee.split(new RegExp(String.fromCharCode(160), "g"))[0].replace(",", ".") - serviceFee;
                            minimumPaymentFee = Math.round(minimumPaymentFee * 100) / 100;
                       
                            minimumPayment = await driver.findElement(By.xpath("//table[@class='c-deliveryFeesInfo-table']//tr[2]")).getAttribute('ordervalue');
                            minimumPayment = minimumPayment.split(" ")[2].split(new RegExp(String.fromCharCode(160), "g"))[0].replace(",", ".");
                       
                            await  driver.findElement(By.xpath("//button[@data-test-id='close-modal']")).click();

                        }else{

                            await driver.findElements(By.xpath("//div[@data-test-id='restaurant-header-delivery-fees']//p[1]//span[1]")).then( async elements => {
                               
                                if(elements.length > 0){

                                    serviceFee = await driver.findElement(By.xpath("//div[@data-test-id='restaurant-header-delivery-fees']//p[1]//span[1]")).getText();
                                    serviceFee = serviceFee.split(" ")[0].replace(",", ".")

                                    if(isNaN(Number(serviceFee))){
                                        serviceFee = " ";
                                    }else{
                                        serviceFee = serviceFee.replace(",", ".");
                                    }
                                }
                            });
                       
                            await driver.findElements(By.xpath("//div[@data-test-id='restaurant-header-delivery-fees']//p[2]//span[1]")).then( async elements => {
                               
                                if(elements.length > 0){

                                    minimumPayment =  await driver.findElement(By.xpath("//div[@data-test-id='restaurant-header-delivery-fees']//p[2]//span[1]")).getText();
                                    minimumPayment = minimumPayment.split(" ")[0].replace(",", ".");
                                }
                            });
                        }
                    });
           
                    let dishElements = await driver.findElements(By.xpath("//div[@data-test-id='menu-item']"));
                       
                    for(let dishElement of dishElements) {

                        let dishName = await dishElement.findElement(By.xpath(".//h3[@data-test-id='menu-item-name']")).getText()
                        dishName = dishName.replace(",", ".");

                        let dishprice = await dishElement.findElement(By.xpath(".//p[@data-js-test='menu-item-price']")).getText();
                        dishprice = dishprice.split(" ")[0].replace(",", ".");

                        let extractData = ",JustEat," + restaurantName + ","  + serviceFee + "," + minimumPayment + "," + minimumPaymentFee + "," + dishName + "," + dishprice + "," + date + "\n";

                        fs.appendFile('just-eat.csv', extractData, function (err) {
                            if (err) throw err;
                        });
                    }
                }
            });
        }
    }
}

example();