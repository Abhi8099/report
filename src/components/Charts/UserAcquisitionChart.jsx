import React from 'react';
import Chart from 'react-apexcharts';

const UserAcquisitionChart = ({ data = [], type }) => {
  const formatDate = (dateStr) => {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const formattedDate = new Date(`${year}-${month}-${day}`);
    return formattedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (!data.length) {
    return <p>No data available</p>;
  }

  const groupedData = data.reduce((acc, item) => {
    const date = formatDate(item.date);

    if (!acc[date]) {
      acc[date] = {
        totalUsers: 0,
        newUsers: 0,
        sessions: 0,
        engagedSessions: 0,
      };
    }

    if (type === 'user') {
      acc[date].totalUsers += item.Totalusers || 0;
      acc[date].newUsers += item.Newusers || 0;
    } else if (type === 'traffic') {
      acc[date].sessions += item.sessions || 0;
      acc[date].engagedSessions += item.engagedSessions || 0;
    }

    return acc;
  }, {});

  const categories = Object.keys(groupedData);
  let series;

  if (type === 'user') {
    series = [
      {
        name: 'Total Users',
        data: categories.map(date => groupedData[date].totalUsers),
      },
      {
        name: 'New Users',
        data: categories.map(date => groupedData[date].newUsers),
      },
    ];
  } else if (type === 'traffic') {
    series = [
      {
        name: 'Sessions',
        data: categories.map(date => groupedData[date].sessions),
      },
      {
        name: 'Engaged Sessions',
        data: categories.map(date => groupedData[date].engagedSessions),
      },
    ];
  }

  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
      fontFamily: "Satoshi, sans-serif",
      toolbar: {
        show: true,
      },
    },
    colors: [
      "#006BD7", // Total Users / Sessions
      "#EF1649", // New Users / Engaged Sessions
    ],
    xaxis: {
      categories: categories,
      tickAmount: Math.min(categories.length, 10),
      labels: {
        rotate: -45,
        formatter: function (value) {
          const date = new Date(value);
          const day = date.getDate();
          const month = date.toLocaleString('default', { month: 'short' });
          return `${day} ${month}`;
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => Math.round(value).toString(),
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (value) {
          return value.toFixed(2);
        },
      },
    },
    legend: {
        show: true,
      position: 'top',
      horizontalAlign: 'left',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    grid: {
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    markers: {
      size: 4,
      colors: ["#006BD7", "#EF1649"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <div className="col-span-12 rounded-lg bg-white py-7 dark:bg-gray-800 dark:shadow-gray-700 xl:col-span-7">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-2xl font-bold text-gray-800 dark:text-white">
            {type === 'user' ? 'User Acquisition' : 'Traffic Overview'}
          </h4>
        </div>
      </div>
      <div>
        <div className="-ml-4 -mr-5">
          <Chart options={chartOptions} series={series} type="line" height={350} />
        </div>
      </div>
    </div>
  );
};

export default UserAcquisitionChart;