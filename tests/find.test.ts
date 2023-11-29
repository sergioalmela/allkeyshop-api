import { getProductIds } from '../src/search'

const GAME_NAME = 'FIFA 22'
const WRONG_NAME = '__________'

jest.setTimeout(20000)

describe('Find', () => {
  test('find valid game name and find results', async () => {
    const response = await getProductIds(GAME_NAME)
    expect(response.status).toBe('success')
    expect(response.games).toBeDefined()

    if (response.games !== undefined) {
      expect(response.games.length).toBeGreaterThan(0)

      const game = response.games[0]
      expect(game.id).toBeDefined()
      expect(game.name).toBeDefined()
      expect(game.name).toBe(GAME_NAME)
    }
  })

  test('find invalid game name and find no results', async () => {
    const response = await getProductIds(WRONG_NAME)
    expect(response.status).toBe('success')

    expect(response.games).toBeDefined()

    if (response.games !== undefined) {
      expect(response.games.length).toBe(0)
    }
  })

  test('find valid game name with platform and find results', async () => {
    const gameName = `${GAME_NAME} PS5`
    const response = await getProductIds(gameName)
    expect(response.status).toBe('success')
    expect(response.games).toBeDefined()

    if (response.games !== undefined) {
      expect(response.games.length).toBeGreaterThan(0)

      const game = response.games[0]
      expect(game.id).toBeDefined()
      expect(game.name).toBeDefined()
      expect(game.name).toBe(gameName)
    }
  })
})
