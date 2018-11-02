import { html } from 'lit-html'
import marked from "marked"

export default etat => {
  const divPage = document.createElement('div')
  etat
  .url
  .map(url => fetch(url)
    .then(reponse => reponse.json())
    .then(page => etat.edition
        ? `<textarea>${page.contenu}</textarea>`
        : `<p>${marked(page.contenu)}</p>`
    )
    .then(inner => divPage.innerHTML = inner)
  )
  return  html`<div id="page">${divPage}</div>`
} 
