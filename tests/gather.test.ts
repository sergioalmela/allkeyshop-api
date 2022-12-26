import { getGameData } from "../src/gather"
import { defaultOptions } from "../config/constants"

const GAME_NAME = 'FIFA 22'

test('Gather data from a game name', async () => {
    const response = await getGameData(GAME_NAME, defaultOptions.currency, defaultOptions.platform, defaultOptions.shop)
    expect(response!.success).toBe(true)
    expect(response!.offers).toBeDefined()
    expect(response!.merchants).toBeDefined()
    expect(response!.editions).toBeDefined()
    expect(response!.regions).toBeDefined()
})