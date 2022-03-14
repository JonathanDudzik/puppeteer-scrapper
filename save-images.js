// https://flaviocopes.com/puppeteer/
// https://docs.apify.com/tutorials/log-into-a-website-using-puppeteer#find-the-login-form
// https://pptr.dev/
// https://github.com/checkly/puppeteer-examples/tree/master/1.%20basics
// https://markoskon.com/puppeteer-examples/
// http://zero.webappsecurity.com/

// TO REVIEW //
// https://stackoverflow.com/questions/46377955/puppeteer-page-evaluate-queryselectorall-return-empty-objects
// https://blog.logrocket.com/debugging-async-operations-in-node-js/
// https://stackoverflow.com/questions/29285897/what-is-the-difference-between-for-in-and-for-of-statements

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile);

(async () => {
    // launch browser and load up a new page
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    
    // naviagate to URL for asset saving
    await page.goto('https://www.nutritionnc.com/index.htm', {waitUntil: 'networkidle2'});

    const getElements = await page.$$eval('script[src], link[href]', elements => {
        const allElementPaths = []

        for (const element of elements) {
            // SIDE EFFECT are you even using this?
            element.src ? allElementPaths.push(element.src) : allElementPaths.push(element.href)
        }

        return allElementPaths
    });

    // get page files and organize them into local file structure - you may also want to identify local file names
    for (const element of getElements) {
        console.log(element)
        const fileName = element.split('/').pop()
        const viewSource = await page.goto(element);
        const buffer = await viewSource.buffer();
        await writeFileAsync(path.join(__dirname + '/assets', fileName), buffer);
        console.log('The file was saved:', fileName) 
    }

    // naviagate to URL for HTML document modification and saving
    await page.goto('https://www.nutritionnc.com/index.htm', {waitUntil: 'networkidle2'});
    page
        .waitForSelector('a')
        .then(() => console.log('Anchor found!'));

    // you may have to address if the domain is external and if it is coming from an anchor (done with selectors)
    // Does this have to be a const? what are you returning?
    const result = await page.evaluate((param) => {
        console.log("passed in paramaters:", param)

        const nodeList = Array.from(document.querySelectorAll('script[src], link[href]'))
        for (const element of nodeList) {
            console.log("el", element)
            if (element.src) {
                const fileName = element.src.split('/').pop()
                if (element.src.includes(element.src)) {
                    element.src = `/assets/${fileName}`
                }
            } else if (element.href) {
                const fileName = element.href.split('/').pop()
                if (element.href.includes(element.href)) {
                    element.href = `/assets/${fileName}`
                }
            }
        }
        return nodeList;
      }, getElements);

    // await page.$$eval('script[src], link[href]', (elements) => {
    //     // const allElementPaths = []
    //     // //SIDE EFFECT are you even using this?
    //     // element.src ? allElementPaths.push(element.src) : allElementPaths.push(element.href)
        
    //     for (const element of elements) {
    //         const fileName = element.src
    //         console.log(fileName)

    //         // SIDE EFFECT
    //         if (element.src) {
    //             if (element.src.includes(element.src)) {
    //                 element.src = `assets/${element.src}`
    //             }
    //         } else if (element.href) {
    //             if (element.href.includes(element.href)) {
    //                 element.href = `assets/${element.href}`
    //             }
    //         }
    //     }
    // });

    // for (const path of filePaths) {
    //     await page.evaluate(selector => {
    //         return Array.from(document.querySelectorAll(selector))
    //             .forEach(element => {
    //                 if (element.src) {
    //                     element.src = path
    //                 } else if (element.href) {
    //                     element.href = path
    //                 }
    //             })
    //     // return Promise.resolve(Array.from(elements));
    //     }, '[src], [href]')
    // };


    // for (const url of filePaths) {
    //     for (const element of elementsSrcRef) {
    //         console.log(url, element)
    //     }
    //     await page.$$eval('[src], [href]', (elements) => {
    //         return elements.map(element => {
    //             if (element.src) {
    //                 element.src = url
    //             } else if (element.href) {
    //                 element.href = url
    //             } else {
    //                 console.log("unfound element:", element)
    //             }    
    //         })
    //     })
    // }

    // // change file paths in HTML to match local tree
    // const asset = 'main_carousel_1.jpg'
    // await page.$$eval(`[src="${asset}]"`, (elements) => {
    //     let serialLinks = elements.map(element => {
    //         return element.src = `./assets/${asset}`
    //     });
    //     return serialLinks
    // });

    // neutralize anchor tags
    // const links = await page.$$eval('a', (elements) => {
    //     let serialLinks = elements.map(element => {
    //         return element.href = '#'
    //     });
    //     return serialLinks
    // });

    // save the modified HTML
    const markup = await page.content();
    const fileName = "index.html";
    const filePath = path.resolve(__dirname, fileName);
    const writeStream = fs.createWriteStream(filePath);
    writeStream.write(markup);
    
    // close the browser
    // browser.close()
})()



// var scriptsRegex = /.js{1}/;
// var stylesRegex = /.css{1}/;
// var assetsRegex = /.png|.gif|.svg|.jpg/

// if (response.request().resourceType() === 'image') {
//     response.buffer().then(file => {
//         const fileName = url.split('/').pop();
//         const filePath = path.resolve(__dirname + '/images', fileName);
//         const writeStream = fs.createWriteStream(filePath);
//         writeStream.write(file);
//     });
// }

// page.on('response', async response => { // THIS IS EACH RESPONSE!!
        // response.buffer().then(file => {
        //     const fileName = response.url().split('/').pop();
        //     console.log(fileName)
        //     if (+scriptsRegex.test(fileName)) {
        //         const filePath = path.resolve(__dirname + '/scripts', fileName);
        //         const writeStream = fs.createWriteStream(filePath);
        //         writeStream.write(file);
        //     };
        //     if (+stylesRegex.test(fileName)) {
        //         const filePath = path.resolve(__dirname + '/styles', fileName);
        //         const writeStream = fs.createWriteStream(filePath);
        //         writeStream.write(file);
        //     };
        //     if (+assetsRegex.test(fileName)) {
        //         const filePath = path.resolve(__dirname + '/assets', fileName);
        //         const writeStream = fs.createWriteStream(filePath);
        //         writeStream.write(file);
        //     };
        // });
    // })     

    // await page.goto('https://github.com/login', {
    //     waitUntil: 'networkidle0',
    // });

    // await page.waitForSelector('#login', {
    //     visible: true,
    // });

//     const markup = await page.content();
//     await page.setContent(markup);
    
//     var element = await page.evaluate(() => document.getElementsByTagName('div'))
//     var allElements = Array.from(element)
//     console.log(allElements);
    
//     await page.screenshot({path: 'screenshot.png'})

// Example of login:
    // await page.type('#login_field', 'maverick-devs')
    // await page.type('#password', 'repo-access-rocks!')
    // await page.click('[name="commit"]');
    // await page.waitForNavigation();

// await page.setCacheEnabled(false);