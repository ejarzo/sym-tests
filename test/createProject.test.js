const puppeteer = require("puppeteer");
require("dotenv").config();

const { URL, USERNAME, PASSWORD, NETLIFY_URL } = process.env;

describe("SYM Tests", () => {
  test("Can load the page", async () => {
    await page.goto(URL);
  });

  test("Can draw a shape", async () => {
    await page.mouse.click(130, 170);
    await page.mouse.click(500, 190);
    await page.mouse.click(510, 360);
    await page.mouse.click(130, 170);
  });

  test("Can draw another shape in a different color", async () => {
    // change draw color
    await page.keyboard.down("3");

    // shape 2
    await page.mouse.click(130, 270);
    await page.mouse.click(300, 290);
    await page.mouse.click(210, 260);
    await page.mouse.click(130, 270);
  });

  test("Can play and produce audio [MANUAL CHECK]", async () => {
    // play
    await page.click(".styles_toolbarSection__2RNGb button");
    await page.waitFor(1000);
    await page.click(".styles_toolbarSection__2RNGb button");
  });

  test("Can delete a shape", async () => {
    // click "Edit Tool"
    await page.mouse.click(210, 55);

    // click shape
    await page.mouse.click(217, 273);

    // click delete shape
    await page.waitForSelector(".styles_deleteButton__3KBR3");
    await page.click(".styles_deleteButton__3KBR3");
  });

  test("Can save the project", async () => {
    // Save project ==========
    await page.click("#SaveButton");
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

    await page.waitForSelector(".ant-message-success");
    await page.waitFor(500);
  }, 20000);

  test("Can change a shape color and move it", async () => {
    // click "Edit Tool"
    await page.mouse.click(210, 55);

    // click shape
    await page.mouse.click(375, 245);

    // click color panel
    await page.waitForSelector(".styles_colorPickerContainer__3R7zN");
    await page.click(".styles_colorPickerContainer__3R7zN");

    // click purple
    await page.waitForSelector(".github-picker");
    await page.click(".github-picker span:nth-of-type(3)");

    // drag shape
    await page.mouse.move(370, 240);
    await page.mouse.down();
    await page.mouse.move(390, 290);
    await page.mouse.up();
  });

  test("Can overwrite the project", async () => {
    // Save again
    await page.click("#SaveButton");
    await page.waitFor(1000);

    await page.waitForSelector(
      ".ant-popover:not(.ant-popover-hidden) .ant-btn.ant-btn-primary"
    );
    await page.click(
      ".ant-popover:not(.ant-popover-hidden) .ant-btn.ant-btn-primary"
    );

    await page.waitForSelector(".ant-message-success:not(.ant-message-hidden)");
  }, 20000);

  test("Can delete the project", async () => {
    await page.waitFor(3000);
    await page.waitForSelector("i[aria-label='icon: setting']");
    await page.click("i[aria-label='icon: setting']");
    await page.waitFor(1000);

    // CLick delete project
    await page.waitForSelector(".ant-drawer-body .ant-btn.ant-btn-danger");
    await expect(page).toClick(".ant-drawer-body .ant-btn", {
      text: "Delete Project"
    });
    await page.waitFor(500);
    await expect(page).toClick(
      ".ant-popover:not(.ant-popover-hidden) .ant-btn",
      {
        text: "Delete"
      }
    );

    await page.waitForSelector(".ant-message-loading");
    await page.waitForSelector(".ant-message-success");
    await page.waitFor(500);
  }, 20000);
});
