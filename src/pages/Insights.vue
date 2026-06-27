<template>
  <main class="page insights-page">
    <section class="page-title">
      <p class="eyebrow">FX Intelligence Dashboard</p>
      <h1>Market Insights</h1>
      <p>
        Real-time currency intelligence, market sentiment and exchange timing
        signals.
      </p>
    </section>

    <section class="stats-grid">
      <div class="stat-card">
        <span>Best Opportunity</span>
        <strong>{{ bestOpportunity.pair }}</strong>

        <p :class="getChangeClass(bestOpportunity.change)">
          {{ bestOpportunity.change }} this week · Score
          {{ bestOpportunity.score }}/100
        </p>
      </div>

      <div class="stat-card">
        <span>Market Signal</span>
        <strong>{{ marketSignal }}</strong>

        <p>Based on real exchange rate movements</p>
      </div>

      <div class="stat-card">
        <span>Volatility</span>
        <strong>{{ volatilityLevel }}</strong>

        <p>Based on average market movement</p>
      </div>
    </section>

    <section class="card">
      <div class="section-header">
        <div>
          <h2>Currency Performance Heatmap</h2>
          <p>Real exchange rate percentage change vs USD</p>
        </div>

        <div class="tabs">
          <button
            v-for="period in periods"
            :key="period"
            :class="{ active: selectedPeriod === period }"
            @click="selectedPeriod = period"
          >
            {{ period }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading-box">Loading real market data...</div>

      <div v-else-if="error" class="error-box">
        {{ error }}
      </div>

      <div v-else class="heatmap">
        <div class="heat-row header">
          <span>Currency</span>
          <span>1D</span>
          <span>1W</span>
          <span>1M</span>
          <span>3M</span>
          <span>1Y</span>
        </div>

        <div v-for="item in heatmap" :key="item.currency" class="heat-row">
          <span class="currency-name">
            {{ item.flag }} {{ item.currency }}
          </span>

          <span :class="getChangeClass(item.d1)">{{ item.d1 }}</span>
          <span :class="getChangeClass(item.w1)">{{ item.w1 }}</span>
          <span :class="getChangeClass(item.m1)">{{ item.m1 }}</span>
          <span :class="getChangeClass(item.m3)">{{ item.m3 }}</span>
          <span :class="getChangeClass(item.y1)">{{ item.y1 }}</span>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="section-header">
        <div>
          <h2>Top Movers</h2>
          <p>Largest real currency pair changes over the past 7 days</p>
        </div>
      </div>

      <div v-if="loading" class="loading-box">Loading top movers...</div>

      <div v-else-if="error" class="error-box">
        {{ error }}
      </div>

      <div v-else class="movers-grid">
        <div v-for="mover in topMovers" :key="mover.pair" class="mover">
          <div>
            <strong>{{ mover.pair }}</strong>
            <p>{{ mover.description }}</p>
          </div>

          <span :class="getChangeClass(mover.change)">
            {{ mover.change }}
          </span>
        </div>
      </div>
    </section>

    <section class="card sentiment-card">
      <div class="section-header">
        <div>
          <h2>Market Sentiment</h2>
          <p>Exchange timing recommendation based on historical performance</p>
        </div>
      </div>

      <div class="sentiment-box premium-sentiment">
        <div class="responsive-gauge">
          <svg viewBox="0 0 300 180" class="gauge-svg">
            <path class="gauge-bg" d="M 30 150 A 120 120 0 0 1 270 150" />

            <path class="gauge-red" d="M 30 150 A 120 120 0 0 1 90 46" />
            <path class="gauge-orange" d="M 90 46 A 120 120 0 0 1 150 30" />
            <path class="gauge-blue" d="M 150 30 A 120 120 0 0 1 210 46" />
            <path class="gauge-green" d="M 210 46 A 120 120 0 0 1 270 150" />

            <g
              class="gauge-pointer"
              :style="{
                transform: `rotate(${marketSentiment.score * 1.8 - 90}deg)`,
              }"
            >
              <line x1="150" y1="150" x2="150" y2="55" />
            </g>

            <circle cx="150" cy="150" r="10" class="gauge-dot" />

            <text x="30" y="170">0</text>
            <text x="150" y="22" text-anchor="middle">50</text>
            <text x="270" y="170" text-anchor="end">100</text>

            <text x="150" y="130" text-anchor="middle" class="gauge-score-svg">
              {{ marketSentiment.score }}/100
            </text>
          </svg>
        </div>

        <div class="sentiment-copy">
          <div class="sentiment-pill">
            {{ marketSentiment.label }}
          </div>

          <h3>
            {{ selectedPair }}
          </h3>

          <p>{{ marketSentiment.message }}</p>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="section-header">
        <div>
          <h2>Global FX Trading Sessions</h2>
          <p>Live trading session status for selected currencies</p>
        </div>
      </div>

      <div class="events">
        <div v-for="market in marketSessions" :key="market.name" class="event">
          <div>
            <strong>
              {{ market.flag }}
              {{ market.name }}
            </strong>

            <p>
              {{ market.description }}
            </p>
          </div>

          <span
            :class="market.status === 'Open' ? 'impact high' : 'impact low'"
          >
            {{ market.status }}
          </span>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

import { useCurrencyStore } from "@/stores/currencyStore";

const currencyStore = useCurrencyStore();

const periods = ["1D", "1W", "1M", "3M", "1Y"];
const selectedPeriod = ref("1D");
const loading = ref(false);
const error = ref("");
const selectedPair = computed(() => currencyStore.selectedPair);

const baseCurrency = "USD";
const currencies = [
  { code: "EUR", flag: "🇪🇺" },
  { code: "AUD", flag: "🇦🇺" },
  { code: "JPY", flag: "🇯🇵" },
  { code: "GBP", flag: "🇬🇧" },
  { code: "CNY", flag: "🇨🇳" },
  { code: "NZD", flag: "🇳🇿" },
  { code: "CAD", flag: "🇨🇦" },
];
const pairCodes = [
  "AUD",
  "CNY",
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "NZD",
  "CAD",
  "SGD",
  "HKD",
];

const pairs = pairCodes.flatMap((base) =>
  pairCodes
    .filter((quote) => quote !== base)
    .map((quote) => ({
      base,
      quote,
      label: `${base}/${quote}`,
    }))
);

const heatmap = ref([]);
const pairMovers = ref([]);

const apiBase = "/fx-api";

const formatDate = (date) => date.toISOString().split("T")[0];

const subtractDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDate(date);
};

const periodDays = {
  d1: 1,
  w1: 7,
  m1: 30,
  m3: 90,
  y1: 365,
};

const changePercent = (current, previous) => {
  if (!current || !previous) return "0.00%";
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
};

const getChangeClass = (value) => {
  return value.startsWith("-") ? "loss" : "gain";
};

const fetchRatesByDate = async (date = null) => {
  const quotes = currencies.map((c) => c.code).join(",");
  const url = date
    ? `${apiBase}/${date}?from=${baseCurrency}&to=${quotes}`
    : `${apiBase}/latest?from=${baseCurrency}&to=${quotes}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch exchange rate data");
  }

  const data = await response.json();
  return data.rates;
};

const fetchPairRate = async (from, to, date = null) => {
  const url = date
    ? `${apiBase}/${date}?from=${from}&to=${to}`
    : `${apiBase}/latest?from=${from}&to=${to}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch pair exchange rate data");
  }

  const data = await response.json();
  return data.rates[to];
};

const loadInsights = async () => {
  loading.value = true;
  error.value = "";

  try {
    const currentRates = await fetchRatesByDate();

    const historicalRates = {};

    await Promise.all(
      Object.entries(periodDays).map(async ([key, days]) => {
        historicalRates[key] = await fetchRatesByDate(subtractDays(days));
      })
    );

    heatmap.value = currencies.map((currency) => {
      const code = currency.code;

      return {
        flag: currency.flag,
        currency: code,
        d1: changePercent(currentRates[code], historicalRates.d1[code]),
        w1: changePercent(currentRates[code], historicalRates.w1[code]),
        m1: changePercent(currentRates[code], historicalRates.m1[code]),
        m3: changePercent(currentRates[code], historicalRates.m3[code]),
        y1: changePercent(currentRates[code], historicalRates.y1[code]),
      };
    });

    pairMovers.value = await Promise.all(
      pairs.map(async (pair) => {
        const current = await fetchPairRate(pair.base, pair.quote);
        const previous = await fetchPairRate(
          pair.base,
          pair.quote,
          subtractDays(7)
        );

        return {
          pair: pair.label,
          change: changePercent(current, previous),
          description: `${pair.label} 7-day movement`,
        };
      })
    );
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const marketSentiment = computed(() => {
  const selectedPairMover = pairMovers.value.find(
    (item) => item.pair === selectedPair.value
  );

  if (!selectedPairMover) {
    return {
      label: "Loading",
      score: 50,
      message: "Loading market conditions...",
    };
  }

  const weekly = parseFloat(selectedPairMover.change);

  const avgVolatility =
    pairMovers.value.reduce(
      (sum, item) => sum + Math.abs(parseFloat(item.change)),
      0
    ) / pairMovers.value.length;

  let score = 50;

  score += weekly * 8;
  score -= avgVolatility * 4;

  score = Math.max(0, Math.min(100, Math.round(score)));

  let label;
  let message;

  if (score >= 80) {
    label = "Excellent";
    message =
      "AUD shows strong momentum and market conditions are highly favourable for exchange.";
  } else if (score >= 65) {
    label = "Favourable";
    message =
      "Current market conditions suggest a relatively good exchange opportunity.";
  } else if (score >= 50) {
    label = "Neutral";
    message =
      "Exchange conditions are balanced with no strong directional signal.";
  } else {
    label = "Wait and Watch";
    message =
      "High uncertainty or weak momentum suggests waiting for better conditions.";
  }

  return {
    score,
    label,
    message,
  };
});

const topMovers = computed(() => {
  return [...pairMovers.value]
    .sort(
      (a, b) => Math.abs(parseFloat(b.change)) - Math.abs(parseFloat(a.change))
    )
    .slice(0, 6);
});

const bestOpportunity = computed(() => {
  if (!pairMovers.value.length) {
    return {
      pair: "--",
      change: "--",
      score: "--",
    };
  }

  return [...pairMovers.value]
    .map((item) => {
      const weeklyChange = Number.parseFloat(item.change) || 0;

      let score = 50;

      // Positive movement = stronger opportunity signal
      score += weeklyChange * 8;

      // Avoid extreme volatility
      if (Math.abs(weeklyChange) > 4) {
        score -= 12;
      } else if (Math.abs(weeklyChange) > 2) {
        score -= 6;
      }

      score = Math.max(0, Math.min(100, Math.round(score)));

      return {
        ...item,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)[0];
});

const marketSignal = computed(() => {
  return marketSentiment.value?.label ?? "Loading";
});

const volatilityLevel = computed(() => {
  if (!pairMovers.value.length) return "Loading";

  const avg =
    pairMovers.value.reduce(
      (sum, item) => sum + Math.abs(parseFloat(item.change)),
      0
    ) / pairMovers.value.length;

  if (avg >= 3) return "High";
  if (avg >= 1) return "Medium";

  return "Low";
});

const marketSessions = computed(() => {
  const hour = new Date().getUTCHours();

  const sessions = {
    AUD: [
      {
        flag: "🇦🇺",
        name: "Sydney Session",
        open: 22,
        close: 7,
        description: "Asia-Pacific trading activity",
      },
    ],
    USD: [
      {
        flag: "🇺🇸",
        name: "New York Session",
        open: 13,
        close: 22,
        description: "Major USD liquidity",
      },
    ],
    JPY: [
      {
        flag: "🇯🇵",
        name: "Tokyo Session",
        open: 0,
        close: 9,
        description: "Asian market activity",
      },
    ],
    GBP: [
      {
        flag: "🇬🇧",
        name: "London Session",
        open: 8,
        close: 17,
        description: "Largest FX trading centre",
      },
    ],
    EUR: [
      {
        flag: "🇪🇺",
        name: "European Session",
        open: 8,
        close: 17,
        description: "Eurozone market liquidity",
      },
    ],
    CNY: [
      {
        flag: "🇨🇳",
        name: "Shanghai Market",
        open: 1,
        close: 7,
        description: "Mainland China market activity",
      },
      {
        flag: "🇭🇰",
        name: "Hong Kong CNH Market",
        open: 1,
        close: 8,
        description: "Offshore RMB liquidity",
      },
    ],
  };

  const isOpen = (open, close) =>
    open < close ? hour >= open && hour < close : hour >= open || hour < close;

  return [currencyStore.fromCurrency, currencyStore.toCurrency]
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index)
    .flatMap((code) => sessions[code] || [])
    .map((market) => ({
      ...market,
      status: isOpen(market.open, market.close) ? "Open" : "Closed",
    }));
});

onMounted(async () => {
  await loadInsights();
});
</script>
