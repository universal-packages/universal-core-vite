import { SubProcess } from '@universal-packages/sub-process'

import ViteApp from '../src/Vite.universal-core-app'

coreJest.runApp('vite', {
  coreConfigOverride: {
    config: { location: './tests/__fixtures__/config' },
    apps: { location: './tests/__fixtures__' },
    logger: { silence: true }
  }
})

describe(ViteApp, (): void => {
  it('behaves as expected', async (): Promise<void> => {
    expect(SubProcess).toHaveRun({
      command: 'npm',
      args: ['install'],
      workingDirectory: './tests/__fixtures__/client-apps/vite-app'
    })
    expect(SubProcess).toHaveRun({
      command: 'npm',
      args: ['run dev'],
      workingDirectory: './tests/__fixtures__/client-apps/vite-app',
      env: { VITE_CONFIG_FROM_CORE: '{"appsLocation":"./tests/__fixtures__/client-apps","server":{"port":8989,"host":"localhost"}}' }
    })
  })
})
