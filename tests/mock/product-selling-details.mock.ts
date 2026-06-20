export const productSellingDetailsMock = {
  officialMerchants: '47,61',
  history: [
    {
      product_id: 134968119,
      merchant_id: 47,
      edition: '1',
      region: '2',
      last_price: 38.66,
      min_discount_price: 37.37,
      best_discount_code: 'AKSGAME',
      start: '2026-06-19 18:28:55',
      end: '2026-06-19 18:28:55',
    },
    {
      product_id: 132568969,
      merchant_id: 61,
      edition: '1',
      region: '2',
      last_price: 41.19,
      min_discount_price: 38.52,
      best_discount_code: 'AKSHERO',
      start: '2026-06-19 03:02:53',
      end: '2026-06-19 03:02:53',
    },
  ],
  editions: {
    '1': { id: '1', name: 'Standard Edition' },
  },
  regions: {
    '2': { id: '2', name: 'Steam' },
  },
  merchants: {
    '47': { id: '47', name: 'Kinguin' },
    '61': { id: '61', name: 'G2A' },
  },
  lower_official_price: {
    merchant_id: 47,
    price: '38.66',
    last_update: '2026-06-19 18:28:55',
  },
  lower_keyshops_price: {
    merchant_id: 61,
    price: '41.19',
    last_update: '2026-06-19 03:02:53',
  },
}

export const emptyProductSellingDetailsMock = {
  officialMerchants: '',
  history: [],
  editions: {},
  regions: {},
  merchants: {},
  lower_official_price: { merchant_id: 0, price: '0', last_update: '' },
  lower_keyshops_price: { merchant_id: 0, price: '0', last_update: '' },
}
