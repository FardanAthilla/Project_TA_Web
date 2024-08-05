// src/components/Chart.js
import React from 'react';
import Chart from 'react-apexcharts';

const ApexChart = () => {
  const options = {
    chart: {
      height: 300,
      type: 'area',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    series: [
      {
        name: 'Income',
        data: [18000, 51000, 60000, 38000, 88000, 50000, 40000, 52000, 88000, 80000, 60000, 70000],
      },
      {
        name: 'Outcome',
        data: [27000, 38000, 60000, 77000, 40000, 50000, 49000, 29000, 42000, 27000, 42000, 50000],
      },
    ],
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    grid: {
      strokeDashArray: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        type: 'vertical',
        shadeIntensity: 1,
        opacityFrom: 0.1,
        opacityTo: 0.8,
      },
    },
    xaxis: {
      type: 'category',
      tickPlacement: 'on',
      categories: [
        '25 Jan 2023',
        '26 Jan 2023',
        '27 Jan 2023',
        '28 Jan 2023',
        '29 Jan 2023',
        '30 Jan 2023',
        '31 Jan 2023',
        '1 Feb 2023',
        '2 Feb 2023',
        '3 Feb 2023',
        '4 Feb 2023',
        '5 Feb 2023',
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        stroke: {
          dashArray: 0,
        },
        dropShadow: {
          show: false,
        },
      },
      tooltip: {
        enabled: false,
      },
      labels: {
        style: {
          colors: '#9ca3af',
          fontSize: '13px',
          fontFamily: 'Inter, ui-sans-serif',
          fontWeight: 400,
        },
        formatter: (title) => {
          let t = title;
          if (t) {
            const newT = t.split(' ');
            t = `${newT[0]} ${newT[1].slice(0, 3)}`;
          }
          return t;
        },
      },
    },
    yaxis: {
      labels: {
        align: 'left',
        minWidth: 0,
        maxWidth: 140,
        style: {
          colors: '#9ca3af',
          fontSize: '13px',
          fontFamily: 'Inter, ui-sans-serif',
          fontWeight: 400,
        },
        formatter: (value) => (value >= 1000 ? `${value / 1000}k` : value),
      },
    },
    tooltip: {
      x: {
        format: 'MMMM yyyy',
      },
      y: {
        formatter: (value) => `$${value >= 1000 ? `${value / 1000}k` : value}`,
      },
      custom: function (props) {
        const { categories } = props.ctx.opts.xaxis;
        const { dataPointIndex } = props;
        const title = categories[dataPointIndex].split(' ');
        const newTitle = `${title[0]} ${title[1]}`;

        return buildTooltip(props, {
          title: newTitle,
          mode,
          hasTextLabel: true,
          wrapperExtClasses: 'min-w-28',
          labelDivider: ':',
          labelExtClasses: 'ms-2',
        });
      },
    },
    responsive: [
      {
        breakpoint: 568,
        options: {
          chart: {
            height: 300,
          },
          labels: {
            style: {
              colors: '#9ca3af',
              fontSize: '11px',
              fontFamily: 'Inter, ui-sans-serif',
              fontWeight: 400,
            },
            offsetX: -2,
            formatter: (title) => title.slice(0, 3),
          },
          yaxis: {
            labels: {
              align: 'left',
              minWidth: 0,
              maxWidth: 140,
              style: {
                colors: '#9ca3af',
                fontSize: '11px',
                fontFamily: 'Inter, ui-sans-serif',
                fontWeight: 400,
              },
              formatter: (value) => (value >= 1000 ? `${value / 1000}k` : value),
            },
          },
        },
      },
    ],
  };

  const lightTheme = {
    colors: ['#2563eb', '#9333ea'],
    fill: {
      gradient: {
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      labels: {
        style: {
          colors: '#9ca3af',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#9ca3af',
        },
      },
    },
    grid: {
      borderColor: '#e5e7eb',
    },
  };

  const darkTheme = {
    colors: ['#3b82f6', '#a855f7'],
    fill: {
      gradient: {
        stops: [100, 90, 0],
      },
    },
    xaxis: {
      labels: {
        style: {
          colors: '#a3a3a3',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#a3a3a3',
        },
      },
    },
    grid: {
      borderColor: '#404040',
    },
  };

  const theme = 'light'; // or 'dark' depending on your theme logic

  return <Chart options={{ ...options, ...(theme === 'light' ? lightTheme : darkTheme) }} series={options.series} type="area" height={300} />;
};

export default ApexChart;
