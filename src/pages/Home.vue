<template>
  <main class="page home-page">
    <section class="hero">
      <div class="hero-content">
        <p class="badge">Live Rates Updated Every 15 Minutes</p>

        <h1>
          Find the Best Time<br />
          <span>to Exchange Currency</span>
        </h1>

        <p class="hero-text">
          Analyse historical exchange rates and receive data-driven timing
          recommendations across major global currencies.
        </p>

        <div class="hero-actions">
          <RouterLink to="/analysis" class="primary-btn">
            Start Analysis
          </RouterLink>

          <RouterLink to="/insights" class="secondary-btn">
            View Market Insights
          </RouterLink>
        </div>

        <div class="hero-stats">
          <div>
            <strong>50+</strong>
            <span>Currency Pairs</span>
          </div>
          <div>
            <strong>5 Years</strong>
            <span>Historical Data</span>
          </div>
          <div>
            <strong>15 Min</strong>
            <span>Rate Updates</span>
          </div>
        </div>
      </div>

      <div class="hero-visual">
        <GlobeAnimation />
      </div>
    </section>

    <section class="ticker-wrap">
      <div class="ticker">
        <span
          v-for="(pair, index) in [...tickerPairs, ...tickerPairs]"
          :key="index"
        >
          {{ pair.name }}
          <strong>{{ pair.rate }}</strong>
          <b :class="pair.change > 0 ? 'gain' : 'loss'">
            {{ pair.change > 0 ? "+" : "" }}{{ pair.change }}%
          </b>
        </span>
      </div>
    </section>

    <section class="quick-check card">
      <h2>Quick Rate Check</h2>
      <p>Select a currency pair to begin your analysis</p>

      <div class="quick-form">
        <div class="input-box">
          <label>From Currency</label>
          <select v-model="fromCurrency">
            <option
              v-for="currency in currencies"
              :key="currency.code"
              :value="currency.code"
            >
              {{ currency.flag }} {{ currency.code }} - {{ currency.name }}
            </option>
          </select>
        </div>

        <button class="swap-box" @click="swapCurrencies">⇄</button>

        <div class="input-box">
          <label>To Currency</label>
          <select v-model="toCurrency">
            <option
              v-for="currency in currencies"
              :key="currency.code"
              :value="currency.code"
            >
              {{ currency.flag }} {{ currency.code }} - {{ currency.name }}
            </option>
          </select>
        </div>

        <RouterLink to="/analysis" class="primary-btn full">
          Analyse {{ fromCurrency }}/{{ toCurrency }} Exchange Rate
        </RouterLink>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <h2>Popular Currency Pairs</h2>
          <p>Most-watched pairs by FX Rate Advisor users</p>
        </div>
      </div>

      <div class="pairs-grid">
        <div v-for="pair in popularPairs" :key="pair.name" class="pair-card">
          <span>{{ pair.flag }} {{ pair.name }}</span>
          <span :class="pair.change > 0 ? 'gain' : 'loss'">
            {{ pair.change > 0 ? "+" : "" }}{{ pair.change }}%
          </span>
        </div>
      </div>
    </section>

    <section class="section how-section">
      <div class="section-center">
        <h2>How It Works</h2>
        <p>Three steps to smarter currency exchange</p>
      </div>

      <div class="steps-grid">
        <div class="info-card">
          <div class="icon-box">◎</div>
          <strong>Choose a Currency Pair</strong>
          <p>
            Select the currencies you want to exchange from our library of 50+
            supported pairs.
          </p>
          <span class="card-number">01</span>
        </div>

        <div class="info-card">
          <div class="icon-box">▥</div>
          <strong>Analyse Historical Rates</strong>
          <p>
            Explore up to 5 years of exchange rate data with interactive charts
            and statistics.
          </p>
          <span class="card-number">02</span>
        </div>

        <div class="info-card">
          <div class="icon-box">✓</div>
          <strong>Receive Smart Recommendation</strong>
          <p>
            Get a data-driven timing score based on where today’s rate sits in
            its historical range.
          </p>
          <span class="card-number">03</span>
        </div>
      </div>
    </section>

    <section class="section features-section">
      <div class="section-center">
        <h2>Why Use FX Rate Advisor?</h2>
        <p>
          Built for international students, migrants, travellers, and investors
          who make regular currency decisions.
        </p>
      </div>

      <div class="features-grid">
        <div class="info-card">
          <div class="icon-box">⌁</div>
          <strong>Historical Analysis</strong>
          <p>
            Access 5+ years of exchange rate data across 50+ currency pairs to
            identify trends and seasonal patterns.
          </p>
        </div>

        <div class="info-card">
          <div class="icon-box">⚡</div>
          <strong>Smart Recommendations</strong>
          <p>
            Data-driven timing scores based on historical percentile analysis —
            know exactly where today’s rate stands.
          </p>
        </div>

        <div class="info-card">
          <div class="icon-box">◇</div>
          <strong>Exchange Simulator</strong>
          <p>
            Model your exchange at today’s rate versus historical highs and lows
            to calculate potential savings.
          </p>
        </div>

        <div class="info-card">
          <div class="icon-box">◎</div>
          <strong>Market Intelligence</strong>
          <p>
            Economic calendar, currency performance heatmap, and sentiment gauge
            to inform your timing decisions.
          </p>
        </div>

        <div class="info-card">
          <div class="icon-box">⌂</div>
          <strong>Rate Alerts</strong>
          <p>
            Set target rates and receive notifications when your desired
            exchange rate becomes available.
          </p>
        </div>

        <div class="info-card">
          <div class="icon-box">☆</div>
          <strong>Multi-Currency Support</strong>
          <p>
            Monitor AUD, USD, EUR, GBP, JPY, CNY and more currencies
            simultaneously from a single dashboard.
          </p>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <h2>Make Smarter Exchange Decisions</h2>
      <p>
        Join users who use FX Rate Advisor to time their currency exchanges
        better.
      </p>

      <RouterLink to="/analysis" class="primary-btn">
        Start Analysing Now →
      </RouterLink>
    </section>

    <footer class="footer">
      <div>
        <div class="brand footer-brand">
          <div class="logo">FX</div>
          <span>FX Rate <strong>Advisor</strong></span>
        </div>
        <p>Data-driven currency exchange timing for global citizens.</p>
      </div>

      <div>
        <h4>Product</h4>
        <p>Features</p>
        <p>Analysis</p>
        <p>Market Insights</p>
        <p>Rate Alerts</p>
        <p>API</p>
      </div>

      <div>
        <h4>Company</h4>
        <p>About</p>
        <p>Blog</p>
        <p>Careers</p>
        <p>Press</p>
        <p>Contact</p>
      </div>

      <div>
        <h4>Legal</h4>
        <p>Privacy Policy</p>
        <p>Terms of Service</p>
        <p>Cookie Policy</p>
        <p>Disclaimer</p>
      </div>
    </footer>
  </main>
</template>

<script setup>
import { onMounted, computed, ref, watch } from "vue";
import { getLatestRates } from "../services/exchangeApi";
import GlobeAnimation from "../components/GlobeAnimation.vue";
import { storeToRefs } from "pinia";
import { useCurrencyStore } from "@/stores/currencyStore";

const currencyStore = useCurrencyStore();
const { fromCurrency, toCurrency } = storeToRefs(currencyStore);

const currencies = [
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰" },
];

const rates = ref({});
const isLoading = ref(false);

const fetchRates = async () => {
  try {
    isLoading.value = true;
    rates.value = await getLatestRates(fromCurrency.value);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchRates();
});

const liveRate = computed(() => {
  const rate = rates.value[toCurrency.value];
  return rate ? rate.toFixed(4) : "Loading...";
});

const swapCurrencies = async () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;

  await fetchRates();
};

watch([fromCurrency, toCurrency], () => {
  currencyStore.setCurrencyPair(fromCurrency.value, toCurrency.value);
  fetchRates();
});

const tickerPairs = [
  { name: "AUD/USD", rate: "0.6431", change: 0.19 },
  { name: "EUR/USD", rate: "1.0862", change: 0.34 },
  { name: "GBP/AUD", rate: "1.9876", change: 0.51 },
  { name: "USD/JPY", rate: "149.23", change: -0.78 },
  { name: "AUD/CNY", rate: "4.6900", change: 0.82 },
  { name: "CAD/USD", rate: "0.7312", change: -0.43 },
];

const popularPairs = [
  { name: "AUD/CNY", flag: "🇦🇺🇨🇳", change: 0.82 },
  { name: "USD/CNY", flag: "🇺🇸🇨🇳", change: -0.23 },
  { name: "EUR/USD", flag: "🇪🇺🇺🇸", change: 0.34 },
  { name: "GBP/AUD", flag: "🇬🇧🇦🇺", change: 0.51 },
  { name: "USD/JPY", flag: "🇺🇸🇯🇵", change: -0.78 },
  { name: "AUD/USD", flag: "🇦🇺🇺🇸", change: 0.19 },
];
</script>
