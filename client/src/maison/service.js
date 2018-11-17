import {cmd$, etat$} from "../repartiteur"
import { map,filter } from "rxjs/operators"

etat$.pipe(
  filter(etat => etat.maison.page), 
  filter(etat => !etat.page.content), 
)
.subscribe(etat => {
  const url = `http://localhost/page/${etat.maison.page.nom}`
  Array(etat)
    .filter(etat => etat.maison.get)
    .map(etat => fetch(url)
      .then(reponse => reponse.json())
      .then(page => cmd$.next({type: "SUR_LECTURE", page})))
  Array(etat)
    .filter(etat => etat.maison.post)
    .map(etat => fetch(url, {
        method: "post", 
        body: JSON.stringify(etat.maison.page),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
      .then(reponse => reponse.json())
      .then(page => cmd$.next({type: "SUR_LECTURE", page})))
})
