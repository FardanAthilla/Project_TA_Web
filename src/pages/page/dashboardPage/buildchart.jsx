import ApexCharts from 'apexcharts';

const buildChart = (selector, getConfig, lightModeConfig, darkModeConfig) => {
  const mode = 'light'; // Assume light mode for simplicity; adjust as needed
  const config = getConfig(mode);

  // Merge additional configurations based on the mode
  if (mode === 'light') {
    Object.assign(config, lightModeConfig);
  } else {
    Object.assign(config, darkModeConfig);
  }

  const chart = new ApexCharts(document.querySelector(selector), config);
  chart.render();
};

export default buildChart;
