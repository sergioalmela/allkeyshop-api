import { getProductIds } from '../src/search'

const GAME_NAME = 'FIFA 22'
const WRONG_NAME = '__________'

jest.setTimeout(20000)

test('search product and get the IDs', async () => {
  const response = await getProductIds(GAME_NAME)
  console.log(response)
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
