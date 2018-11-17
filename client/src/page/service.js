import { cmd$ } from "../repartiteur"

export default etat => {
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
