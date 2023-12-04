export const productSellingDetailsMock = {
  editions: {
    '1': {
      id: '1',
      name: 'Standard',
    },
    '7': {
      id: '7',
      name: 'Deluxe',
    },
  },
  merchants: {
    '1': {
      aggregateRating: {
        count: 46,
        value: 4.8,
      },
      giftCardReminder: {
        discountAmount: 5,
        url: 'https://www.allkeyshop.com/blog/buy-steam-gift-card-cd-key-compare-prices/',
      },
      id: '1',
      logoSlug: 'steam',
      name: 'Steam',
      paymentMethods: ['card', 'paypal'],
      reviewUrl: 'https://www.allkeyshop.com/blog/review/steam/',
      searchable: 1,
      types: 'Official Store',
    },
    '2': {
      aggregateRating: {
        count: 10,
        value: 4.9,
      },
      giftCardReminder: null,
      id: '2',
      logoSlug: 'dlgamer',
      name: 'Dlgamer EU',
      paymentMethods: ['card', 'paypal'],
      reviewUrl:
        'https://www.allkeyshop.com/blog/review/dlgamer-eu-review-coupon-facebook-for-steam-download/',
      searchable: 1,
      types: 'Official Store',
    },
    '700': {
      aggregateRating: {
        count: 61,
        value: 4.84,
      },
      giftCardReminder: null,
      id: '700',
      logoSlug: 'gamesplanet',
      name: 'Gamesplanet DE',
      paymentMethods: ['card', 'paypal', 'crypto'],
      reviewUrl:
        'https://www.allkeyshop.com/blog/review/gamesplanet-de-coupon-facebook-for-steam-download/',
      searchable: 1,
      types: 'Official Store',
    },
  },
  offers: [
    {
      affiliateUrl: 'https://www.testurl.com',
      edition: '1',
      id: 134977773,
      isActive: true,
      merchant: '557',
      platform: 'steam',
      price: {
        eur: {
          bestCoupon: {
            code: 'AKS10',
            discountStrategy: '%',
            discountValue: '10.00',
            isCashback: false,
          },
          currency: 'eur',
          price: 24.74,
          priceWithoutCoupon: 27.49,
        },
      },
      region: '9',
      stock: 'InStock',
    },
    {
      affiliateUrl: 'https://www.testurl.com',
      edition: '1',
      id: 135023156,
      isActive: true,
      merchant: '408',
      platform: 'steam',
      price: {
        eur: {
          bestCoupon: {
            code: '14%: AKS14',
            discountStrategy: '%',
            discountValue: '14.00',
            isCashback: false,
          },
          currency: 'eur',
          price: 25.09,
          priceWithoutCoupon: 29.17,
        },
      },
      region: '9',
      stock: 'InStock',
    },
    {
      affiliateUrl: 'https://www.testurl.com',
      edition: '1',
      id: 134470740,
      isActive: true,
      merchant: '47',
      platform: 'PS5',
      price: {
        eur: {
          bestCoupon: {
            code: '12%: AKS12',
            discountStrategy: '%',
            discountValue: '12.00',
            isCashback: false,
          },
          currency: 'eur',
          price: 25.71,
          priceWithoutCoupon: 29.22,
        },
      },
      region: '9',
      stock: 'InStock',
    },
  ],
  regions: {
    '2': {
      filterName: 'STEAM GLOBAL',
      id: '2',
      name: 'GLOBAL',
    },
    '9': {
      filterName: 'STEAM EU',
      id: '9',
      name: 'EUROPE',
    },
    '25': {
      filterName: 'STEAM GIFT GLOBAL',
      id: '25',
      name: 'GIFT',
    },
    '259': {
      filterName: 'STEAM GIFT EU',
      id: '259',
      name: 'GIFT EU',
    },
    steamemea: {
      filterName: 'STEAM EMEA',
      id: 'steamemea',
      name: 'EMEA',
    },
    steamrow: {
      filterName: 'STEAM ROW',
      id: 'steamrow',
      name: 'ROW',
    },
  },
  success: true,
}

export const emptyProductSellingDetailsMock = {
  editions: {},
  merchants: {},
  offers: [],
  regions: {},
  success: true,
}
