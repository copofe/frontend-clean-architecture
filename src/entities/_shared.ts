import type { ZodObject } from 'zod'
import type { Token } from './app.model'
import { type ApiResponse, ImplEntity } from '::/implement'
import { request } from '::/adapter/request'
import { storage } from '::/adapter/storage'
import { session } from '::/adapter/session'

export class Entity extends ImplEntity {
  protected request = request
  protected storage = storage
  protected session = session
  constructor() {
    super()
  }

  async setToken(token: Token) {
    this.updateAuthorization(token)
    await this.storage.setItem('token', token)
  }

  getToken() {
    return this.storage.getItem('token')
  }

  async clearToken() {
    await this.setToken(null)
    this.updateAuthorization(null)
  }

  protected updateAuthorization(token: Token) {
    if (typeof token !== 'string' && token !== null)
      throw new TypeError('Token must be a string or null')

    this.request.headers.Authorization = token === null ? '' : `Bearer ${token.trim()}`
  }

  updateAcceptLanguage(lang: string) {
    this.request.headers['Accept-Language'] = lang
  }
}

/******************************************************************************/

export function extractData<T>(res: ApiResponse<T>): ApiResponse<T>['data']['data'] {
  return res.data.data
}
