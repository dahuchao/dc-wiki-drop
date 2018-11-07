import './page/page.scss'
import '../node_modules/materialize-css/dist/js/materialize'
import { map } from "rxjs/operators"
import { html, render } from 'lit-html'
import router from "./routes"
import {defroute} from 'lit-router';

import { cmd$, etat$ } from "./repartiteur"
import litPage from './page/page.lit'
import fetchPage from './page/page.fetch'

const app = etat => html`
  <nav>
    <div class="nav-wrapper">
      <a class="brand-logo"><i class="material-icons">dehaze</i>Wiki</a>
      <ul class="right">
        <li><a><i class="material-icons">search</i></a></li>
        <li><a @click="${e => cmd$.next({type: "SUR_EDITER"})}"><i class="material-icons">create</i></a></li>
        <li><a><i class="material-icons">more_vert</i></a></li>
      </ul>
    </div>
  </nav>
  ${litPage(etat)}
`
etat$
  .pipe(map(app))
  .subscribe(html => render(html, document.body))

etat$
  .subscribe(etat => fetchPage(etat))

router({
  home: [defroute``, (context) => {
    window.location.hash = "#page/homepage.md"
  }],
  page: [defroute`#page/${'id'}`, (context, params) => {
    cmd$.next({type: 'SUR_OUVRIR', id: params.id})
  }]
})
