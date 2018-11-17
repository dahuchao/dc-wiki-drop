import './style.scss'
import servicePage from './service'
import litPage from './lit'

export default etat => {
  servicePage(etat)
  return Array(etat)
    .filter(etat => Boolean(etat.page))
    .map(litPage)
}
