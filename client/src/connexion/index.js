import { map } from "rxjs/operators"
import { render } from 'lit-html'

import './connexion.scss'
import { cmd$, etat$ } from "./connexion.repartiteur"
import service from './connexion.service'
import lit from './connexion.lit'

etat$
  .pipe(map(lit))
  .subscribe(html => render(html, document.body))
etat$
  .subscribe(service)

export default page => cmd$.next({type: 'SUR_OUVRIR', id: page})
