import { directive, html } from 'lit-html'
import { cmd$ } from "../repartiteur"
import marked from "marked"


export default etat => html`
<div id="page">
  ${etat
    .page
    .map(page => {
      const divPage = document.createElement('div');
      divPage.innerHTML = marked(page);
      return etat.edition
          ? html`<textarea>${page}</textarea>`
          : html`<div>${divPage}</div>`
    })
  }
</div>
`
