import { directive, html } from 'lit-html'
import { cmd$ } from "../repartiteur"
import marked from "marked"


export default etat => html`
<div id="page">
${etat
  .page
  .map(page => {
    console.log(`page: ${page}`)
    const htm = marked(page);
    const texte = (h) => directive((part) => {
      part.innerHtml = h;
    });
    console.log(`page: ${htm}`)
    return etat.edition
        ? html`<textarea rows="15" cols="50">${page}</textarea>`
        : html`<div id="page">${htm}</div>
        <script>
          var elem = document.getElementById("page");
          elem.innerHTML = ${htm};
        </script>`
    })
  }
</div>
`
