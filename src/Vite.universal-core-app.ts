import { CoreApp } from '@universal-packages/core'
import { EmittedEvent } from '@universal-packages/event-emitter'
import { SubProcess } from '@universal-packages/sub-process'
import { constantCase } from 'change-case'
import fs from 'fs'

import { DEFAULT_NAME } from './DEFAULT_NAME'

export default class ViteApp extends CoreApp {
  public static readonly appName = 'vite'
  public static readonly description = 'Vite core app wrapper for development'
  public static readonly allowAppWatch = false
  public static readonly allowLoadModules = false
  public static readonly allowLoadEnvironments = false

  private viteSubProcess: SubProcess
  private existentViteApps: string[]
  private viteAppName: string

  async prepare() {
    this.existentViteApps = this.getDirectoryNamesFromPath(this.config.appsLocation)
    this.viteAppName = this.args.name || DEFAULT_NAME
  }

  public async run(): Promise<void> {
    if (!this.existentViteApps.includes(this.viteAppName)) {
      if (this.existentViteApps.length === 0) {
        throw new Error(`No apps found in ${this.config.appsLocation}`)
      } else {
        throw new Error(`The vite app ${this.viteAppName} does not exist\n Available apps: ${this.existentViteApps.join(', ')}`)
      }
    }

    await core.developer.terminalPresenter.runSubProcess({
      command: 'npm',
      args: ['install'],
      workingDirectory: `${this.config.appsLocation}/${this.viteAppName}`
    })

    this.viteSubProcess = core.developer.terminalPresenter.setSubProcess({
      command: 'npm',
      args: ['run dev'],
      env: { VITE_CONFIG_FROM_CORE: JSON.stringify(this.config) },
      workingDirectory: `${this.config.appsLocation}/${this.viteAppName}`
    })

    this.viteSubProcess.on('error', (event: EmittedEvent) => {
      if (this.viteSubProcess.status !== 'stopped') {
        this.logger.log({ level: 'ERROR', error: event.error })
      }
    })

    this.viteSubProcess.on('stdout', (event: EmittedEvent) => {
      const message = (event.payload.data || '').trim()
      const queryLines = ['Compiled successfully!', 'Compiling...', 'webpack compiled successfully']

      if (queryLines.some((queryLine) => message.includes(queryLine) && !message.includes('browser'))) {
        core.developer.terminalPresenter.setScriptOutput(message)
      } else {
        this.logger.log({ level: 'INFO', message })
      }
    })

    await this.viteSubProcess.run()
  }

  public async stop(): Promise<void> {
    await this.viteSubProcess.kill()
  }

  private getDirectoryNamesFromPath(path): string[] {
    return fs
      .readdirSync(path, {
        withFileTypes: true
      })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
  }
}
