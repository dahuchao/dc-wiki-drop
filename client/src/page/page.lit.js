import { html } from 'lit-html'
import marked from "marked"
import { cmd$ } from "../repartiteur"

export default etat => {
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

  Array(etat)
    .filter(etat => /ETAT_CHARGEMENT/.test(etat.type))
    .map(etat => fetch(etat.url)
      .then(reponse => reponse.json())
      .then(page => cmd$.next({type: "SUR_LECTURE", page})))

  const divPage = document.createElement('div')

  Array(etat)
    .filter(etat => /ETAT_OUVERT/.test(etat.type))
    .map(etat => etat.page)
    .map(page => `<p>${marked(page.contenu)}</p>`)
    .map(page => divPage.innerHTML = page)

  Array(etat)
    .filter(etat => /ETAT_EDITION/.test(etat.type))
    .map(etat => etat.page)
    .map(page => `<textarea id="text" >${page.contenu}</textarea>`)
    .map(page => divPage.innerHTML = page)

  return  html`
    <div class="card">
      <div class="card-content">
        <div id="page">${divPage}</div>
      </div>
      ${/ETAT_EDITION/.test(etat.type)
        ? html`
          <div class="card-action">
            <a @click="${e => {const v = document.getElementById("text").value; cmd$.next({type: "SUR_ENREGISTRER", page: v})}}">Enregistrer</a>
            <a @click="${e => cmd$.next({type: "SUR_ANNULER"})}">Annuler</a>
          </div>`
        : null
      }
    </div>`
} 
