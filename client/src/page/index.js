import './page.scss'
import { map } from "rxjs/operators"
import { render } from 'lit-html'

import { cmd$, etat$ } from "./page.repartiteur"
import servicePage from './page.service'
import litPage from './page.lit'

etat$
  .pipe(map(litPage))
  .subscribe(html => render(html, document.body))
etat$
  .subscribe(servicePage)

export default page => cmd$.next({type: 'SUR_OUVRIR', id: page})
