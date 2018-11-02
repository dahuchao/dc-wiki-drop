import { defroute, routeTo } from 'lit-router';
import { fromEvent, BehaviorSubject } from "rxjs"

export default routes => {
  const hash$ = new BehaviorSubject(window.location.hash)
  
  hash$
    .subscribe(hash => routeTo({}, routes, hash))
  
  fromEvent(window, "hashchange")
    .subscribe(event => hash$.next(window.location.hash))
}
