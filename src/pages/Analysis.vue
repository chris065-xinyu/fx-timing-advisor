<template>
  <main class="page">
    <section class="page-title">
      <h1>Exchange Rate Analysis</h1>
      <p>
        Historical data and timing recommendations for your selected currency
        pair
      </p>
    </section>

    <section class="card analysis-top">
      <div class="selector-area">
        <label>Amount</label>
        <input
          v-model.number="amount"
          class="amount-field"
          type="number"
          min="0"
          placeholder="0"
        />

        <label>From</label>
        <select v-model="fromCurrency" class="select-box">
          <option
            v-for="currency in currencies"
            :key="currency.code"
            :value="currency.code"
          >
            {{ currency.flag }} {{ currency.code }} - {{ currency.name }}
          </option>
        </select>

        <button class="swap-box" @click="swapCurrencies">⇄</button>

        <label>To</label>
        <select v-model="toCurrency" class="select-box">
          <option
            v-for="currency in currencies"
            :key="currency.code"
            :value="currency.code"
          >
            {{ currency.flag }} {{ currency.code }} - {{ currency.name }}
          </option>
        </select>
      </div>

      <div class="live-rate-box">
        <p>Live Exchange Rate</p>

        <h2>
          1 {{ fromCurrency }} =
          <span> {{ formattedLiveRate }} {{ toCurrency }} </span>
        </h2>

        <h3 class="converted-result">
          {{ amount.toLocaleString() }} {{ fromCurrency }}
          =
          {{ convertedAmount }} {{ toCurrency }}
        </h3>

        <small v-if="isLoading">Updating live market data...</small>
        <small v-else>Live market estimate · Updated just now</small>
      </div>
    </section>

    <section class="recommendation-wide">
      <div class="recommendation-content">
        <div class="recommendation-header">
          <h2>{{ recommendationTitle }}</h2>
          <span class="recommendation-badge">
            {{ selectedRange }} Analysis
          </span>
        </div>

        <p>
          The current {{ fromCurrency }}/{{ toCurrency }} rate is at the
          <strong>{{ percentile }}th percentile</strong>
          of the selected {{ selectedRange }} historical range.
        </p>

        <p>
          {{ recommendationSummary }}
        </p>

        <div class="percentile-bar">
          <div class="bar-labels">
            <span>Historically Low</span>
            <span>Current: {{ percentile }}th pct</span>
            <span>Historically High</span>
          </div>

          <div class="bar-track">
            <div class="bar-fill" :style="{ width: percentile + '%' }"></div>
            <div class="bar-dot" :style="{ left: percentile + '%' }"></div>
          </div>
        </div>
      </div>

      <div class="percent-circle">{{ percentile }}%</div>
    </section>

    <section class="card chart-card">
      <div class="chart-header">
        <div>
          <h2>{{ fromCurrency }}/{{ toCurrency }} Historical Rate</h2>
          <p>
            {{ selectedRange }} historical data · Average and most frequent rate
            shown as dashed lines
          </p>
        </div>

        <div class="tabs">
          <button
            v-for="range in ['5Y', '2Y', '1Y', '6M']"
            :key="range"
            :class="{ active: selectedRange === range }"
            @click="selectedRange = range"
          >
            {{ range }}
          </button>
        </div>
      </div>

      <div class="real-chart">
        <p v-if="isHistoryLoading">Loading historical data...</p>
        <VChart v-else class="echart" :option="chartOption" autoresize />
      </div>
    </section>

    <section class="stats-row">
      <div class="card stat-card">
        <p>Current Rate</p>
        <h3>{{ formattedLiveRate }}</h3>
        <span>1 {{ fromCurrency }}</span>
      </div>

      <div class="card stat-card">
        <p>{{ selectedRange }} Low</p>
        <h3>{{ periodLowText }}</h3>
        <span>Historical floor</span>
      </div>

      <div class="card stat-card">
        <p>{{ selectedRange }} High</p>
        <h3 class="blue">{{ periodHighText }}</h3>
        <span>Historical ceiling</span>
      </div>

      <div class="card stat-card">
        <p>{{ selectedRange }} Average</p>
        <h3 class="orange">{{ averageRateText }}</h3>
        <span>Mean rate</span>
      </div>
    </section>

    <section class="card understanding-card">
      <h3>ⓘ Understanding This Recommendation</h3>

      <p>
        The current {{ fromCurrency }}/{{ toCurrency }} rate of
        <strong>{{ formattedLiveRate }}</strong>
        sits at the
        <strong>{{ percentile }}th percentile</strong>
        of the selected {{ selectedRange }} historical range.
      </p>

      <p>
        The average rate during this period is
        <strong>{{ averageRateText }}</strong
        >, and the most frequently observed rate level is
        <strong>{{ modeRateText }}</strong
        >.
      </p>

      <p>
        {{ recommendationExplanation }}
      </p>

      <div class="warning-box">
        ⚠ This analysis is based on historical exchange-rate data and is for
        informational purposes only. Exchange rates are influenced by many
        factors, and past performance does not guarantee future results.
      </div>
    </section>

    <section class="card simulator">
      <h2>Exchange Simulator</h2>

      <div class="sim-box">
        <p>Amount to Exchange</p>

        <div class="amount-wrapper">
          <input
            v-model.number="amount"
            type="number"
            class="amount-field simulator-input"
            min="0"
            placeholder="0"
          />

          <span class="currency-tag">
            {{ fromCurrency }}
          </span>
        </div>
      </div>

      <div class="sim-result highlight">
        <p>Today</p>
        <h3>{{ convertedAmount }} {{ toCurrency }}</h3>
      </div>

      <div class="sim-result">
        <p>At {{ selectedRange }} High</p>
        <h3>{{ highAmount }} {{ toCurrency }}</h3>
      </div>

      <div class="sim-result highlight">
        <p>Difference vs Peak</p>
        <h3>+{{ difference }} {{ toCurrency }}</h3>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  MarkLineComponent,
  DataZoomComponent,
} from "echarts/components";
import VChart from "vue-echarts";

import { getLatestRates, getHistoricalRates } from "../services/exchangeApi";
import { storeToRefs } from "pinia";
import { useCurrencyStore } from "@/stores/currencyStore";

const currencyStore = useCurrencyStore();

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  MarkLineComponent,
  DataZoomComponent,
]);

const amount = ref("");
const { fromCurrency, toCurrency } = storeToRefs(currencyStore);

const rates = ref({});
const isLoading = ref(false);

const selectedRange = ref("5Y");
const historicalRates = ref([]);
const isHistoryLoading = ref(false);

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

const fetchRates = async () => {
  try {
    isLoading.value = true;
    rates.value = await getLatestRates(fromCurrency.value);
  } catch (error) {
    console.error("Failed to fetch rates:", error);
  } finally {
    isLoading.value = false;
  }
};

const liveRate = computed(() => {
  return rates.value[toCurrency.value] || null;
});

const formattedLiveRate = computed(() => {
  if (!liveRate.value) return "Loading...";
  return liveRate.value.toFixed(4);
});

const convertedAmount = computed(() => {
  if (!liveRate.value) return "Loading...";
  return (amount.value * liveRate.value).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
});

const getDateRange = () => {
  const end = new Date();
  const start = new Date();

  if (selectedRange.value === "5Y") start.setFullYear(end.getFullYear() - 5);
  if (selectedRange.value === "2Y") start.setFullYear(end.getFullYear() - 2);
  if (selectedRange.value === "1Y") start.setFullYear(end.getFullYear() - 1);
  if (selectedRange.value === "6M") start.setMonth(end.getMonth() - 6);

  const formatDate = (date) => date.toISOString().split("T")[0];

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
};

const fetchHistoricalData = async () => {
  try {
    isHistoryLoading.value = true;

    const { startDate, endDate } = getDateRange();

    console.log("Fetching history:", {
      from: fromCurrency.value,
      to: toCurrency.value,
      startDate,
      endDate,
    });

    historicalRates.value = await getHistoricalRates(
      fromCurrency.value,
      toCurrency.value,
      startDate,
      endDate
    );

    console.log("Historical rates:", historicalRates.value);
  } catch (error) {
    console.error("Failed to fetch historical rates:", error);
    historicalRates.value = [];
  } finally {
    isHistoryLoading.value = false;
  }
};

const getWeekKey = (dateString) => {
  const date = new Date(dateString);
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstDay) / 86400000);
  const week = Math.ceil((days + firstDay.getDay() + 1) / 7);

  return `${date.getFullYear()}-W${week}`;
};

const aggregateRates = (data, type) => {
  const map = new Map();

  data.forEach((item) => {
    let key = item.date;

    if (type === "month") {
      key = item.date.slice(0, 7);
    }

    if (type === "week") {
      key = getWeekKey(item.date);
    }

    map.set(key, {
      date: item.date,
      label: key,
      rate: item.rate,
    });
  });

  return Array.from(map.values());
};

const displayedHistoricalRates = computed(() => {
  if (selectedRange.value === "5Y") {
    return aggregateRates(historicalRates.value, "month");
  }

  if (selectedRange.value === "2Y") {
    return aggregateRates(historicalRates.value, "month");
  }

  if (selectedRange.value === "1Y") {
    return aggregateRates(historicalRates.value, "week");
  }

  return historicalRates.value.map((item) => ({
    ...item,
    label: item.date,
  }));
});

const chartValues = computed(() => {
  return displayedHistoricalRates.value
    .map((item) => item.rate)
    .filter((value) => typeof value === "number");
});

const averageRate = computed(() => {
  if (!chartValues.value.length) return null;

  const total = chartValues.value.reduce((sum, value) => sum + value, 0);
  return total / chartValues.value.length;
});

const modeRate = computed(() => {
  if (!chartValues.value.length) return null;

  const frequencyMap = {};

  chartValues.value.forEach((rate) => {
    const rounded = rate.toFixed(2);
    frequencyMap[rounded] = (frequencyMap[rounded] || 0) + 1;
  });

  let mostFrequentRate = null;
  let highestCount = 0;

  Object.entries(frequencyMap).forEach(([rate, count]) => {
    if (count > highestCount) {
      highestCount = count;
      mostFrequentRate = Number(rate);
    }
  });

  return mostFrequentRate;
});

const chartOption = computed(() => {
  const dates = displayedHistoricalRates.value.map((item) => item.label);
  const values = displayedHistoricalRates.value.map((item) => item.rate);

  return {
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const item = params[0];

        return `
          ${item.axisValue}<br/>
          ${fromCurrency.value}/${toCurrency.value}: ${item.data.toFixed(
          4
        )}<br/>
          Average: ${averageRate.value?.toFixed(4)}<br/>
          Most Frequent: ${modeRate.value?.toFixed(4)}
        `;
      },
    },

    grid: {
      left: 55,
      right: 40,
      top: 50,
      bottom: 85,
    },

    xAxis: {
      type: "category",
      data: dates,
      axisLabel: {
        color: "#94a3b8",
      },
      axisLine: {
        lineStyle: {
          color: "#334155",
        },
      },
    },

    yAxis: {
      type: "value",

      min: function (value) {
        return value.min * 0.995;
      },

      max: function (value) {
        return value.max * 1.005;
      },

      axisLabel: {
        color: "#94a3b8",
        formatter: (value) => value.toFixed(2),
      },

      splitLine: {
        lineStyle: {
          color: "#263248",
        },
      },
    },

    dataZoom: [
      {
        type: "inside",
        xAxisIndex: 0,
        start: 0,
        end: 100,
      },
      {
        type: "slider",
        xAxisIndex: 0,
        start: 0,
        end: 100,
        height: 24,
        bottom: 18,
        borderColor: "#263248",
        fillerColor: "rgba(20, 184, 166, 0.18)",
        handleStyle: {
          color: "#14b8a6",
        },
        textStyle: {
          color: "#94a3b8",
        },
      },
    ],

    series: [
      {
        name: `${fromCurrency.value}/${toCurrency.value}`,
        type: "line",
        data: values,
        smooth: true,
        showSymbol: false,

        lineStyle: {
          width: 3,
          color: "#14b8a6",
        },

        markLine: {
          symbol: "none",
          data: [
            averageRate.value
              ? {
                  yAxis: averageRate.value,
                  name: "Ave",
                  lineStyle: {
                    color: "#f59e0b",
                    type: "dashed",
                    width: 2,
                  },
                  label: {
                    show: false,
                  },
                  emphasis: {
                    label: {
                      show: true,
                      formatter: "Ave",
                      color: "#f59e0b",
                    },
                  },
                }
              : null,

            modeRate.value
              ? {
                  yAxis: modeRate.value,
                  name: "Most",
                  lineStyle: {
                    color: "#3b82f6",
                    type: "dashed",
                    width: 2,
                  },
                  label: {
                    show: false,
                  },
                  emphasis: {
                    label: {
                      show: true,
                      formatter: "Most",
                      color: "#3b82f6",
                    },
                  },
                }
              : null,
          ].filter(Boolean),
        },
      },
    ],
  };
});

const todayAmount = computed(() => {
  return convertedAmount.value;
});

const highAmount = computed(() => {
  if (!liveRate.value) return "Loading...";
  return (amount.value * liveRate.value * 1.08).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
});

const difference = computed(() => {
  if (!liveRate.value) return "Loading...";
  return (amount.value * liveRate.value * 0.08).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
});

const swapCurrencies = () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
};

watch([fromCurrency, toCurrency, selectedRange], () => {
  currencyStore.setCurrencyPair(fromCurrency.value, toCurrency.value);

  fetchRates();
  fetchHistoricalData();
});

onMounted(() => {
  currencyStore.setCurrencyPair(
    fromCurrency.value,
    toCurrency.value
  );

  fetchRates();
  fetchHistoricalData();
});

const percentile = computed(() => {
  if (!chartValues.value.length || !liveRate.value) return 0;

  const lowerCount = chartValues.value.filter(
    (rate) => rate < liveRate.value
  ).length;

  return Math.round((lowerCount / chartValues.value.length) * 100);
});

const recommendationTitle = computed(() => {
  if (!chartValues.value.length || !liveRate.value) {
    return "Analysing...";
  }

  if (percentile.value <= 20) return "Excellent Time";
  if (percentile.value <= 40) return "Good Time";
  if (percentile.value <= 60) return "Neutral";
  if (percentile.value <= 80) return "Consider Waiting";
  return "Unfavourable Time";
});

const recommendationSummary = computed(() => {
  if (!chartValues.value.length || !liveRate.value) {
    return "Waiting for historical market data to generate a recommendation.";
  }

  if (percentile.value <= 20) {
    return `The current rate is low compared with the selected historical range. This may be favourable if you are using ${toCurrency.value} to buy ${fromCurrency.value}.`;
  }

  if (percentile.value <= 40) {
    return `The current rate is below its historical middle range. It may be a reasonable time to exchange, depending on your target rate.`;
  }

  if (percentile.value <= 60) {
    return `The current rate is close to its historical average range. The timing is broadly neutral.`;
  }

  if (percentile.value <= 80) {
    return `The current rate is above its historical middle range. This may be favourable if you are converting ${fromCurrency.value} into ${toCurrency.value}.`;
  }

  return `The current rate is high compared with the selected historical range. If you need to buy ${fromCurrency.value}, you may consider waiting for a better rate.`;
});

const averageRateText = computed(() => {
  return averageRate.value ? averageRate.value.toFixed(4) : "Loading...";
});

const periodLow = computed(() => {
  if (!chartValues.value.length) return null;
  return Math.min(...chartValues.value);
});

const periodHigh = computed(() => {
  if (!chartValues.value.length) return null;
  return Math.max(...chartValues.value);
});

const periodLowText = computed(() => {
  return periodLow.value ? periodLow.value.toFixed(4) : "Loading...";
});

const periodHighText = computed(() => {
  return periodHigh.value ? periodHigh.value.toFixed(4) : "Loading...";
});

const modeRateText = computed(() => {
  return modeRate.value ? modeRate.value.toFixed(4) : "Loading...";
});

const recommendationExplanation = computed(() => {
  if (percentile.value <= 20) {
    return `This suggests ${fromCurrency.value} is relatively weak against ${toCurrency.value} compared with the selected historical period. If you are holding ${toCurrency.value} and looking to acquire ${fromCurrency.value}, this may represent a favourable window.`;
  }

  if (percentile.value <= 40) {
    return `This suggests the current rate is below its typical historical level. It may be a reasonable time to exchange, depending on your target rate and timing needs.`;
  }

  if (percentile.value <= 60) {
    return `This suggests the current rate is close to its historical middle range. The exchange timing is broadly neutral compared with recent historical conditions.`;
  }

  if (percentile.value <= 80) {
    return `This suggests the current rate is above its typical historical level. If you are converting ${fromCurrency.value} to ${toCurrency.value}, the rate may be relatively favourable.`;
  }

  return `This suggests ${fromCurrency.value} is relatively strong against ${toCurrency.value} compared with the selected historical period. If you need to buy ${fromCurrency.value}, you may consider waiting for a more favourable rate.`;
});
</script>
