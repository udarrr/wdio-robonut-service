import { Button } from '@nut-tree/nut-js';

export interface IElement {
  locator: string;
  frames: Array<string>;
}

export interface ImageElement {
  pathToImage: string;
  pathToNestedImage?: string;
}

export interface RobotDragAndDropType {
  button?: Button;
  mouseSpeed?: number;
  mouseDelay?: number;
  offsetDragX?: number;
  offsetDragY?: number;
  highLight?: number;
  scrollOptions?: ScrollOptionsType;
  waitTimeout?: number;
}

export interface ScrollOptionsType {
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions;
  scrollTimeout?: number;
}
