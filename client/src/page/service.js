import {cmd$, etat$} from "../repartiteur"
import { map,filter } from "rxjs/operators"

etat$.pipe(
  filter(etat => etat.page.url), 
  filter(etat => !etat.page.content), 
)
.subscribe(etat => fetch(etat.page.url)
  .then(reponse => reponse.json())
  .then(page => cmd$.next({type: "SUR_LECTURE", page}))
)

etat => {
  Array(etat)
    .filter(etat => /ETAT_CHARGEMENT/.test(etat.type))
    .map(etat => fetch(etat.url)
      .then(reponse => reponse.json())
      .then(page => cmd$.next({type: "SUR_LECTURE", page})))
  Array(etat)
    .filter(etat => /ETAT_ENREGISTREMENT/.test(etat.type))
    .map(etat => fetch(etat.url, {
        method: "post", 
        body: JSON.stringify(etat.page),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
      .then(reponse => reponse.json())
      .then(page => cmd$.next({type: "SUR_LECTURE", page})))
} 
