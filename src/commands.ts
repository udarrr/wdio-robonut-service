import {
  Button,
  centerOf,
  mouse,
  straightTo,
  screen,
  imageResource,
  Region,
  keyboard,
  loadImage,
  clipboard,
  saveImage,
  ScreenClass,
  MouseClass,
  KeyboardClass,
  providerRegistry,
  WindowProviderInterface,
  randomPointIn,
  ClipboardClass,
} from '@nut-tree/nut-js';
import { ImageElement } from './types';
import finder from '@udarrr/template-matcher';
import { RobotDragAndDropType } from './types';
import { RobotConfig } from '../index';
import { Options } from '@wdio/types';
import TemplateMatchingFinder from '@udarrr/template-matcher/dist/lib/template-matching-finder.class';
import * as sysClipboard from 'clipboard-sys';
import { WaitUntilOptions } from 'webdriverio';

export class RobotCommands {
  protected screen: ScreenClass = screen;

  protected finder: TemplateMatchingFinder = finder;

  protected mouse: MouseClass = mouse;

  protected keyboard: KeyboardClass = keyboard;

  protected sysClipboard: sysClipboard.SysClipboard = sysClipboard.clipboard;

  protected virtClipboard: ClipboardClass = clipboard;

  private _browser: WebdriverIO.Browser;

  protected _config: (RobotConfig & Options.Testrunner) | RobotConfig;

  protected windowApiProvider: WindowProviderInterface = providerRegistry.getWindow();

  constructor(browser: WebdriverIO.Browser | null, config: (RobotConfig & Options.Testrunner) | RobotConfig) {
    this._config = config;
    this._browser = browser;

    this.init(this._config);
  }

  private init(options: (RobotConfig & Options.Testrunner) | RobotConfig) {
    this.mouse.config.mouseSpeed = options && options.mouseConfig?.mouseSpeed ? options.mouseConfig.mouseSpeed : this.mouse.config.mouseSpeed;
    this.mouse.config.autoDelayMs = options && options.mouseConfig?.autoDelayMs ? options.mouseConfig.autoDelayMs : this.mouse.config.autoDelayMs;
    this.screen.config.autoHighlight = options && options.screenConfig?.autoHighlight ? options.screenConfig.autoHighlight : this.screen.config.autoHighlight;
    this.screen.config.confidence = options && options.screenConfig?.confidence ? options.screenConfig.confidence : this.screen.config.confidence;
    this.screen.config.highlightDurationMs = options && options.screenConfig?.highlightDurationMs ? options.screenConfig.highlightDurationMs : this.screen.config.highlightDurationMs;
    this.screen.config.highlightOpacity = options && options.screenConfig?.highlightOpacity ? options.screenConfig.highlightOpacity : this.screen.config.highlightOpacity;
    this.screen.config.resourceDirectory = options && options.screenConfig?.resourceDirectory ? options.screenConfig.resourceDirectory : this.screen.config.resourceDirectory;
    this.keyboard.config.autoDelayMs = options && options.keyboardConfig?.autoDelayMs ? options.keyboardConfig.autoDelayMs : this.keyboard.config.autoDelayMs;

    options.imageFinder?.confidence ? this.finder.setConfig({ confidence: options.imageFinder?.confidence }) : null;
    options.imageFinder?.searchMultipleScales ? this.finder.setConfig({ searchMultipleScales: options.imageFinder?.searchMultipleScales }) : null;
    options.imageFinder?.customOptions?.debug ? this.finder.setConfig({ customOptions: { debug: options.imageFinder?.customOptions?.debug } }) : null;
    options.imageFinder?.customOptions?.methodType ? this.finder.setConfig({ customOptions: { methodType: options.imageFinder?.customOptions.methodType } }) : null;
    options.imageFinder?.customOptions?.scaleSteps ? this.finder.setConfig({ customOptions: { scaleSteps: options.imageFinder?.customOptions?.scaleSteps } }) : null;
  }

  private async isWaitForImageDisplayed(image: ImageElement, options: WaitUntilOptions = { interval: 2500, timeout: 10000 }) {
    try {
      return (await this._browser.waitUntil(async () => {
        return !!(await this.finder.findMatch({ needle: image.pathToImage })).location;
      }, options)) as true;
    } catch {
      return false;
    }
  }

  private async waitForImageDisplayed(image: ImageElement, options: WaitUntilOptions = { interval: 2500, timeout: 10000 }) {
    return await this._browser.waitUntil(async () => {
      return !!(await this.finder.findMatch({ needle: image.pathToImage })).location;
    }, options);
  }

  private async clickImage(image: ImageElement, options: WaitUntilOptions = { interval: 2500, timeout: 10000 }) {
    await this.waitForImageDisplayed(image, options);
    const location = await this.finder.findMatch({ needle: image.pathToImage });
    const point = await centerOf(location.location);
    await this.mouse.move(straightTo(point));
    await this.mouse.click(Button.LEFT);
  }

  private async highlightDisplayedImage(image: ImageElement, options: WaitUntilOptions & { highLight?: number } = { interval: 2500, timeout: 10000 }) {
    const tempHighLightDuration = this.screen.config.highlightDurationMs;
    this.screen.config.highlightDurationMs = options?.highLight ? options.highLight : tempHighLightDuration;

    await this.waitForImageDisplayed(image, options);
    let elementScreenRect = await this.finder.findMatch({ needle: image.pathToImage });
    await this.screen.highlight(elementScreenRect.location);

    this.screen.config.highlightDurationMs = tempHighLightDuration;
  }

  private async dndImage(drag: ImageElement, drop: ImageElement, options?: RobotDragAndDropType) {
    const tempConfMouseSpeed = this.mouse.config.mouseSpeed;
    const tempConfAutoDelay = this.mouse.config.autoDelayMs;
    const tempHighLightDuration = this.screen.config.highlightDurationMs;
    const tempAutoHighLight = this.screen.config.autoHighlight;

    const offsetX = options?.offsetDragX ? options.offsetDragX : 15;
    const offsetY = options?.offsetDragY ? options.offsetDragY : 15;
    const button = options?.button ? options.button : Button.LEFT;
    let scrollOptions = options?.scrollOptions?.scrollIntoViewOptions ? { scrollIntoViewOptions: options.scrollOptions.scrollIntoViewOptions } : { scrollIntoViewOptions: true };
    scrollOptions = options?.scrollOptions?.scrollTimeout ? { ...{ scrollTimeout: options.scrollOptions.scrollTimeout }, ...scrollOptions } : { ...{ scrollTimeout: 2500 }, ...scrollOptions };

    const imageTimeout = options?.waitTimeout ? options.waitTimeout : 10000;
    this.mouse.config.mouseSpeed = options?.mouseSpeed ? options.mouseSpeed : tempConfMouseSpeed;
    this.mouse.config.autoDelayMs = options?.mouseDelay ? options.mouseDelay : tempConfAutoDelay;
    this.screen.config.highlightDurationMs = options?.highLight ? options.highLight : tempHighLightDuration;
    this.screen.config.autoHighlight = false;

    await this.waitForImageDisplayed(drag, { timeout: imageTimeout, interval: 2500 });
    let dragRect = await this.finder.findMatch({ needle: drag.pathToImage });

    if (options && 'highLight' in options && options.highLight) {
      await this.screen.highlight(dragRect.location);
    }

    if ('pathToNestedImage' in drag && drag.pathToNestedImage) {
      let nestedDragRect = await this.finder.findMatch({ needle: drag.pathToNestedImage, customOptions: { roi: dragRect.location } });

      if (options && 'highLight' in options && options.highLight) {
        await this.screen.highlight(nestedDragRect.location);
      }
      await this.mouse.move(straightTo(centerOf(nestedDragRect.location)));
      dragRect = nestedDragRect;
    } else {
      await this.mouse.move(straightTo(centerOf(dragRect.location)));
    }
    await this.mouse.pressButton(button);

    if (offsetX) {
      await this.mouse.move(straightTo(centerOf(new Region(dragRect.location.left + offsetX, dragRect.location.top, dragRect.location.width, dragRect.location.height))));
    }
    if (offsetY) {
      await this.mouse.move(straightTo(centerOf(new Region(dragRect.location.left, dragRect.location.top + offsetY, dragRect.location.width, dragRect.location.height))));
    }
    await this.waitForImageDisplayed(drop, { timeout: imageTimeout, interval: 2500 });

    let dropRect = await this.finder.findMatch({ needle: drop.pathToImage });

    if (options && 'highLight' in options && options.highLight) {
      await this.screen.highlight(dropRect.location);
    }

    if ('pathToNestedImage' in drag && drag.pathToNestedImage) {
      let nestedDropRect = await this.finder.findMatch({ needle: drop.pathToNestedImage, customOptions: { roi: dropRect.location } });

      if (options && 'highLight' in options && options.highLight) {
        await this.screen.highlight(nestedDropRect.location);
      }
      await this.mouse.move(straightTo(centerOf(nestedDropRect.location)));
      dropRect = nestedDropRect;
    } else {
      await this.mouse.move(straightTo(centerOf(dropRect.location)));
    }
    await this.mouse.releaseButton(button);

    this.mouse.config.mouseSpeed = tempConfMouseSpeed;
    this.mouse.config.autoDelayMs = tempConfAutoDelay;
    this.screen.config.highlightDurationMs = tempHighLightDuration;
    this.screen.config.autoHighlight = tempAutoHighLight;
  }

  addCommands() {
    if (this._browser) {
      this._browser.addCommand('robot', async () => {
        return {
          rect: { straightTo: straightTo, centerOf: centerOf, randomPointIn: randomPointIn },
          image: {
            clickImage: this.clickImage.bind(this),
            isWaitForImageDisplayed: this.isWaitForImageDisplayed.bind(this),
            waitForImageDisplayed: this.waitForImageDisplayed.bind(this),
            highlightDisplayedImage: this.highlightDisplayedImage.bind(this),
            dragAndDrop: this.dndImage.bind(this),
          },
          mouse: this.mouse,
          screen: this.screen,
          keyboard: this.keyboard,
          windowApiProvider: this.windowApiProvider,
          clipboard: { sys: this.sysClipboard, virt: this.virtClipboard },
          imageFinder: { finder: this.finder, reader: { imageResource: imageResource, loadImage: loadImage, saveImage: saveImage } },
        };
      });
    }
  }
}
