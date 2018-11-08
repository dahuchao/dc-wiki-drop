import '../node_modules/materialize-css/dist/js/materialize'
import { html, render } from 'lit-html'
import router from "./routes"
import {defroute} from 'lit-router';

import page from './page/index'

const app = html`
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

router({
  root: [defroute``, (context) => {
    render(app, document.body)
  }],
  home: [defroute`#page`, (context) => {
    window.location.hash = "#page/homepage.md"
  }],
  page: [defroute`#page/${'id'}`, (context, params) => {
    page(params.id)
  }]
})
