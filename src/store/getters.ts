import managerModule from './modules/manager'
import appModule from './modules/app'

const getters = {
  ...managerModule.getters,
  ...appModule.getters
}

export default getters

