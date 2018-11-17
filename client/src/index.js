import '../node_modules/materialize-css/dist/js/materialize'
import {render,html} from 'lit-html'
import {defroute} from 'lit-router';
import router from "./router"
import { map } from "rxjs/operators"
import {cmd$, etat$} from "./repartiteur"
import lit from "./lit"

etat$
  .pipe(map(etat => lit(etat)))
  .subscribe(html => render(html, document.body))

router({
  root: [
    defroute ``, (context) => {
      cmd$.next({type: 'SUR_ACCUEIL'})
    }
  ],
  home: [
    defroute `#page`, (context) => {
      window.location.hash = "#page/homepage.md"
    }
  ],
  page: [
    defroute `#page/${'id'}`,
    (context, params) => {
      cmd$.next({type: 'SUR_OUVRIR', id: params.id})
    }
  ],
  //http://localhost:8080/auth
  // #access_token=IhePVG47WzcAAAAAAAMt6uOu_lrGSWMUdWsM715lTwiqpiHnsI7I1wwrJbbQ938b
  // &token_type=bearer
  // &uid=33449300
  // &account_id=dbid%3AAADHdnLK-n5mi_deQb-PgRNDa1a5c_I0QbU
  access: [
    defroute `#access_token=${'accessToken'}&token_type=bearer&uid=.*&account_id=.*`,
    (context, params) => {
      cmd$.next({type: 'SUR_AUTH', accessToken: params.accessToken})
    }
  ]
})
