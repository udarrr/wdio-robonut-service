import { KeyboardClass, MouseClass, ScreenClass, Image, ImageWriterParameters, ClipboardClass, Point, Region, WindowProviderInterface } from '@nut-tree/nut-js';
import RobotService from './src/service';
import { SysClipboard } from 'clipboard-sys';
import { ImageElement, RobotDragAndDropType, Button, ScrollOptionsType } from './src/types';
import TemplateMatchingFinder from '@udarrr/template-matcher/dist/lib/template-matching-finder.class';
import { CustomConfigType } from '@udarrr/template-matcher/dist/lib/customTypes';
import { RobotCommands } from './src/commands';
import { WaitUntilOptions } from 'webdriverio';
import { RobotDirect } from './src/direct';

export default RobotService;
export const launcher = RobotService;
export { ImageElement, RobotDragAndDropType, Button, ScrollOptionsType, RobotDirect, RobotCommands };

export interface RobotConfig {
  mouseConfig?: Partial<MouseClass['config']>;
  screenConfig?: Partial<ScreenClass['config']>;
  keyboardConfig?: Partial<KeyboardClass['config']>;
  imageFinder?: CustomConfigType;
}
declare global {
  namespace WebdriverIO {
    interface Browser {
      robot: () => Promise<{
        rect: {
          straightTo: (target: Point | Promise<Point>) => Promise<Point[]>;
          centerOf: (target: Region | Promise<Region>) => Promise<Point>;
          randomPointIn: (target: Region | Promise<Region>) => Promise<Point>;
        };
        image: {
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
        imageFinder: {
          finder: TemplateMatchingFinder;
          reader: { imageResource: (fileName: string) => Promise<Image>; loadImage: (parameters: string) => Promise<Image>; saveImage: (parameters: ImageWriterParameters) => Promise<void> };
        };
      }>;
    }
    interface ServiceOption extends RobotConfig {}
  }
}
