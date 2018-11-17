import './style.scss'
import './service'
import lit from './lit'

export default etat => {
  return Array(etat)
    .filter(etat => Boolean(etat.page))
    .map(lit)
}
