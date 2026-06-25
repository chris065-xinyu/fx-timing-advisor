<template>
  <header class="navbar">
    <div class="nav-container">
      <div class="brand">
        <div class="logo">FX</div>
        <span>FX Rate <strong>Advisor</strong></span>
      </div>

      <nav class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/analysis">Analysis</RouterLink>
        <RouterLink to="/insights">Insights</RouterLink>
      </nav>

      <RouterLink to="/analysis" class="start-btn">
        Start Analysis
      </RouterLink>
    </div>
  </header>
</template>