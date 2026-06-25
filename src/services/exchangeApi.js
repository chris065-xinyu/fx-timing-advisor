const API_KEY = import.meta.env.VITE_FREECURRENCY_API_KEY
const FREE_CURRENCY_URL = 'https://api.freecurrencyapi.com/v1/latest'
const FRANKFURTER_URL = '/frankfurter'

export async function getLatestRates(baseCurrency = 'AUD') {
  const response = await fetch(
    `${FREE_CURRENCY_URL}?apikey=${API_KEY}&base_currency=${baseCurrency}`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch latest exchange rates')
  }

  const data = await response.json()
  return data.data
}

export async function getHistoricalRates(fromCurrency, toCurrency, startDate, endDate) {
  const response = await fetch(
    `${FRANKFURTER_URL}/${startDate}..${endDate}?from=${fromCurrency}&to=${toCurrency}`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch historical exchange rates')
  }

  const data = await response.json()

  return Object.entries(data.rates).map(([date, rate]) => ({
    date,
    rate: rate[toCurrency]
  }))
}