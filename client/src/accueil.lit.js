import '../node_modules/materialize-css/dist/js/materialize'
import { html } from 'lit-html'

export default etat => html`
    <nav>
      <div class="nav-wrapper">
        <a class="brand-logo"><i class="material-icons">dehaze</i>Wiki</a>
        <ul class="right">
          <li><a><i class="material-icons">search</i></a></li>
          <li><a><i class="material-icons">more_vert</i></a></li>
        </ul>
      </div>
    </nav>
    <div class="card">
      <div class="card-content">
        <p>Bienvenu sur le wiki</p>
        <p><a href="#page/homepage.md">premiere page</a></p>
      </div>
    </div>
    `

