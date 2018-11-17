import {cmd$, etat$} from "../repartiteur"
import { map,filter } from "rxjs/operators"

etat$.pipe(
  filter(etat => etat.maison.page), 
  filter(etat => !etat.page.content), 
)
.subscribe(etat => {
  Array(etat)
    .map(etat => etat.maison.page.nom)
    .filter(Boolean)
    .map(nom => `http://localhost/page/${nom}`)
    .map(url => fetch(url)
      .then(reponse => reponse.json())
      .then(page => cmd$.next({type: "SUR_LECTURE", page})))
  Array(etat)
    .map(etat => etat.maison.page.contenu)
    .filter(Boolean)
    .map(etat => fetch(etat.url, {
        method: "post", 
        body: JSON.stringify(etat.page),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
      .then(reponse => reponse.json())
      .then(page => cmd$.next({type: "SUR_LECTURE", page})))
})
