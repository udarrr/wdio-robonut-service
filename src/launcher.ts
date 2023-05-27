import type { Capabilities, Services, Options } from '@wdio/types';

export default class CrossBrowserTestingLauncher implements Services.ServiceInstance {
  constructor(private _options: {} & Options.Testrunner, private _capabilities: Capabilities.RemoteCapability, private _config: Omit<Options.Testrunner, 'capabilities'>) {}

  async onPrepare() {}

  onComplete() {}
}
