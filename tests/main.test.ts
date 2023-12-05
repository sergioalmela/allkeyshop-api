import { AllkeyshopService } from '../src/allkeyshop'

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
})
