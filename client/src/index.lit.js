import 'materialize-css'
import './style.scss'
import { html } from 'lit-html'
import litSession from  './session.lit'
import litPage from  './page.lit'

export default etat => etat.page.contenu
  ? litPage(etat)
  : html`
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
        ${etat.session.ouverte
          ? html`<a href="#page">page d'accueil</a>`
          : litSession(etat)
        }
      </div>
    </div>
    `
