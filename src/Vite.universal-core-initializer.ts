import { CoreInitializer } from '@universal-packages/core'
import { Logger } from '@universal-packages/logger'
import { SubProcess } from '@universal-packages/sub-process'

import { DEFAULT_NAME } from './DEFAULT_NAME'
import { LOG_CONFIGURATION } from './LOG_CONFIGURATION'

export default class ViteInitializer extends CoreInitializer {
  public static readonly initializerName = 'vite'
  public static readonly description: string = 'Vite core initializer'

  public readonly templatesLocation: string = `${__dirname}/templates`

  private readonly viteAppName: string
  private readonly viteTemplate: string
  private currentSubProcess: SubProcess
  private stopping = false

  constructor(args: any, logger: Logger) {
    super(args, logger)

    this.viteAppName = args.name || DEFAULT_NAME
    this.viteTemplate = args.template || this.typescript ? 'react-ts' : 'react'
    this.templateVariables.appsLocation = `${this.sourceLocation}/client-apps`
  }

  public async afterTemplatePopulate(): Promise<void> {
    core.developer.terminalPresenter.setProgressPercentage(20)

    this.currentSubProcess = core.developer.terminalPresenter.setSubProcess({ command: 'mkdir', args: ['-p', 'tmp'] })
    await this.currentSubProcess.run()

    if (this.stopping) return

    core.developer.terminalPresenter.increaseProgressPercentageBy(2)

    this.logger.log({ level: 'INFO', title: 'Requesting vite initialization', message: 'Executing npm create vite under the hood', category: 'VITE' }, LOG_CONFIGURATION)

    core.developer.terminalPresenter.startProgressIncreaseSimulation(78, 90000)

    this.currentSubProcess = core.developer.terminalPresenter.setSubProcess({
      command: 'npm',
      args: ['create', 'vite@latest', this.viteAppName, '--', '--template', this.viteTemplate],
      workingDirectory: './tmp'
    })
    await this.currentSubProcess.run()

    core.developer.terminalPresenter.finishProgressIncreaseSimulation()

    if (this.stopping) return

    this.logger.log({ level: 'INFO', title: 'Reconfiguring...', message: 'Reconfiguring to work as a universal packages module', category: 'VITE' }, LOG_CONFIGURATION)

    this.currentSubProcess = core.developer.terminalPresenter.setSubProcess({ command: 'mkdir', args: ['-p', `${this.sourceLocation}/client-apps/${this.viteAppName}`] })
    await this.currentSubProcess.run()

    if (this.stopping) return

    this.currentSubProcess = core.developer.terminalPresenter.setSubProcess({
      command: 'rm',
      args: ['-rf', `./tmp/${this.viteAppName}/.git`]
    })
    await this.currentSubProcess.run()
    this.currentSubProcess = core.developer.terminalPresenter.setSubProcess({
      command: 'rm',
      args: [`./tmp/${this.viteAppName}/vite.config.${this.viteTemplate.includes('-ts') ? 'ts' : 'js'}`]
    })
    await this.currentSubProcess.run()
    this.currentSubProcess = core.developer.terminalPresenter.setSubProcess({
      command: 'rsync',
      args: ['-av', `./tmp/${this.viteAppName}`, `${this.sourceLocation}/client-apps`]
    })
    await this.currentSubProcess.run()
    this.currentSubProcess = core.developer.terminalPresenter.setSubProcess({
      command: 'cp',
      args: [`${__dirname}/vite.config.template`, `${this.sourceLocation}/client-apps/${this.viteAppName}/vite.config.${this.viteTemplate.includes('-ts') ? 'ts' : 'js'}`]
    })
    await this.currentSubProcess.run()

    if (this.stopping) return

    this.logger.log({ level: 'INFO', title: 'Finishing up...', message: 'Finishing up the vite reconfiguration', category: 'VITE' }, LOG_CONFIGURATION)

    core.developer.terminalPresenter.increaseProgressPercentageBy(5)

    this.currentSubProcess = core.developer.terminalPresenter.setSubProcess({ command: 'rm', args: ['-rf', `./tmp/${this.viteAppName}`] })
    await this.currentSubProcess.run()

    core.developer.terminalPresenter.setProgressPercentage(100)
  }

  public async abort(): Promise<void> {
    this.stopping = true

    if (this.currentSubProcess) await this.currentSubProcess.kill()
    core.developer.terminalPresenter.finishProgressIncreaseSimulation()

    this.currentSubProcess = core.developer.terminalPresenter.setSubProcess({ command: 'rm', args: ['-rf', `./tmp/${this.viteAppName}`] })
    await this.currentSubProcess.run()
  }
}
