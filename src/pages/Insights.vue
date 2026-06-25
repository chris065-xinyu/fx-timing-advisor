<template>
    <main class="page">
      <section class="page-title">
        <h1>Market Insights</h1>
        <p>Real-time currency intelligence and market sentiment analysis</p>
      </section>
  
      <section class="card">
        <div class="chart-header">
          <div>
            <h2>Currency Performance Heatmap</h2>
            <p>% change vs USD across time periods</p>
          </div>
  
          <div class="tabs">
            <button class="active">1D</button>
            <button>1W</button>
            <button>1M</button>
            <button>3M</button>
            <button>1Y</button>
          </div>
        </div>
  
        <div class="heatmap">
          <div class="heat-row header">
            <span>Currency</span>
            <span>1D</span>
            <span>1W</span>
            <span>1M</span>
            <span>3M</span>
            <span>1Y</span>
          </div>
  
          <div v-for="item in heatmap" :key="item.currency" class="heat-row">
            <span>{{ item.flag }} {{ item.currency }}</span>
            <span class="gain">{{ item.d1 }}</span>
            <span class="gain">{{ item.w1 }}</span>
            <span class="loss">{{ item.m1 }}</span>
            <span class="gain">{{ item.m3 }}</span>
            <span class="gain">{{ item.y1 }}</span>
          </div>
        </div>
      </section>
  
      <section class="card">
        <h2>Top Movers</h2>
  
        <div class="movers-grid">
          <div class="mover">AUD/USD <span class="gain">+1.24%</span></div>
          <div class="mover">USD/JPY <span class="loss">-0.82%</span></div>
          <div class="mover">GBP/AUD <span class="gain">+0.54%</span></div>
          <div class="mover">EUR/CNY <span class="gain">+0.68%</span></div>
          <div class="mover">CAD/USD <span class="loss">-0.43%</span></div>
          <div class="mover">NZD/USD <span class="gain">+0.87%</span></div>
        </div>
      </section>
  
      <section class="card">
        <h2>Market Sentiment</h2>
  
        <div class="sentiment-box">
          <div class="gauge">
            Excellent Time
          </div>
  
          <p>
            Based on AUD/CNY 5-year analysis, current conditions suggest a favourable
            exchange window.
          </p>
        </div>
      </section>
  
      <section class="card">
        <h2>Economic Calendar</h2>
  
        <div class="events">
          <div class="event">🇦🇺 RBA Interest Rate Decision <span>High</span></div>
          <div class="event">🇺🇸 Fed Meeting Minutes <span>High</span></div>
          <div class="event">🇨🇳 China CPI Release <span class="medium">Medium</span></div>
          <div class="event">🇺🇸 US Non-Farm Payrolls <span>High</span></div>
        </div>
      </section>
    </main>
  </template>
  
  <script setup>
  const heatmap = [
    { flag: '🇺🇸', currency: 'USD', d1: '+0.12%', w1: '+0.45%', m1: '-0.87%', m3: '+1.23%', y1: '+2.45%' },
    { flag: '🇪🇺', currency: 'EUR', d1: '+0.23%', w1: '+0.12%', m1: '-0.56%', m3: '+0.89%', y1: '+1.23%' },
    { flag: '🇦🇺', currency: 'AUD', d1: '+0.82%', w1: '+1.24%', m1: '-0.45%', m3: '+0.67%', y1: '-2.34%' },
    { flag: '🇯🇵', currency: 'JPY', d1: '+0.78%', w1: '-1.34%', m1: '-2.45%', m3: '+5.67%', y1: '-12.34%' },
    { flag: '🇬🇧', currency: 'GBP', d1: '+0.34%', w1: '+0.67%', m1: '+1.23%', m3: '+2.34%', y1: '+3.45%' },
    { flag: '🇨🇳', currency: 'CNY', d1: '-0.05%', w1: '-0.12%', m1: '+0.23%', m3: '-0.45%', y1: '+0.78%' }
  ]
  </script>