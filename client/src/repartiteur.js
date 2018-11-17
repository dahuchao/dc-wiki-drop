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
      etat.type = "ETAT_ACCUEIL"
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
      etat.type = "ETAT_CHARGEMENT"
      etat.page.url = `http://localhost/page/${cmd.id}`
      return etat
    },
    ["SUR_LECTURE"]: cmd => {
      etat.type = "ETAT_OUVERT"
      etat.page.contenu = cmd.page.contenu
      etat.page.nom = cmd.page.nom
      etat.page.dateMaj = cmd.page.dateMaj
      etat.page.url = null
      return etat
    },
    ["SUR_EDITER"]: cmd => {
      etat.type = "ETAT_EDITION"
      return etat
    },
    ["SUR_ENREGISTRER"]: cmd => {
      etat.type = "ETAT_ENREGISTREMENT"
      etat.page.contenu = cmd.page
      return etat
    },
    ["SUR_ANNULER"]: cmd => {
      etat.type = "ETAT_OUVERT"
      return etat
    }
  }
  etat = (commandes[cmd.type] || commandes["DEFAUT"])(cmd);
  console.log(`etat: ${JSON.stringify(etat)}`)
  console.log(`\\__________________________________`)
  return etat
}, {
  type: "ETAT_ACCUEIL",
  session: {
    dropbox: {
      clientId: null,
      accessToken: null
    }
  },
  page: {
    nom: null,
    contenu: null,
    dateMaj: null,
    url: null
  }
}))

export {cmd$, etat$}