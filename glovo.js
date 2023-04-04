// "until" es un objeto que sirve para esperar que termine de cargarse la página. También se puede usar un timeout pero es mas cutre.

const { Builder, By, WebElement } = require('selenium-webdriver');
//  "fs" es para poder tratar con archivos.
const fs = require('fs');
// const { elementIsNotSelected } = require('selenium-webdriver/lib/until');

// Hay otra manera de hacer esto mucho más facil:
//
//      - Cada restaurante tiene un href del que podemos capturar su enlace.
//      - Y con un bucle que los abra ya tendríamos para conseguir los datos.

async function example() {

    let driver = await new Builder().forBrowser('chrome').build();

    await driver.get('https://glovoapp.com/es/es/palma/restaurantes_1/');

    let pages = await driver.findElement(By.xpath("//*[@id='default-wrapper']/div/div/div/main/div[2]/div[2]/nav/div/span[2]")).getText();
    let splited_pages = pages.split(" ");
    let total_pages = splited_pages[2];
    console.log("Paginas: " + total_pages);

    let restaurants = await driver.findElements(By.xpath("//div[@data-test-id='category-store-list']/div[@data-v-d3da9342]"));
    let total_restaurants = restaurants.length;
    console.log("Restaurantes: " + total_restaurants);

    // Buclesitos:

    //  for (let i = 0; i < total_pages; i++) {

    //     for (let j; j < total_restaurants; j++) {

    //         for (let k; k < total_products; k++) {

    //         }
    //     }
    // }

//      >div[data-v-d3da9342] El contenedor que hay que clicar para ir al producto.

//      console.log("Hola hijos");
//      console.log("Hijos: " + children_amount);

//      await driver.findElement(By.class('store-card_wrapper')).click();

//      Necesito contar cuantos productos hay una pagina para recorrerlos con un bucle.

//      Cuando éste termine -> Se pulsa el botón de siguiente página.

//      Almacenar en una variable el numero de hijos del contenedor de los productos.

//      Hay que capturar el texto que indica el numero de paginas totales para saber las iteraciones que debe hacer el primer bucle.

}

example();