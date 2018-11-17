import 'materialize-css'
import {html} from 'lit-html'
import {cmd$} from "./repartiteur"
import session from  './session/index'

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
      </div>
      ${etat.session.dropbox.accessToken
        ? html`
            <div>
              <a href="#page">page d'accueil</a>
            </div>`
        : session(etat)
      }
    </div>
    `
