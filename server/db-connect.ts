import { mongoConnect, mongoDisconnect } from './mongo-db';

import * as Rx from 'rxjs';

export function connect(): Rx.Observable<any> {
  let obs = [];
  obs.push(mongoConnect());

  return obs.length > 1 ? Rx.Observable.merge.apply(this, obs) : obs[0];
}

export function disconnect() {
  mongoDisconnect();
}
