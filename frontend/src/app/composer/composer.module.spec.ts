import { ComposerModule } from './composer.module';

describe('ComposerModule', () => {
  let composerModule: ComposerModule;

  beforeEach(() => {
    composerModule = new ComposerModule();
  });

  it('should create an instance', () => {
    expect(composerModule).toBeTruthy();
  });
});
