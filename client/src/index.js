import '../node_modules/materialize-css/dist/js/materialize'
import {render,html} from 'lit-html'
import {defroute} from 'lit-router';
import router from "./router"
import { map } from "rxjs/operators"
import {cmd$, etat$} from "./repartiteur"
import litAccueil from "./accueil.lit"
import litPage from './page/index'

const app = etat =>  html`
  ${Array(etat)
      .filter(etat => /ETAT_ACCUEIL/.test(etat.type))
      .map(litAccueil)}
  ${Array(etat)
      .map(litPage)}
  `

etat$
  .pipe(map(app))
  .subscribe(html => render(html, document.body))

router({
  root: [
    defroute ``, (context) => {
      cmd$.next({type: 'SUR_ACCUEIL'})
      // render(app, document.body)
    }
  ],
  home: [
    defroute `#page`, (context) => {
      window.location.hash = "#page/homepage.md"
    }
  ],
  page: [
    defroute `#page/${ 'id'}`,
    (context, params) => {
      // page(params.id)
      cmd$.next({type: 'SUR_OUVRIR', id: params.id})
    }
  ]
})
