import {BehaviorSubject} from "rxjs"
import {scan} from "rxjs/operators"
// import { env } from "../environments/environments"

const cmd$ = new BehaviorSubject({type: "DEFAUT"})

const etat$ = cmd$.pipe(scan((etat, cmd) => {
  console.log(` ___________________________________`)
  console.log(`/ commande: ${JSON.stringify(cmd)}`)
  const commandes = {
    ["DEFAUT"]: cmd => {
      return etat
    },
    ["SUR_ACCUEIL"]: cmd => {
      return etat
    },
    ["SUR_CONNEXION"]: cmd => {
      etat.session.dropbox.clientId = "7197bd0eih7r4cb"
      return etat
    },
    ["SUR_AUTH"]: cmd => {
      etat.session.dropbox.accessToken = cmd.accessToken
      return etat
    },
    ["SUR_OUVRIR"]: cmd => {
      etat.maison.page.nom = cmd.id
      return etat
    },
    ["SUR_LECTURE"]: cmd => {
      etat.page  = cmd.page
      etat.maison.page.nom = null
      etat.maison.page.contenu = null
      return etat
    },
    ["SUR_EDITER"]: cmd => {
      etat.page.edition = true
      return etat
    },
    ["SUR_ENREGISTRER"]: cmd => {
      etat.maison.page.contenu = cmd.page
      etat.page.edition = false
      return etat
    },
    ["SUR_ANNULER"]: cmd => {
      etat.page.edition = false
      return etat
    }
  }
  etat = (commandes[cmd.type] || commandes["DEFAUT"])(cmd);
  console.log(`etat: ${JSON.stringify(etat)}`)
  console.log(`\\__________________________________`)
  return etat
}, {
  session: {
    ouverte: true
  },
  dropbox: {
    clientId: null,
    accessToken: null,
    page: {
      nom: null,
      contenu: null
    }
  },
  maison:{
    page: {
      nom: null,
      contenu: null
    }
  },
  page: {
    nom: null,
    contenu: null,
    dateMaj: null,
    edition: false
  }
}))

export {cmd$, etat$}