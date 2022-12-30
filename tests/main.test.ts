import { AllkeyshopService } from "../src/allkeyshop"
import { defaultOptions } from "../config/constants"

test('AKS Main class is a class', () => {
    expect(typeof AllkeyshopService).toBe('function')
})

test('AKS Main class has a constructor', () => {
    expect(typeof AllkeyshopService.prototype.constructor).toBe('function')
})

test('AKS Main class has a search method', () => {
    expect(typeof AllkeyshopService.prototype.search).toBe('function')
})

test('AKS Main class has a search method that returns a promise', () => {
    const allkeyshopService = new AllkeyshopService({
        currency: defaultOptions.currency,
        platform: defaultOptions.platform,
        store: defaultOptions.store
    })

    expect(allkeyshopService.search('Dark Souls')).toBeInstanceOf(Promise)
})

test('AKS Main class with default initialization has a search method that returns a promise', () => {
    const allkeyshopService = new AllkeyshopService()

    expect(allkeyshopService.search('Dark Souls')).toBeInstanceOf(Promise)
})

test('AKS Main class has a search method that returns a promise that resolves to an object', async () => {
    const allkeyshopService = new AllkeyshopService({
        currency: defaultOptions.currency,
        platform: defaultOptions.platform,
        store: defaultOptions.store
    })

    await expect(allkeyshopService.search('Dark Souls')).resolves.toBeInstanceOf(Object)
})