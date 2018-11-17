import {Dropbox} from 'dropbox'
import {cmd$, etat$} from "../repartiteur"
import { map,filter } from "rxjs/operators"

etat$.pipe(
    filter(etat => etat.dropbox.clientId), 
    map(etat => new Dropbox({clientId: etat.dropbox.clientId})),
    map(dbx => dbx.getAuthenticationUrl('http://localhost:8080'))
  )
  .subscribe(authUrl => window.location = authUrl)

