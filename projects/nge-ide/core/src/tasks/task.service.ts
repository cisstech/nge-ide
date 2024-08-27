import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators'
import { IContribution } from '../contributions/index'
import { ITask } from './task'

@Injectable()
export class TaskService implements IContribution {
  private static NEXT_ID = 0

  private readonly registry = new BehaviorSubject<ITask[]>([])

  readonly id = 'workbench.contrib.task-service'

  readonly current = this.registry.asObservable().pipe(map((tasks) => tasks.pop()))

  activate() {
    TaskService.NEXT_ID = 0
  }

  deactivate() {
    this.registry.next([])
  }

  run(text: string = '...'): ITask {
    const task = {
      id: TaskService.NEXT_ID++,
      text,
      end: () => {
        this.registry.next(this.registry.getValue().filter((t) => (t as any).id !== task.id))
      },
    }
    this.registry.next([...this.registry.value, task])
    return task
  }
}
