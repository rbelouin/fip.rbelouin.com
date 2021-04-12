const puppeteer = require("puppeteer");

const username = process.env.SPOTIFY_USERNAME;
const password = process.env.SPOTIFY_PASSWORD;
const headless =
  process.env.HEADLESS !== "false" && process.env.DEBUG !== "true";
const devTools = process.env.DEV_TOOLS === "true";
const slowMo = parseInt(
  !process.env.SLOW_MO && process.env.DEBUG !== "true"
    ? "0"
    : process.env.SLOW_MO || "300"
);

test("End-to-end scenario", async function(done) {
  const browser = await puppeteer.launch({
    defaultViewport: null,
    headless,
    devTools,
    slowMo
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

  expect(actualRadioTitle.toUpperCase()).toStrictEqual(
    expectedTitle.toUpperCase()
  );

  await page.waitForSelector("#player-bar-song-title");
  const actualPlayerTitle = await page.$eval(
    "#player-bar-song-title",
    node => node.textContent
  );

  expect(actualPlayerTitle.toUpperCase()).toStrictEqual(
    expectedTitle.toUpperCase()
  );

  const protocol = await page.evaluate(() => window.location.protocol);
  expect(protocol).toStrictEqual("https:");

  await Promise.all([
    page.waitForNavigation(),
    page.$eval(`a[href="/radios/jazz"]`, node => node.click())
  ]);

  const actualNextRadioTitle = await page.$eval(
    ".fipradio-nowplaying-title",
    node => node.textContent
  );

  expect(actualNextRadioTitle.toUpperCase()).not.toStrictEqual(
    actualRadioTitle.toUpperCase()
  );

  const actualNextPlayerTitle = await page.$eval(
    "#player-bar-song-title",
    node => node.textContent
  );

  expect(actualNextPlayerTitle.toUpperCase()).toStrictEqual(
    actualPlayerTitle.toUpperCase()
  );

  await Promise.all([
    page.waitForNavigation(),
    page.$eval(`a[href="/users/me/songs"]`, node => node.click())
  ]);

  const actualSyncButtonLabel = await page.$eval(
    ".sync",
    node => node.textContent
  );

  expect(actualSyncButtonLabel).toStrictEqual("Sync");

  await Promise.all([
    page.waitForNavigation(),
    page.$eval(".sync", node => node.click())
  ]);

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

  expect(actualUnsyncButtonLabel).toStrictEqual("Unsync");

  await browser.close();
  done();
});

test("Configuration is up-to-date", async () => {
  const browser = await puppeteer.launch({
    defaultViewport: null,
    headless,
    devTools,
    slowMo
  });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "languages", {
      get: function() {
        return ["fr-FR", "fr"];
      }
    });
  });

  await page.goto("https://fip.fr");

  const expectedStations = await page.$$eval(
    ".playingnow-list-item-station",
    nodes => Array.from(nodes).map(node => ({
      title: node.getAttribute("title"),
      // Color is currently the only inline CSS property set on this element.
      // This is unsafe but let’s wait until the test becomes flaky to make it more robust.
      color: node.getAttribute("style").split(":")[1].toLowerCase(),
    }))
  );

  // We open the app with another URL to avoid impacting GA
  await page.goto("http://fip-local.rbelouin.com:8080");

  await page.waitForSelector("nav ul li", { timeout: 2000 });
  const navigationItems = await page.$$eval(
    "nav ul li",
    nodes => Array.from(nodes).map(node => ({
      title: node.textContent,
      color: getComputedStyle(node).getPropertyValue("--navigation-item-color"),
    }))
  );

  const actualStations = navigationItems.slice(0, -1); // Favorite Songs is not a station

  expect(actualStations).toEqual(expectedStations);
  await browser.close();
}, 20000);
