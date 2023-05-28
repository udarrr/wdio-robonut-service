import { straightTo, centerOf, randomPointIn, imageResource, loadImage, saveImage } from '@nut-tree/nut-js';
import { RobotCommands, RobotConfig } from '../index';
import { Options } from '@wdio/types';

export class RobotDirect extends RobotCommands {
  constructor(config: (RobotConfig & Options.Testrunner) | RobotConfig) {
    super(null, config);
  }

  public async instance() {
    return {
      rect: { straightTo: straightTo, centerOf: centerOf, randomPointIn: randomPointIn },
      mouse: this.mouse,
      screen: this.screen,
      keyboard: this.keyboard,
      windowApiProvider: this.windowApiProvider,
      clipboard: { sys: this.sysClipboard, virt: this.virtClipboard },
      imageFinder: { finder: this.finder, reader: { imageResource: imageResource, loadImage: loadImage, saveImage: saveImage } },
    };
  }

  async addCommands() {
    throw new Error('Not implemented for RobotDirect only for RobotCommands');
  }
}
