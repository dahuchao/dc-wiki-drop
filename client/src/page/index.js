import './page.scss'

import servicePage from './page.service'
import litPage from './page.lit'

export default etat => {
  servicePage(etat)
  return Array(etat)
    .filter(etat => Boolean(etat.page))
    .map(litPage)
}
