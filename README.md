# wdio-robonut-service

### Description

wdio-robonut-service is cross platform service with access to system mouse, keyboard, clipboard, screen.

### Instalation

npm install wdio-robonut-service

##### As service in wdio.conf.ts

```typescript
import RobotService from 'wdio-robonut-service';

const robotConfig = {};

// RobotConfig {
//   mouseConfig?: MouseClass;
//   screenConfig?: ScreenClass;
//   keyboardConfig?: KeyboardClass;
//   imageFinder?: CustomConfigType;
// }

export const config: Options.Testrunner = {
//------
services: [[RobotService, robotConfig]],
//------
}
```

##### As standalone

execute it wherever once after browser initialisation

```typescript
import RobotCommands from 'wdio-robonut-service';

const robotConfig = {};

// RobotConfig {
//   mouseConfig?: MouseClass;
//   screenConfig?: ScreenClass;
//   keyboardConfig?: KeyboardClass;
//   imageFinder?: CustomConfigType;
// }

new RobotCommands(browser, robotConfig)
```

### Usage, Examples

```typescript
browser.robot()

async function dragAndDropImage(imageDrag: ImageElement,imageDrop: ImageElement, timeout: number = 10000) {
await (await browser.robot()).image.dragAndDrop(
{ pathToImage: imageDrag.pathToImage},
{ pathToImage: imageDrop.pathToImage}, 
{ highLight: timeout , waitTimeout:timeout },);
}

async function dragAndDropImageWithNestedImage(imageDrag: ImageElement,imageDrop: ImageElement, timeout: number = 10000) {
await (await browser.robot()).image.dragAndDrop(
      { pathToImage: imageDrag.pathToImage, pathToNestedImage: imageDrag.pathToNestedImage },
      { pathToImage: imageDrop.pathToImage, pathToNestedImage: imageDrop.pathToNestedImage },
      { highLight: timeout , waitTimeout:timeout },
    );
}

async function clickImage(image: ImageElement, timeout: number = 5000) {
    await (await browser.robot()).image.waitForImageDisplayed(image, timeout);
    const location = await (await browser.robot()).imageFinder.finder.findMatch({ needle: image.pathToImage });
    const point = await (await browser.robot()).rect.centerOf(location.location);
    await (await browser.robot()).mouse.move(await (await browser.robot()).rect.straightTo(point));
    await (await browser.robot()).mouse.click(Button.LEFT);
}

async function isWaitForImageDisplayed(image: ImageElement, timeout: number = 10000) {
    try {
      return (await browser.waitUntil(
        async () => {
          return !!(await (await browser.robot()).imageFinder.finder.findMatch({ needle: image.pathToImage })).location.left;
        },
        { timeout, ...{ interval: 2500 } },
      )) as true;
    } catch {
      return false;
    }
}
```

### API

```typescript
robot: () => Promise<{
        rect: {
          straightTo: (target: Point | Promise<Point>) => Promise<Point[]>;
          centerOf: (target: Region | Promise<Region>) => Promise<Point>;
          randomPointIn: (target: Region | Promise<Region>) => Promise<Point>;
        };
        image: {
          clickImage: (image: ImageElement, timeout: number) => Promise<void>;
          isWaitForImageDisplayed: (image: ImageElement, timeout: number) => Promise<boolean>;
          waitForImageDisplayed: (image: ImageElement, timeout: number) => Promise<true | void>;
          highlight: (image: ImageElement) => Promise<void>;
          dragAndDrop: (dragImage: ImageElement, dropImage: ImageElement, options?: RobotDragAndDropType) => Promise<void>;
        };
        mouse: MouseProviderInterface;
        screen: ScreenProviderInterface;
        keyboard: KeyboardProviderInterface;
        windowApiProvider: WindowProviderInterface;
        clipboard: { sys: SysClipboard; virt: ClipboardClass };
        imageFinder: {
          finder: TemplateMatchingFinder;
          image: { imageResource: (fileName: string) => Promise<Image>; loadImage: (parameters: string) => Promise<Image>; saveImage: (parameters: ImageWriterParameters) => Promise<void> };
        };
      }>;
```

### Features
- [x] Robot interfaces
- [x] Image robot
- [ ] Dom element robot (by locators)
