import 'expect-puppeteer';

test('Jump between internal links', async () => {
    await page.goto('http://localhost:3000/core');
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]').scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });

    const pagesContainer = await page.waitForSelector('[data-testid="core__inner-pages"]');

    const jumpToTableOfContents = async () => {
        await pagesContainer.evaluate((ele) => (ele.scrollTop = 2416), pagesContainer);
        // Wait until the page is rendered
        return await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
    };

    // Jump to the 3rd page
    await jumpToTableOfContents();

    // Click the `Preface` link
    let link = await page.waitForSelector('[data-annotation-id="31R"]');
    await link.click();

    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    let scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(3709);

    // Click the `Who should read this guide` link
    await jumpToTableOfContents();
    link = await page.waitForSelector('[data-annotation-id="37R"]', { visible: true });
    await link.click();

    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(3876);

    // Click the `Related documentation` link
    await jumpToTableOfContents();
    link = await page.waitForSelector('[data-annotation-id="38R"]', { visible: true });
    await link.click();

    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(3990);

    // Click the `Parameters for Opening PDF Files` link
    await jumpToTableOfContents();
    link = await page.waitForSelector('[data-annotation-id="39R"]', { visible: true });
    await link.click();

    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(4913);

    // Click the `Parameters` link
    await jumpToTableOfContents();
    link = await page.waitForSelector('[data-annotation-id="34R"]', { visible: true });
    await link.click();

    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(5417);

    // Click the `Specifying parameters in a URL` link
    await jumpToTableOfContents();
    link = await page.waitForSelector('[data-annotation-id="35R"]', { visible: true });
    await link.click();

    await page.waitForSelector('[data-testid="core__text-layer-6"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(7944);

    // Click the `URL examples` link
    await jumpToTableOfContents();
    link = await page.waitForSelector('[data-annotation-id="36R"]', { visible: true });
    await link.click();

    await page.waitForSelector('[data-testid="core__text-layer-7"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(8539);

    // Click the `URL limitations` link
    await jumpToTableOfContents();
    link = await page.waitForSelector('[data-annotation-id="33R"]', { visible: true });
    await link.click();

    await page.waitForSelector('[data-testid="core__text-layer-7"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(8795);
});
