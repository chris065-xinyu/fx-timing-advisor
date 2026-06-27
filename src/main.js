import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./style.css";

import { createPinia } from "pinia";

import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { GaugeChart, LineChart, BarChart } from "echarts/charts";
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";

use([
  CanvasRenderer,
  GaugeChart,
  LineChart,
  BarChart,
  TooltipComponent,
  GridComponent,
  LegendComponent,
]);

const app = createApp(App);

app.use(router);
app.use(createPinia());

app.mount("#app");