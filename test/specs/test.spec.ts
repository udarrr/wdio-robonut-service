const TIMEOUT = 500;

describe('Drag and drop by image', () => {
  it('Opera dnd test image', async () => {
    await browser.url('https://dev.opera.com/articles/accessible-drag-and-drop/example.html');
    await (await browser.robot()).image.dragAndDrop({ pathToImage: `./test/specs/pic/opera1.png` }, { pathToImage: `./test/specs/pic/opera2.png` }, { highLight: TIMEOUT });
  });

  it('Opera dnd test nested image', async () => {
    await browser.url('https://dev.opera.com/articles/accessible-drag-and-drop/example.html');
    await (
      await browser.robot()
    ).image.dragAndDrop(
      { pathToImage: `./test/specs/pic/opera1.png`, pathToNestedImage: `./test/specs/pic/nested1.png` },
      { pathToImage: `./test/specs/pic/opera2.png`, pathToNestedImage: `./test/specs/pic/nested2.png` },
      { highLight: TIMEOUT },
    );
  });

  it('Global sqadnd dnd test image', async () => {
    await browser.url('https://www.globalsqa.com/demo-site/draganddrop/');
    await (await browser.robot()).image.dragAndDrop({ pathToImage: `./test/specs/pic/test_globalsqa1.png` }, { pathToImage: `./test/specs/pic/test_globalsqa4.png` }, { highLight: TIMEOUT });
    await (await browser.robot()).image.dragAndDrop({ pathToImage: `./test/specs/pic/test_globalsqa2.png` }, { pathToImage: `./test/specs/pic/test_globalsqa4.png` }, { highLight: TIMEOUT });
    await (await browser.robot()).image.dragAndDrop({ pathToImage: `./test/specs/pic/test_globalsqa3.png` }, { pathToImage: `./test/specs/pic/test_globalsqa4.png` }, { highLight: TIMEOUT });
  });
});
