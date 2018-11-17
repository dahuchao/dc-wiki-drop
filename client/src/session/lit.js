import { html } from 'lit-html'
import { cmd$ } from "../repartiteur"

export default etat => html`
    <div class="card-action">
      <a @click="${e => {cmd$.next({type: "SUR_CONNEXION"})}}" class="waves-effect waves-light btn">Connexion</a>
    </div>
  `
