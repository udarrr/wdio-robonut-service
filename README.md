# wdio-robonut-service

![Tested](https://github.com/udarrr/wdio-robonut-service/workflows/Tests/badge.svg)
![Released](https://github.com/udarrr/wdio-robonut-service/workflows/Create%20tagged%20release/badge.svg)

![image](https://raw.githubusercontent.com/udarrr/wdio-robonut-service/HEAD/READMELOGO.png)

### Description

wdio-robonut-service is cross platform (windows, darwin, linux) service with access to system mouse, keyboard, clipboard, screen and seeking image templates on visible screen with [nutjs](https://nutjs.dev/) under hood. With the service possible perform system move, click, copy, past, type and so on. Possible check being existed and obtaining coords of image template, drag and drop it and so on.

### Instalation

```nodejs
npm install wdio-robonut-service
```

##### Config

```typescript
interface RobotConfig {
  mouseConfig?: { autoDelayMs: number; mouseSpeed: number };
  screenConfig?: { confidence: number; autoHighlight: boolean; highlightDurationMs: number; highlightOpacity: number; resourceDirectory: string };
  keyboardConfig?: { autoDelayMs: number };
  imageFinder?: {
    confidence?: number;
    providerData?: {
      methodType?: MethodNameType;
      scaleSteps?: Array<number>;
      searchMultipleScales?: boolean;
      isRotation: boolean,
      rotationOption?: { range?: number; overLap?: number; minDstLength?: number };
      debug?: boolean;
      roi?: Region;
    };
  };
}
```

##### Like wdio service in wdio.conf.ts

```typescript
import RobotService from 'wdio-robonut-service';

const robotConfig: RobotConfig = {};

export const config: Options.Testrunner = {
//-
services: [[RobotService, robotConfig]],
//-
}
```

##### For wdio standalone/remote

execute it wherever once after browser initialisation

```typescript
import RobotCommands from 'wdio-robonut-service';

const robotConfig: RobotConfig = {};

new RobotCommands(browser, robotConfig).addCommands()
```

##### Standalone

```typescript
const robotConfig: RobotConfig = {};

new RobotDirect(robotConfig).instance()
```

### Usage

##### Main point access

```typescript
browser.robot
```

##### Examples

```typescript
async function dragAndDropImage(imageDrag: ImageElement,imageDrop: ImageElement, timeout: number = 10000) {
await browser.robot.image.dragAndDrop(
{ pathToImage: imageDrag.pathToImage},
{ pathToImage: imageDrop.pathToImage}, 
{ highLight: timeout/10 , waitTimeout:timeout });
}

async function dragAndDropImageWithNestedImage(imageDrag: ImageElement,imageDrop: ImageElement, timeout: number = 10000 ) {
await browser.robot.image.dragAndDrop(
      { pathToImage: imageDrag.pathToImage, pathToNestedImage: imageDrag.pathToNestedImage },
      { pathToImage: imageDrop.pathToImage, pathToNestedImage: imageDrop.pathToNestedImage },
      { highLight: timeout/10 , waitTimeout:timeout },
    );
}

async function clickImage(image: ImageElement,  
options: WaitUntilOptions = { interval: 2500, timeout: 10000 }) {
    await browser.robot.image.waitForImageDisplayed(image, options);
    const location = await browser.robot.image.finder.findMatch({ needle: image.pathToImage });
    const point = await browser.robot.rect.centerOf(location.location);
    await browser.robot.mouse.move(await browser.robot.rect.straightTo(point));
    await browser.robot.mouse.click(Button.LEFT);
}

async function isWaitForImageDisplayed(image: ImageElement, 
options: WaitUntilOptions = { interval: 2500, timeout: 10000 }) {
    try {
      return (await browser.waitUntil(
        async () => {
          return !!(await browser.robot.image.finder.findMatch({ needle: image.pathToImage })).location;
        }, options
      )) as true;
    } catch {
      return false;
    }
}
```

### API

```typescript
    interface Browser {
      robot: {
        rect: {
          straightTo: (target: Point | Promise<Point>) => Promise<Point[]>;
          centerOf: (target: Region | Promise<Region>) => Promise<Point>;
          randomPointIn: (target: Region | Promise<Region>) => Promise<Point>;
        };
        image: {
          finder: TemplateMatchingFinder;
          reader: { imageResource: (fileName: string) => Promise<Image>; loadImage: (parameters: string) => Promise<Image>; saveImage: (parameters: ImageWriterParameters) => Promise<void> };
          clickImage: (image: ImageElement, options: WaitUntilOptions) => Promise<void>;
          isWaitForImageDisplayed: (image: ImageElement, options?: WaitUntilOptions) => Promise<boolean>;
          waitForImageDisplayed: (image: ImageElement, options?: WaitUntilOptions) => Promise<true | void>;
          highlightDisplayedImage: (image: ImageElement, options?: WaitUntilOptions & { highLight?: number }) => Promise<void>;
          dragAndDrop: (dragImage: ImageElement, dropImage: ImageElement, options?: RobotDragAndDropType) => Promise<void>;
        };
        mouse: MouseClass;
        screen: ScreenClass;
        keyboard: KeyboardClass;
        windowApiProvider: WindowProviderInterface;
        clipboard: { sys: SysClipboard; virt: ClipboardClass };
      };
    }
```

### Features

- [x] Robot interfaces
- [x] Image robot
- [ ] Dom element robot (by locators)

### Constraints

- Working with visible display (not headless)
- Working in one thread/instance;
