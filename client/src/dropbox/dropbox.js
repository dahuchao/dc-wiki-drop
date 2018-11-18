import { Dropbox } from 'dropbox'
import { cmd$, etat$ } from "../repartiteur"
import { map,filter } from "rxjs/operators"

etat$.subscribe(etat => {
  const url = `http://localhost/page/${etat.maison.page.nom}`
  Array(etat)
    .filter(etat => etat.dropbox.clientId)
    .map(etat => etat.dropbox.clientId)
    .map(clientId => new Dropbox({clientId}))
    .map(dbx => dbx.getAuthenticationUrl(location.origin))
  Array(etat)
    .filter(etat => etat.dropbox.get)
    .map(etat => etat.dropbox.accessToken)
    .map(accessToken => new Dropbox({accessToken}))
    .map(dbx => dbx.sharingGetSharedLinkFile(url)
      .then(reponse => reponse.json())
      .then(page => cmd$.next({type: "SUR_LECTURE", page})))
  Array(etat)
    .filter(etat => etat.dropbox.post)
    .map(etat => etat.dropbox.accessToken)
    .map(accessToken => new Dropbox({accessToken}))
    .map(etat => fetch(url, {
        method: "post",
        body: JSON.stringify(etat.dropbox.page),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
      .then(reponse => reponse.json())
      .then(page => cmd$.next({type: "SUR_LECTURE", page})))
})
