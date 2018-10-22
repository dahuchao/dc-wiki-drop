import { BehaviorSubject } from "rxjs"
import { scan } from "rxjs/operators"
import mdPage from "./page/page.md"

const cmd$ = new BehaviorSubject({type: "DEFAUT"})

const etat$ = cmd$.pipe(scan((etat, cmd) => {
  console.log(` ___________________________________`)
  console.log(`/ -${JSON.stringify(cmd)}`)
  const commandes = {
    ["DEFAUT"]: cmd => {
      etat.edition = false
      etat.page.push(mdPage)
      return etat
    },
    ["SUR_EDITER"]: cmd => {
      etat.edition = !etat.edition
      return etat
    },
  }
  etat = (commandes[cmd.type] || commandes["DEFAUT"])(cmd);
  console.log(`${JSON.stringify(etat)}`)
  console.log(`\\__________________________________`)
  return etat
}, {
  edition: false,
  page: Array(),
}))

export {cmd$, etat$}