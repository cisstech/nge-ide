export class CommandEvent {
  static readonly CHANNEL = 'command'

  readonly args: any[] = []

  // tslint:disable-next-line: variable-name
  private _when: 'before' | 'after' = 'before'

  get when(): 'before' | 'after' {
    return this._when
  }

  readonly id: string | number

  constructor(
    readonly commandId: string,
    readonly label: string,
    ...args: any[]
  ) {
    if (args && args.length) {
      this.args = [...args[0]]
    }
    this.id = Date.now()
  }

  end() {
    this._when = 'after'
  }
}
