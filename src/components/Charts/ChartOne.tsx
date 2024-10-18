"use client"
import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import { useGoogleSearchConsoleData } from "@/helpers/GoogleSearchConsoleDataContext";
import { Skeleton } from "@mui/material";

const ChartOne: React.FC = () => {
  const { fetchGSCData, loading, data, dateData } = useGoogleSearchConsoleData();

  const [selectedPeriod, setSelectedPeriod] = React.useState("Daily");

  // Check if dateData is available and not empty
  const hasData = dateData && dateData.length > 0;

  // Function to handle changes in the "Short by" dropdown
  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(event.target.value);
  };

  // Create a function to group dateData based on the selected period
  const getGroupedData = (data: any[], period: string) => {
    const grouped: { [key: string]: { clicks: number; impressions: number; ctr: number; position: number; count: number } } = {};

    data.forEach((item) => {
      const date = new Date(item.date);
      let key;
      if (period === "Weekly") {
        const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
        key = startOfWeek.toISOString().split('T')[0]; // Get the start of the week
      } else if (period === "Monthly") {
        key = date.toISOString().split('T')[0].slice(0, 7); // Year-Month
      } else {
        key = item.date; // Daily
      }

      if (!grouped[key]) {
        grouped[key] = { clicks: 0, impressions: 0, ctr: 0, position: 0, count: 0 };
      }
      grouped[key].clicks += Number(item.clicks);
      grouped[key].impressions += Number(item.impressions);
      grouped[key].ctr += Number(item.ctr);
      grouped[key].position += Number(item.position);
      grouped[key].count += 1;
    });

    // Convert grouped data to an array and sort it by date
    return Object.entries(grouped)
      .map(([key, value]) => ({
        date: key,
        clicks: value.clicks,
        impressions: value.impressions,
        ctr: value.ctr / value.count, // Average CTR
        position: value.position / value.count, // Average Position
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date ascending
  };

  const groupedData = React.useMemo(() => {
    return getGroupedData(dateData, selectedPeriod);
  }, [dateData, selectedPeriod]);

  const series = React.useMemo(() => {
    if (!groupedData || groupedData.length === 0) return [];
    return [
      {
        name: "Clicks",
        data: groupedData.map((item) => Number(item.clicks) || 0),
      },
      {
        name: "Impressions",
        data: groupedData.map((item) => Number(item.impressions) || 0),
      },
      {
        name: "CTR",
        data: groupedData.map((item) => Number(item.ctr) * 100 || 0),
      },
      {
        name: "Position",
        data: groupedData.map((item) => Number(item.position) || 0),
      },
    ];
  }, [groupedData]);

  const categories = React.useMemo(() => {
    return groupedData.map((item) => item.date);
  }, [groupedData]);

  const options: ApexOptions = React.useMemo(() => ({
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#006BD7", "#EF1649", "#1090D0", "#F24A25"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: [2, 2, 2, 2],
    },
    markers: {
      size: 0,
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
    },
    
    
    yaxis: [
      {
        title: {
          text: "Clicks",
        },
        labels: {
          formatter: (value) => Math.round(value).toString(),
        },
      },
      {
        opposite: true,
        title: {
          text: "Impressions",
        },
        labels: {
          formatter: (value) => Math.round(value).toString(),
        },
      },
      {
        title: {
          text: "CTR (%)",
        },
        labels: {
          formatter: (value) => value.toFixed(2),
        },
      },
      {
        opposite: true,
        title: {
          text: "Position",
        },
        labels: {
          formatter: (value) => value.toFixed(2),
        },
      },
    ],
  }), [categories]);

  return (
    <div className="col-span-12 rounded-lg bg-white px-7 pb-6 pt-7 shadow-md dark:bg-gray-800 dark:shadow-gray-700 xl:col-span-7">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-2xl font-bold text-gray-800 dark:text-white">
            Metrics Overview
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-medium uppercase text-gray-600 dark:text-gray-400">
            Short by:
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
          {loading ? (
            <Skeleton variant="rectangular" animation="wave" width="100%" height={300} className="rounded-[10px]" />
          ) : groupedData.length > 0 ? (
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

export default ChartOne;
