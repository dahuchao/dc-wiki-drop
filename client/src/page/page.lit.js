import { html } from 'lit-html'
import marked from "marked"
import { cmd$ } from "../repartiteur"

export default etat => {
  const divPage = document.createElement('div')
  Array(etat)
    .filter(etat => /ETAT_OUVERT/.test(etat.type))
    .map(etat => etat.page)
    .map(page => `<p>${marked(page.contenu)}</p>`)
    .map(page => divPage.innerHTML = page)
  Array(etat)
    .filter(etat => /ETAT_EDITION/.test(etat.type))
    .map(etat => etat.page)
    .map(page => `<textarea id="textPage">${page.contenu}</textarea>`)
    .map(page => divPage.innerHTML = page)
  return  html`
    <div class="card">
      <div class="card-content">
        <div id="page">${divPage}</div>
      </div>
      ${/ETAT_EDITION/.test(etat.type)
        ? html`
          <div class="card-action">
            <a @click="${e => {cmd$.next({type: "SUR_ENREGISTRER", page: document.getElementById("textPage").value})}}" class="waves-effect waves-light btn">Enregistrer</a>
            <a @click="${e => cmd$.next({type: "SUR_ANNULER"})}" class="waves-effect waves-light btn">Annuler</a>
          </div>`
        : null
      }
    </div>`
} 
