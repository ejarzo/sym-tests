const puppeteer = require("puppeteer");
require("dotenv").config();

const { URL, USERNAME, PASSWORD, NETLIFY_URL } = process.env;

test("Can save project with deleted shape", async () => {
  const browser = await puppeteer.launch({ headless: false, sloMo: 200 });
  const page = await browser.newPage();

  await page.setViewport({ width: 1000, height: 700 });
  await page.goto(URL);

  // shape 1
  await page.mouse.click(130, 170);
  await page.mouse.click(500, 190);
  await page.mouse.click(510, 360);
  await page.mouse.click(130, 170);

  // change draw color
  await page.keyboard.down("3");

  // shape 2
  await page.mouse.click(130, 270);
  await page.mouse.click(300, 290);
  await page.mouse.click(210, 260);
  await page.mouse.click(130, 270);

  // play
  await page.click(".styles_toolbarSection__2RNGb button");
  await page.waitFor(1000);
  await page.click(".styles_toolbarSection__2RNGb button");

  // click "Edit Tool"
  await page.mouse.click(210, 55);

  // click shape
  await page.mouse.click(217, 273);

  // click delete shape
  await page.waitForSelector(".styles_deleteButton__3KBR3");
  await page.click(".styles_deleteButton__3KBR3");
  await page.click("#SaveButton");

  // const now = new Date();
  await page.keyboard.type(" by Puppeteer");
  await page.keyboard.down("Enter");

  // Set netlify set URL
  const netlifyFrame = page.frames()[1];
  await netlifyFrame.focus(".formControl");
  await netlifyFrame.type("input", NETLIFY_URL);
  await netlifyFrame.click("button[type=submit]");

  // Log In
  await netlifyFrame.waitForSelector("input[type=email]");
  await netlifyFrame.type("input[type=email]", USERNAME);
  await netlifyFrame.type("input[type=password]", PASSWORD);
  await netlifyFrame.click("button[type=submit]");

  await netlifyFrame.waitForSelector(".infoText");
  await netlifyFrame.click(".btnClose");

  // Save
  await page.waitForSelector(
    ".ant-popover.ant-popover-placement-rightTop .ant-btn.ant-btn-primary"
  );
  await page.click(
    ".ant-popover.ant-popover-placement-rightTop .ant-btn.ant-btn-primary"
  );

  await browser.close();
}, 20000);
