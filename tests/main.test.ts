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
        shop: defaultOptions.shop
    })

    expect(allkeyshopService.search('Dark Souls')).toBeInstanceOf(Promise)
})

