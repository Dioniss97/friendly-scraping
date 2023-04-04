const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');

async function fotocasa() {

    const driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();

    driver.get("https://www.fotocasa.es/es/alquiler/viviendas/illes-balears-provincia/mallorca/l");

    // Cookies.
    await driver.findElement(By.xpath("//*[@id='App']/div[3]/div/div/div/footer/div/button[2]")).click();

    // Zoom.
    await driver.executeScript('document.body.style.zoom="1%"');

    // Obtenemos las páginas totales.
    let total_pages = await driver.wait(until.elementLocated(By.xpath("/html/body/div[1]/div[1]/div[2]/main/div/div[3]/ul/li[6]/a/span")), 5000).getText();
    

    for (let i = 1; i < total_pages; i++) {

        driver.get("https://www.fotocasa.es/es/alquiler/viviendas/illes-balears-provincia/mallorca/l/" + i);
        // await driver.sleep(6000);
        await driver.executeScript('document.body.style.zoom="1%"');
        await driver.sleep(8000);

        // Obtenemos la section y los  articles de las viviendas.
        let section = await driver.wait(until.elementLocated(By.xpath("//section[@class='re-SearchResult']")), 5000);
        let articles = await section.findElements(By.xpath("./article"));

        console.log("Página: " + i);

        for (let article of articles) {

            // Tienen dos formas de presentarte los datos y hay que tener dos formas de recogerlos (currándoselo un poco se podría reutilizar código para los dos casos):
            try {

                // Declaración de variables
                let title = "";
                let price = [];
                let full_price = "";
                let rooms = "";
                let surface = "";
                let surface_price = "";           
                
                // Por culpa de al menos una casa hay que tener en cuenta el número de lis del ul, de lo contrario podemos llenar
                // las variables con datos que no son correctos.
                info_list = await article.findElements(By.xpath("./div[2]/a[1]/ul[1]/li"));

                switch (info_list.length) {

                    case 1:
                        price = [];
                        full_price = await article.findElement(By.xpath("./div[2]/a[1]/h3[1]/span[2]")).getText();
                        price = full_price.split(" ");
                        console.log(price[0]);
                        rooms = null;
                        surface = await article.findElement(By.xpath("./div[2]/a[1]/ul[1]/li[1]")).getText();
                        surface = surface.split(" ");
                        console.log(surface[0]);
                        break;
                    
                    case 2:
                        price = [];
                        full_price = await article.findElement(By.xpath("./div[2]/a[1]/h3[1]/span[2]")).getText();
                        price = full_price.split(" ");
                        console.log(price[0]);
                        rooms = await article.findElement(By.xpath("./div[2]/a[1]/ul[1]/li[1]")).getText();
                        surface = await article.findElement(By.xpath("./div[2]/a[1]/ul[1]/li[2]")).getText();
                        surface = surface.split(" ");
                        console.log(surface[0]);
                        break;

                    default:
                        title = await article.findElement(By.xpath("./div[2]/a[1]/h3[1]/span[1]")).getText();
                        title = title.replaceAll(",", " -");
                        console.log(title);

                        price = [];
                        full_price = await article.findElement(By.xpath("./div[2]/a[1]/h3[1]/span[2]")).getText();
                        price = full_price.split(" ");
                        console.log(price[0]);

                        rooms = await article.findElement(By.xpath("./div[2]/a[1]/ul[1]/li[1]")).getText();
                        rooms = rooms.split(" ");
                        console.log(rooms[0]);

                        surface = await article.findElement(By.xpath("./div[2]/a[1]/ul[1]/li[3]")).getText();
                        surface = surface.split(" ");
                        console.log(surface[0]);

                        surface_price = parseFloat(price[0]) / parseFloat(surface[0]);

                        // Calculamos el precio del metro cuadrado.
                        extractData = ",Idealista," + title + "," + price[0] + "," + rooms[0] + "," + surface[0] + "," + (surface_price * 1000).toFixed(2) + "\n";
                    
                        fs.appendFile('idealista.csv', extractData, function (err) {
                            if (err) throw err;
                        });
                }
            } catch {

                // Declaración de variables
                let title = "";
                let price = [];
                let full_price = "";
                let rooms = "";
                let surface = "";
                let surface_price = "";             
                
                // Por culpa de al menos una casa hay que tener en cuenta el número de lis del ul, de lo contrario podemos llenar
                // las variables con datos que no son correctos.
                info_list = await article.findElements(By.xpath("./div[1]/a[1]/ul[1]/li"));

                switch (info_list.length) {

                    case 1:
                        price = [];
                        full_price = await article.findElement(By.xpath("./div[1]/a[1]/h3[1]/span[2]")).getText();
                        price = full_price.split(" ");
                        console.log(price[0]);
                        rooms = null;
                        surface = await article.findElement(By.xpath("./div[1]/a[1]/ul[1]/li[1]")).getText();
                        surface = surface.split(" ");
                        console.log(surface[0]);
                        break;
                    
                    case 2:
                        price = [];
                        full_price = await article.findElement(By.xpath("./div[1]/a[1]/h3[1]/span[2]")).getText();
                        price = full_price.split(" ");
                        console.log(price[0]);
                        rooms = await article.findElement(By.xpath("./div[1]/a[1]/ul[1]/li[1]")).getText();
                        surface = await article.findElement(By.xpath("./div[1]/a[1]/ul[1]/li[2]")).getText();
                        surface = surface.split(" ");
                        console.log(surface[0]);
                        break;

                    default:
                        title = await article.findElement(By.xpath("./div[1]/a[1]/h3[1]/span[1]")).getText();
                        title = title.replaceAll(",", " -");
                        console.log(title);

                        price = [];
                        full_price = await article.findElement(By.xpath("./div[1]/a[1]/h3[1]/span[2]")).getText();
                        price = full_price.split(" ");
                        console.log(price[0]);

                        rooms = await article.findElement(By.xpath("./div[1]/a[1]/ul[1]/li[1]")).getText();
                        rooms = rooms.split(" ");
                        console.log(rooms[0]);

                        surface = await article.findElement(By.xpath("./div[1]/a[1]/ul[1]/li[3]")).getText();
                        surface = surface.split(" ");
                        console.log(surface[0]);

                        // Calculamos el precio del metro cuadrado.
                        surface_price = parseFloat(price[0]) / parseFloat(surface[0]);

                        extractData = ",Idealista," + title + "," + price[0] + "," + rooms[0] + "," + surface[0] + "," + (surface_price * 1000).toFixed(2) + "\n";
                    
                        fs.appendFile('idealista.csv', extractData, function (err) {
                            if (err) throw err;
                        });
                }
            }
        }
    }
}

fotocasa();