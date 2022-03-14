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

    const localHtmlPath = `file:///${path.join(__dirname, 'index.html')}`
    
    // naviagate to URL for asset saving
    await page.goto(localHtmlPath, {waitUntil: 'networkidle0'});

    await page.evaluate(() => {
        const styles = document.createElement('link');
        styles.type = 'text/css';
        styles.rel = 'stylesheet';
        styles.href = 'file:///Users/jdudzik/Repos/puppeteer-scrapper/styles/styles.css';
        document.head.appendChild(styles);

        const script = document.createElement("script");
        script.type = 'text/javascript';
        script.src = 'file:///Users/jdudzik/Repos/puppeteer-scrapper/editor/editor.js';
        document.head.appendChild(script);
    });
        
    // close the browser
    // browser.close()
})()

// make a function that will do something
// add that function to an element
// make a save button that will save content
