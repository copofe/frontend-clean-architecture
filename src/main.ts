import { appUsecase } from '::/usecases/app'
import { ApiResponseCode, RequestError } from '::/entities/app.model'
import { userRepo } from '::/repositories/user'
import { useStore } from '::/view/store'
import router from '::/view/router'
import { loadLanguageAsync } from '::/view/plugins/i18n'
import { setupPlugins } from '::/view/plugins'
import App from '::/view/App.vue'
import '::/view/App.css'

function prepare() {
  RequestError.errorHandler = (err) => {
    if (err.message)
      toast.error(err.message)
    // if you use RESTful API, you only need to check if the error code returned equals 401.
    if (err.code === ApiResponseCode.UnAuthorized || err.code === 401)
      userRepo.clearToken().then(() => router.push({ name: 'SignIn' }))
  }
}

async function setup() {
  const app = createApp(App)
  setupPlugins(app)
  app.use(router)

  return app
}

async function initialize() {
  const store = useStore()
  await Promise.all([appUsecase.initialize(), loadLanguageAsync(store.language)])
}

async function bootstrap() {
  prepare()
  const app = await setup()
  await initialize()
  app.mount('#app')
  if (await userRepo.getToken())
    userRepo.getCurrentUser()
}

bootstrap()
