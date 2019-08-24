const test = require("tape");
const puppeteer = require("puppeteer");

const username = process.env.SPOTIFY_USERNAME;
const password = process.env.SPOTIFY_PASSWORD;

test("End-to-end scenario", function(t) {
  (async () => {
    const browser = await puppeteer.launch({
      headless: true,
      slowMo: 0,
      devTools: false
    });
    const page = await browser.newPage();

    await page.goto("https://fip.fr");
    const expectedTitle = await page.$eval(
      ".now-info-title",
      node => node.textContent
    );

    // We open the app with another URL to avoid impacting GA
    await page.goto("http://fip.cleverapps.io");

    await page.waitForSelector(".fipradio-nowplaying-title");
    const actualRadioTitle = await page.$eval(
      ".fipradio-nowplaying-title",
      node => node.textContent
    );

    t.equal(
      actualRadioTitle.toUpperCase(),
      expectedTitle.toUpperCase(),
      "The song title on the radio component should match the one on fip.fr"
    );

    await page.waitForSelector(".nav-player-title");
    const actualPlayerTitle = await page.$eval(
      ".nav-player-title",
      node => node.textContent
    );

    t.equal(
      actualPlayerTitle.toUpperCase(),
      expectedTitle.toUpperCase(),
      "The song title on the player should match the one on fip.fr"
    );

    const protocol = await page.evaluate(() => window.location.protocol);
    t.equal(
      protocol,
      "https:",
      "The user should have been redirected to the HTTPS version"
    );

    await Promise.all([
      page.waitForNavigation(),
      page.$eval(`a[href="/radios/fip-autour-du-jazz"]`, node => node.click())
    ]);
    t.pass("Navigate to the Jazz radio");

    const actualNextRadioTitle = await page.$eval(
      ".fipradio-nowplaying-title",
      node => node.textContent
    );

    t.notEqual(
      actualNextRadioTitle.toUpperCase(),
      actualRadioTitle.toUpperCase(),
      "The song title on the radio component should have changed"
    );

    const actualNextPlayerTitle = await page.$eval(
      ".nav-player-title",
      node => node.textContent
    );

    t.equal(
      actualNextPlayerTitle.toUpperCase(),
      actualPlayerTitle.toUpperCase(),
      "The song title on the player should not have changed"
    );

    await Promise.all([
      page.waitForNavigation(),
      page.$eval(`a[href="/users/me/songs"]`, node => node.click())
    ]);
    t.pass("Navigate to Favorite songs");

    const actualSyncButtonLabel = await page.$eval(
      ".sync",
      node => node.textContent
    );

    t.equal(
      actualSyncButtonLabel,
      "Sync",
      "The sync button should be displayed"
    );

    await Promise.all([
      page.waitForNavigation(),
      page.$eval(".sync", node => node.click())
    ]);
    t.pass("Navigate to spotify.com");

    await page.type("#login-username", username);
    await page.type("#login-password", password);

    await Promise.all([
      page.waitForNavigation(),
      page.$eval("#login-button", node => node.click())
    ]);

    await page.waitForSelector(".unsync", { timeout: 2000 });
    const actualUnsyncButtonLabel = await page.$eval(
      ".unsync",
      node => node.textContent
    );

    t.equal(
      actualUnsyncButtonLabel,
      "Unsync",
      "The unsync button should be displayed"
    );

    await browser.close();
    t.end();
  })();
});
