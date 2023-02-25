import { getProductIds } from '../src/search'
import { getGameData } from "../src/gather";
import { defaultOptions } from "../config/constants"

const GAME_NAME = 'FIFA 23'
const WRONG_NAME = '__________'

jest.setTimeout(20000)

test('search product and get the IDs', async () => {
  const response = await getProductIds(GAME_NAME)
  expect(response.status).toBe('success')
  expect(response.games).toBeDefined()

  if (response.games !== undefined) {
    expect(response.games.length).toBeGreaterThan(0)

    const game = response.games[0]
    expect(game.id).toBeDefined()
    expect(game.name).toBeDefined()
  }
})

test('search wrong product and get empty games', async () => {
  const response = await getProductIds(WRONG_NAME)
  expect(response.status).toBe('success')

  expect(response.games).toBeDefined()

  if (response.games !== undefined) {
    expect(response.games.length).toBe(0)
  }
})

test('Gather data from a game', async () => {
  const response = await getGameData(GAME_NAME, defaultOptions.currency, defaultOptions.store)

  if (response) {
    expect(response.success).toBe(true)
    expect(response.offers).toBeDefined()
    expect(response.merchants).toBeDefined()
    expect(response.editions).toBeDefined()
    expect(response.regions).toBeDefined()
  }
})

test('Gather data from a game filtering by platform', async () => {
  const response = await getGameData(`${GAME_NAME} PS5`, defaultOptions.currency, defaultOptions.store)

  if (response) {
    expect(response.success).toBe(true)
    expect(response.offers).toBeDefined()
    expect(response.merchants).toBeDefined()
    expect(response.editions).toBeDefined()
    expect(response.regions).toBeDefined()
    expect(response.offers[0].platform).toBe('playstation-store')
  }
})

test('Gather data from a game filtering by store', async () => {
  const response = await getGameData(GAME_NAME, defaultOptions.currency, 'origin')

  if (response) {
    expect(response.success).toBe(true)
    expect(response.offers).toBeDefined()
    expect(response.merchants).toBeDefined()
    expect(response.editions).toBeDefined()
    expect(response.regions).toBeDefined()
    expect(response.offers[0].platform).toBe('origin')
  }
})

test('Gather data from a game and get empty', async () => {
  const response = await getGameData(WRONG_NAME, defaultOptions.currency, defaultOptions.store)

  if (response) {
    expect(response.success).toBe(true)
    expect(response.offers).toBeDefined()
    expect(response.merchants).toBeDefined()
    expect(response.editions).toBeDefined()
    expect(response.regions).toBeDefined()
    expect(response.offers.length).toBe(0)
  }
})