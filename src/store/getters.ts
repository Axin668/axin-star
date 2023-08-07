import userModule from './modules/user'
import appModule from './modules/app'

const getters = {
  ...userModule.getters,
  ...appModule.getters
}

export default getters

