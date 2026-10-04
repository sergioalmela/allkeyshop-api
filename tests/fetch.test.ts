import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import * as fileModule from '../src/file'
import type { BasicGameData } from '../src/gather'

jest.mock('../src/file', () => ({ cacheDir: jest.fn() }))

const ONE_DAY_MS = 24 * 60 * 60 * 1000
const games: BasicGameData[] = [{ id: '23918', name: 'Borderlands 3' }]
const payload = { status: 'success', games }

describe('Game catalog cache', () => {
  let directory: string
  let catalogFile: string
  let fetchAllGames: typeof import('../src/fetch').fetchAllGames
  let fetchMock: jest.SpiedFunction<typeof fetch>

  const writeCatalog = (data: unknown, ageMs = 0): void => {
    fs.writeFileSync(catalogFile, JSON.stringify(data))
    const modifiedAt = new Date(Date.now() - ageMs)
    fs.utimesSync(catalogFile, modifiedAt, modifiedAt)
  }

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'allkeyshop-cache-test-'))
    catalogFile = path.join(directory, 'vaks.json')
    jest.mocked(fileModule.cacheDir).mockReturnValue(directory)
    fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify(payload)))
    jest.useFakeTimers({ now: Date.now() })
    jest.isolateModules(() => {
      fetchAllGames = require('../src/fetch').fetchAllGames
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
    fs.rmSync(directory, { recursive: true, force: true })
  })

  it('downloads a missing catalog and reuses it in memory', async () => {
    expect(await fetchAllGames()).toEqual(games)
    expect(await fetchAllGames()).toEqual(games)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(JSON.parse(fs.readFileSync(catalogFile, 'utf8'))).toEqual(payload)
    expect(fs.readdirSync(directory)).toEqual(['vaks.json'])
  })

  it('reads a fresh catalog without a network request', async () => {
    writeCatalog(payload)

    expect(await fetchAllGames()).toEqual(games)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('normalizes numeric upstream ids to the public string type', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          status: 'success',
          games: [{ id: 23918, name: 'Borderlands 3' }],
        })
      )
    )

    expect(await fetchAllGames()).toEqual(games)
    expect(JSON.parse(fs.readFileSync(catalogFile, 'utf8'))).toEqual(payload)
  })

  it('normalizes numeric ids from an existing disk cache', async () => {
    writeCatalog({
      status: 'success',
      games: [{ id: 23918, name: 'Borderlands 3' }],
    })

    expect(await fetchAllGames()).toEqual(games)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('skips zero-id entries without discarding valid games', async () => {
    writeCatalog({
      status: 'success',
      games: [
        ...games,
        { id: 0, name: 'EA Play' },
        { id: '0', name: 'Ubisoft+' },
      ],
    })

    expect(await fetchAllGames()).toEqual(games)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('replaces malformed cache JSON with a downloaded catalog', async () => {
    fs.writeFileSync(catalogFile, '{"status":"success","games":[')

    expect(await fetchAllGames()).toEqual(games)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(JSON.parse(fs.readFileSync(catalogFile, 'utf8'))).toEqual(payload)
  })

  const invalidPayloads = [
    null,
    { status: 'error', games },
    { status: 'success' },
    { status: 'success', games: {} },
    { status: 'success', games: [null] },
    { status: 'success', games: [{ id: '23918' }] },
    { status: 'success', games: [{ id: '23918', name: '  ' }] },
    { status: 'success', games: [{ id: '23918&currency=USD', name: 'X' }] },
    { status: 'success', games: [{ id: -1, name: 'X' }] },
    { status: 'success', games: [{ id: 0, name: 'EA Play' }] },
    { status: 'success', games: [{ id: 1.5, name: 'X' }] },
    {
      status: 'success',
      games: [{ id: Number.MAX_SAFE_INTEGER + 1, name: 'X' }],
    },
  ]

  it.each(invalidPayloads)('recovers from bad cache %#', async (data) => {
    writeCatalog(data)

    expect(await fetchAllGames()).toEqual(games)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it.each(invalidPayloads)('rejects bad responses %#', async (data) => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(data)))

    expect(await fetchAllGames()).toBeUndefined()
    expect(fs.existsSync(catalogFile)).toBe(false)
    expect(await fetchAllGames()).toEqual(games)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('refreshes a catalog at the one-day expiry boundary', async () => {
    writeCatalog(payload, ONE_DAY_MS)

    expect(await fetchAllGames()).toEqual(games)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('rejects a cache timestamp in the future', async () => {
    writeCatalog(payload, -ONE_DAY_MS)

    expect(await fetchAllGames()).toEqual(games)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('expires the memory cache using the original disk timestamp', async () => {
    writeCatalog(payload, ONE_DAY_MS - 1000)
    expect(await fetchAllGames()).toEqual(games)
    expect(fetchMock).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1001)
    const updatedGames = [{ id: '1', name: 'New game' }]
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          status: 'success',
          games: updatedGames,
        })
      )
    )

    expect(await fetchAllGames()).toEqual(updatedGames)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('refreshes a downloaded catalog after one day in memory', async () => {
    expect(await fetchAllGames()).toEqual(games)
    const downloadedAt = new Date(Date.now())
    fs.utimesSync(catalogFile, downloadedAt, downloadedAt)
    jest.advanceTimersByTime(ONE_DAY_MS)
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(payload)))

    expect(await fetchAllGames()).toEqual(games)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('still returns downloaded games when the cache cannot be read', async () => {
    writeCatalog(payload)
    jest.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
      throw new Error('Permission denied')
    })

    expect(await fetchAllGames()).toEqual(games)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('still returns downloaded games when the cache cannot be written', async () => {
    jest.spyOn(fs, 'writeFileSync').mockImplementationOnce(() => {
      throw new Error('Read-only filesystem')
    })

    expect(await fetchAllGames()).toEqual(games)
    expect(await fetchAllGames()).toEqual(games)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('leaves the previous cache intact and cleans up a failed replacement', async () => {
    writeCatalog(payload, ONE_DAY_MS)
    const previousContents = fs.readFileSync(catalogFile, 'utf8')
    jest.spyOn(fs, 'renameSync').mockImplementationOnce(() => {
      throw new Error('Permission denied')
    })

    expect(await fetchAllGames()).toEqual(games)
    expect(fs.readFileSync(catalogFile, 'utf8')).toBe(previousContents)
    expect(fs.readdirSync(directory)).toEqual(['vaks.json'])
  })

  it('shares one download between simultaneous callers', async () => {
    let resolveResponse!: (response: Response) => void
    fetchMock.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveResponse = resolve
      })
    )
    const first = fetchAllGames()
    const second = fetchAllGames()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    resolveResponse(new Response(JSON.stringify(payload)))
    expect(await Promise.all([first, second])).toEqual([games, games])
  })

  it('allows another download after a shared request fails', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network down'))

    const results = await Promise.allSettled([fetchAllGames(), fetchAllGames()])
    expect(results.map((result) => result.status)).toEqual([
      'rejected',
      'rejected',
    ])
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(await fetchAllGames()).toEqual(games)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('rejects HTTP errors without persisting a successful-looking body', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(payload), { status: 503 })
    )

    await expect(fetchAllGames()).rejects.toThrow('HTTP 503')
    expect(fs.existsSync(catalogFile)).toBe(false)
    expect(await fetchAllGames()).toEqual(games)
  })

  it('can retry after an invalid JSON response', async () => {
    fetchMock.mockResolvedValueOnce(new Response('<html>Bad gateway</html>'))

    await expect(fetchAllGames()).rejects.toThrow()
    expect(fs.existsSync(catalogFile)).toBe(false)
    expect(await fetchAllGames()).toEqual(games)
  })
})
