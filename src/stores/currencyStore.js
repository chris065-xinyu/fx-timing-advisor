import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCurrencyStore = defineStore("currency", () => {
  const fromCurrency = ref(localStorage.getItem("fromCurrency") || "AUD");
  const toCurrency = ref(localStorage.getItem("toCurrency") || "CNY");

  const selectedPair = computed(() => {
    return `${fromCurrency.value}/${toCurrency.value}`;
  });

  const setCurrencyPair = (from, to) => {
    fromCurrency.value = from;
    toCurrency.value = to;

    localStorage.setItem("fromCurrency", from);
    localStorage.setItem("toCurrency", to);
  };

  return {
    fromCurrency,
    toCurrency,
    selectedPair,
    setCurrencyPair,
  };
});