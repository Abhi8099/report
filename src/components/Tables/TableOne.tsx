"use client"
import { Table, Tabs } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { IoFilter } from 'react-icons/io5';
import type { ColumnsType } from 'antd/es/table';
import { useGoogleSearchConsoleData } from '@/helpers/GoogleSearchConsoleDataContext';
import millify from 'millify';
const { TabPane } = Tabs;

interface TableData {
  key: string;
  topqueries: string;
  impressions: string;
  ctr: string;
  position: string;
}

export default function TableOne() {
  const millify = (value:any) => {
    if (!value) return "0";
    const prefixes = ["", "k", "m", "b"];
    const magnitude = Math.floor(Math.log10(Math.abs(value)) / 3);
    const millifiedValue = (value / Math.pow(10, magnitude * 3)).toFixed(1);
    
    return `${millifiedValue}${prefixes[magnitude]}`;
  };
  

  const [activeTab, setActiveTab] = useState<string>('1');
  const { fetchGSCData, loading, countryData, pageData, queryData,dateData } = useGoogleSearchConsoleData();
  const getTopQueriesTitle = () => {
    switch (activeTab) {
      case '1':
        return 'Date'; // For Queries tab
      case '2':
        return 'Top Queries'; // For Queries tab
      case '3':
        return 'Top Pages'; // For Pages tab
      case '4':
        return 'Top Countries'; // For Countries tab
      default:
        return 'Top Queries'; // Fallback title
    }
  };


  // Defining the columns for the table
  const columns: ColumnsType<TableData> = [
    {
      title: getTopQueriesTitle(),
      dataIndex: 'topqueries',
      key: 'topqueries',
      render: (topqueries: any) => (
        <span className="font-medium text-base">{topqueries}</span>
      ),
    },
    {
      title: 'Clicks',
      dataIndex: 'clicks',
      key: 'clicks',
      render: (clicks: any) => (
        <span className="font-medium text-base">{clicks}</span>
      ),
    },
    {
      title: 'Impressions',
      dataIndex: 'impressions',
      key: 'impressions',
      render: (impressions: any) => {
        const numericImpressions = parseFloat(impressions); // Convert to number
        console.log('Raw impressions value:', impressions, 'Numeric impressions:', numericImpressions);
        return (
          <span className="text-[#5E35B1] font-medium text-base">
            {millify(numericImpressions)} {/* Use millify directly */}
          </span>
        );
      },
    },
      
    {
      title: 'CTR',
      dataIndex: 'ctr',
      key: 'ctr',
      render: (ctr: any) => (
        <span className="text-[#00897B] font-medium text-base">{ctr}</span>
      ),
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      render: (position: any) => (
        <span className="text-[#E8710A] font-medium text-base">{position}</span>
      ),
    },
  ];

  // Data source for each tab
  const data: Record<string, TableData[]> = {
    '1': dateData.map((item, index) => ({
      key: index.toString(),
      topqueries: item.date,
      clicks: item.clicks,
      impressions: item.impressions.toString(),
      ctr: `${(item.ctr * 100).toFixed(2)}%`, // Assuming ctr is a decimal and converting to percentage
      position: item.position.toFixed(1).toString(),
    })),
    '2': queryData.map((item, index) => ({
      key: index.toString(),
      topqueries: item.query,
      clicks: item.clicks,
      impressions: item.impressions.toString(),
      ctr: `${(item.ctr * 100).toFixed(2)}%`, // Assuming ctr is a decimal and converting to percentage
      position: item.position.toFixed(1).toString(),
    })),
    '3': pageData.map((item, index) => ({
      key: index.toString(),
      topqueries: item.page,
      clicks: item.clicks,
      impressions: item.impressions.toString(),
      ctr: `${(item.ctr * 100).toFixed(2)}%`,
      position: item.position.toFixed(1).toString(),
    })),
    '4': countryData.map((item, index) => ({
      key: index.toString(),
      topqueries: item.country.toUpperCase(),
      clicks: item.clicks,
      impressions: item.impressions.toString(),
      ctr: `${(item.ctr * 100).toFixed(2)}%`,
      position: item.position.toFixed(1).toString(),
    })),
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-dark rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        {/* Tabs for switching between different categories */}
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          type="card"
        >
          <TabPane tab="DATE" key="1" />
          <TabPane tab="QUERIES" key="2" />
          <TabPane tab="PAGES" key="3" />
          <TabPane tab="COUNTRIES" key="4" />
        </Tabs>
        {/* <button className="px-4 py-2 bg-[#F8F8F8] text-primary rounded-md cursor-pointer text-base font-medium transition-colors flex gap-2">
          Filter<IoFilter className="text-xl" />
        </button> */}
      </div>
      {/* Ant Design table to display the data */}
      <Table 
        columns={columns} 
        dataSource={data[activeTab]} 
        className="border border-gray-200 rounded-md dark:bg-gray-dark" 
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
      }}
      scroll={{ x: 'max-content' }}
      loading={loading}
      />
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <span>Showing 1 to {data[activeTab].length} of {data[activeTab].length} results</span>
        <div className="flex items-center">
          <span className="mr-2">Rows per page: {data[activeTab].length}</span>
          <DownOutlined />
        </div>
      </div>
    </div>
  );
}
