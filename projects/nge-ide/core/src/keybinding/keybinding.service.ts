import { Injectable } from '@angular/core'
import { fromEvent, Observable } from 'rxjs'
import { hasKeycode } from './keycodes'
import { hasModifierKey } from './modifiers'

class Config {
  readonly target: EventTarget = window
  constructor(init: Partial<Config>) {
    Object.assign(this, init)
  }
}

@Injectable({
  providedIn: 'root',
})
export class KeyBindService {
  match(key: number, modifiers: string[] = [], options?: Config): Observable<KeyboardEvent> {
    const { target: listenOn } = new Config(options || {})
    return new Observable((observer) => {
      const listener$ = fromEvent(listenOn as any, 'keydown') as Observable<KeyboardEvent>
      const sub = listener$.subscribe((event: KeyboardEvent) => {
        if (hasKeycode(event, key) && (!modifiers.length || hasModifierKey(event, ...modifiers))) {
          if (!event.defaultPrevented) {
            event.preventDefault()
            event.stopPropagation()
            observer.next(event)
          }
        }
      })
      return () => {
        sub.unsubscribe()
      }
    })
  }
}
