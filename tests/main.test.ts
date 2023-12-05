import { AllkeyshopService } from '../src/allkeyshop'
import { defaultOptions } from '../config/constants'

describe('Allkeyshop', () => {
  it('AKS Main class is a class', () => {
    expect(typeof AllkeyshopService).toBe('function')
  })

  it('AKS Main class has a constructor', () => {
    expect(typeof AllkeyshopService.prototype.constructor).toBe('function')
  })

  it('AKS Main class has a search method', () => {
    expect(typeof AllkeyshopService.prototype.search).toBe('function')
  })

  it('AKS Main class has a search method that returns a promise', () => {
    const allkeyshopService = new AllkeyshopService({
      currency: defaultOptions.currency,
      platform: defaultOptions.platform,
      store: defaultOptions.store,
    })

    expect(allkeyshopService.search('Dark Souls')).toBeInstanceOf(Promise)
  })

  it('AKS Main class with default initialization has a search method that returns a promise', () => {
    const allkeyshopService = new AllkeyshopService()

    expect(allkeyshopService.search('Dark Souls')).toBeInstanceOf(Promise)
  })

  it('AKS Main class has a search method that returns a promise that resolves to an object', async () => {
    const allkeyshopService = new AllkeyshopService({
      currency: defaultOptions.currency,
      platform: defaultOptions.platform,
      store: defaultOptions.store,
    })

    await expect(
      allkeyshopService.search('Dark Souls')
    ).resolves.toBeInstanceOf(Object)
  })
})
