const { Builder, By } = require('selenium-webdriver');
const fs = require('fs');

async function example() {

  let driver = await new Builder().forBrowser('chrome').build();

  await driver.get('https://www.icaib.org/guia-judicial-web&#39;');
  await driver.findElement(By.id('cookie_action_close_header')).click();

    for (let i = 59; i < 60; i++) {

        await driver.get('https://www.icaib.org/guia-judicial-web/?ncolegiado='+i);

        let username = "";
        let surname = "";
        let identifyNumber = "";
        let onService = "";
        let startingServiceDate = "";

        try {

            username = await driver.findElement(By.xpath("//tbody/tr[1]/td[1]")).getText();
            surname = await driver.findElement(By.xpath("//tbody/tr[1]/td[2]")).getText();
            identifyNumber = await driver.findElement(By.xpath("//tbody/tr[1]/td[3]")).getText();
            onService = await driver.findElement(By.xpath("//tbody/tr[1]/td[4]")).getText();
            startingServiceDate = await driver.findElement(By.xpath("//tbody/tr[1]/td[5]")).getText();

            if(onService == "Ejerciente"){
                onService = 1;
            }else{
                onService = 0;
            }

        } catch (error) {
            continue;
        }

        try {

            await driver.findElement(By.xpath("//button[@type='submit']")).click();

            let data = await driver.findElement(By.xpath("//tbody/tr[1]/td[1]")).getText();
            let email = "";
            let telephone = "";
            let mobile = "";
            let address = "";
            let postalCode = "";
            let location = "";

            try{
                email = await driver.findElement(By.xpath("//a[contains(@href,'mailto')]")).getText();
            }catch{
                email = "";
            }

            if(data.indexOf("Teléfono: ") != -1){
                telephone = data.substring(
                data.indexOf("Teléfono: ") + 10,
                data.lastIndexOf("Teléfono: ") + 19
                ).replace(/(\r\n|\n|\r)/gm, "");
            }

            if(data.indexOf("Móvil: ") != -1){
                mobile = data.substring(
                data.indexOf("Móvil: ") + 7,
                data.lastIndexOf("Móvil: ") + 16
                ).replace(/(\r\n|\n|\r)/gm, "");
            }

            if(data.indexOf("Población: ") != -1){

                let locationPostalCode = data.substring(
                data.indexOf("Población: ") + 11,
                data.lastIndexOf("Provincia:")
                );

                postalCode = locationPostalCode.split(" ")[0];
                location = locationPostalCode.split(" ")[1].replace(/(\r\n|\n|\r)/gm, "");
            }

            if(data.indexOf("Dirección: ") != -1){

                address = data.substring(
                data.indexOf("Dirección: ") + 11,
                data.lastIndexOf("Población:")
                ).replaceAll(',','.').replace(/(\r\n|\n|\r)/gm, "");
            }

            let extractData = ","+ username +","+surname+","+identifyNumber+","+onService+","+startingServiceDate+","+email+","+telephone+","+mobile+","+postalCode+","+location+",Illes Balears,"+address+",1\n"

            fs.appendFile('newsletter.csv', extractData, function (err) {
                if (err) throw err;
            });

        } catch (error) {

            let extractData = ","+ username +","+surname+","+identifyNumber+","+onService+","+startingServiceDate+",,,,,,Illes Balears,,1\n"

            fs.appendFile('newsletter.csv', extractData, function (err) {
                if (err) throw err;
            });
           
            continue;
        }
    }
}

example();