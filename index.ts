import { KeyboardClass, MouseClass, ScreenClass, Image, ImageWriterParameters, ClipboardClass, Point, Region, WindowProviderInterface } from '@nut-tree/nut-js';
import RobotService from './src/service';
import type { KeyboardProviderInterface, MouseProviderInterface, ScreenProviderInterface } from '@nut-tree/nut-js';
import { SysClipboard } from 'clipboard-sys';
import { ImageElement } from './src/types';
import TemplateMatchingFinder from '@udarrr/template-matcher/dist/lib/template-matching-finder.class';
import { RobotDragAndDropType } from './src/types';
import { CustomConfigType } from '@udarrr/template-matcher/dist/lib/customTypes';
import { RobotCommands } from './src/commands';

export default RobotService;
export const launcher = RobotService;

export { RobotCommands };

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
          clickImage: (image: ImageElement, timeout: number) => Promise<void>;
          isWaitForImageDisplayed: (image: ImageElement, timeout: number) => Promise<boolean>;
          waitForImageDisplayed: (image: ImageElement, timeout: number) => Promise<true | void>;
          highlight: (image: ImageElement) => Promise<void>;
          dragAndDrop: (dragImage: ImageElement, dropImage: ImageElement, options?: RobotDragAndDropType) => Promise<void>;
        };
        mouse: MouseClass;
        screen: ScreenClass;
        keyboard: KeyboardClass;
        windowApiProvider: WindowProviderInterface;
        clipboard: { sys: SysClipboard; virt: ClipboardClass };
        imageFinder: {
          finder: TemplateMatchingFinder;
          image: { imageResource: (fileName: string) => Promise<Image>; loadImage: (parameters: string) => Promise<Image>; saveImage: (parameters: ImageWriterParameters) => Promise<void> };
        };
      }>;
    }

    interface ServiceOption extends RobotConfig {}
  }
}
