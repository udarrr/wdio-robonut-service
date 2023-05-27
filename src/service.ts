import type { Capabilities, Services, Options } from '@wdio/types';
import { RobotConfig } from '..';
import { RobotCommands } from './commands';
import dns from 'dns';

export default class RobotService implements Services.ServiceInstance {
  private _browser?: WebdriverIO.Browser | WebdriverIO.MultiRemoteBrowser;
  private _options: RobotConfig;

  constructor(options: RobotConfig, private _capabilities: Capabilities.RemoteCapability, private _config: Omit<Options.Testrunner, 'capabilities'>) {
    this._options = { ...options };
  }

  beforeSession() {
    try {
      //@ts-ignore
      dns.setDefaultResultOrder('ipv4first');
    } catch {}
  }

  before(caps: Capabilities.RemoteCapability, specs: string[], browser: WebdriverIO.Browser | WebdriverIO.MultiRemoteBrowser) {
    this._browser = browser ? browser : (global as any).browser;

    if (this._browser) {
      new RobotCommands(this._browser as WebdriverIO.Browser, this._options).addCommands();
    }
  }
}
