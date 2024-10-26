"use client";
import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import { Skeleton } from "@mui/material";
import { useGoogleAnalyticsData } from "@/helpers/GoogleAnalyticsDataContext";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear"; // To handle weekly grouping

dayjs.extend(weekOfYear); // Extend dayjs with weekOfYear

const ChartAnalytics: React.FC = () => {
  const { analyticsData, Analyticsloading } = useGoogleAnalyticsData();
  const [selectedPeriod, setSelectedPeriod] = React.useState("Daily");

  // Extract date_sums data
  const dateSums = analyticsData?.date_sums || {};

  // Aggregate data based on the selected period
  const groupByPeriod = React.useMemo(() => {
    const groupedData: { [key: string]: any } = {};

    Object.entries(dateSums).forEach(([date, metrics]) => {
      const parsedDate = dayjs(date);

      // Define the key based on the selected period
      let periodKey = "";
      if (selectedPeriod === "Daily") {
        periodKey = parsedDate.format("YYYY-MM-DD");
      } else if (selectedPeriod === "Weekly") {
        periodKey = `Week ${parsedDate.week()} - ${parsedDate.year()}`;
      } else if (selectedPeriod === "Monthly") {
        periodKey = parsedDate.format("YYYY-MM");
      }

      if (!groupedData[periodKey]) {
        groupedData[periodKey] = {
          newUsers: 0,
          activeUsers: 0,
          eventCount: 0,
          screenPageViews: 0,
        };
      }

      const {
        newUsers = 0,
        activeUsers = 0,
        eventCount = 0,
        screenPageViews = 0,
      } = metrics as {
        newUsers?: number;
        activeUsers?: number;
        eventCount?: number;
        screenPageViews?: number;
      };

      // Accumulate metrics for the given period key
      groupedData[periodKey].newUsers += newUsers;
      groupedData[periodKey].activeUsers += activeUsers;
      groupedData[periodKey].eventCount += eventCount;
      groupedData[periodKey].screenPageViews += screenPageViews;
    });

    return groupedData;
  }, [dateSums, selectedPeriod]);

  // Prepare data for the chart
  const dateData = Object.entries(groupByPeriod)
    .map(([period, metrics]) => ({
      period,
      ...metrics,
    }))
    .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime());

  // Function to handle changes in the "Sort by" dropdown
  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(event.target.value);
  };

  // Check if dateData is available and not empty
  const hasData = dateData && dateData.length > 0;

  // Define chart series based on all metrics you want to display
  const series = React.useMemo(() => {
    if (!hasData) return [];
    return [
      {
        name: "New Users",
        data: dateData.map((item) => item.newUsers || 0),
      },
      {
        name: "Active Users",
        data: dateData.map((item) => item.activeUsers || 0),
      },
      {
        name: "Event Count",
        data: dateData.map((item) => item.eventCount || 0),
      },
      {
        name: "Screen Page Views",
        data: dateData.map((item) => item.screenPageViews || 0),
      },
    ];
  }, [dateData]);

  // Categories for the X-axis (periods)
  const categories = React.useMemo(() => {
    return dateData.map((item) => item.period);
  }, [dateData]);

  // ApexCharts configuration
  const options: ApexOptions = React.useMemo(() => ({
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: [
      "#006BD7", // New Users
      "#EF1649", // Active Users
      "#1090D0", // Event Count
      "#F24A25", // Screen Page Views
    ],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: true,
      },
    },
    stroke: {
      curve: "smooth",
      width: [2, 2, 2, 2, 2, 2],
    },
    markers: {
      size: 4,
      colors: ["#006BD7", "#EF1649", "#1090D0","#F24A25",],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 7,
      },
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
    dataLabels: {
      enabled: false,
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
    xaxis: {
      type: "category",
      categories: categories,
      tickAmount: Math.min(categories.length, 10),
      labels: {
        rotate: -45,  // Rotate labels 45 degrees for better fit
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
    yaxis: [
      {
        title: {
          text: "Users",
        },
        labels: {
          formatter: (value) => Math.round(value).toString(),
        },
      },
      {
        opposite: true,
        title: {
          text: "Sessions & Events",
        },
        labels: {
          formatter: (value) => Math.round(value).toString(),
        },
      },
    ],
  }), [categories]);

  return (
    <div className="col-span-12 rounded-lg bg-white py-7 dark:bg-gray-800 dark:shadow-gray-700 xl:col-span-7">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-2xl font-bold text-gray-800 dark:text-white">
            Metrics Overview
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-medium uppercase text-gray-600 dark:text-gray-400">
            Sort by:
          </p>
          <select
            value={selectedPeriod}
            onChange={handlePeriodChange}
            className="rounded border bg-white px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>
      </div>
      <div>
        <div className="-ml-4 -mr-5">
          {Analyticsloading ? (
            <Skeleton variant="rectangular" animation="wave" width="100%" height={300} className="rounded-[10px]" />
          ) : hasData ? (
            <ReactApexChart
              options={options}
              series={series}
              type="line"
              height={310}
            />
          ) : (
            <div className="text-center text-gray-500">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartAnalytics;
