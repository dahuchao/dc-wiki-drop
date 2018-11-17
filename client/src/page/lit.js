import './style.scss'
import { html } from 'lit-html'
import marked from "marked"
import { cmd$ } from "../repartiteur"

export default etat => {
  const divPage = document.createElement('div')
  Array(etat)
    .filter(etat => !etat.page.edition)
    .map(etat => etat.page)
    .map(page => `<p>${marked(page.contenu)}</p>`)
    .map(page => divPage.innerHTML = page)
    Array(etat)
    .filter(etat => etat.page.edition)
    .map(etat => etat.page)
    .map(page => `<textarea id="textPage">${page.contenu}</textarea>`)
    .map(page => divPage.innerHTML = page)
  return  html`
    <nav>
      <div class="nav-wrapper">
        <ul class="left">
          <li><a href="#page"><i class="material-icons">navigate_before</i></a></li>
        </ul>
        <a class="brand-logo">${etat.page.nom}</a>
        <ul class="right">
          <li><a @click="${e => cmd$.next({type: "SUR_EDITER"})}"><i class="material-icons">create</i></a></li>
        </ul>
      </div>
    </nav>
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
        : html`<p id="maj">${Array(etat.page.dateMaj).map(enDate)}</p>`
      }
    </div>`
} 

const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const enDate = date => {
  const d = new Date(date)
  const j = d.toLocaleDateString('fr-FR', options)
  const t = d.toLocaleTimeString('fr-FR')
  return `Mise à jour: ${j} à ${t}`
}
