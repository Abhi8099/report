"use client";
import React, { useEffect, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useGoogleSearchConsoleData } from "@/helpers/GoogleSearchConsoleDataContext";
import { dataStats } from "@/types/dataStats";
import { MdOutlineAutoGraph, MdOutlineAdsClick, MdGraphicEq } from "react-icons/md";
import { TbCirclePercentage } from "react-icons/tb";
import { Skeleton } from '@mui/material';
import millify from "millify";
import dayjs from 'dayjs';
import { useSession, signIn, signOut } from "next-auth/react"

import { Modal, Form, Input, DatePicker, Button, Select } from 'antd';
import { usePathname } from "next/navigation";
import { useProjectContext } from "@/helpers/ProjectContext";

const { RangePicker } = DatePicker;
const { Option } = Select;

const DataStatCard: React.FC<{ item: any }> = ({ item }) => (



  <div className="w-full md:w-[250px] max-w-xs rounded-[10px] bg-transparent p-6 shadow-1 dark:bg-gray-dark" style={{ backgroundColor: item.bg }}>
    <div className="flex w-full text-white gap-2 items-center justify-start rounded-full">
      {item.icon}
      <span className="text-lg font-medium">{item.title}</span>
    </div>
    <div className="flex items-end justify-between mt-2">
      <div>
        <h4 className="font-normal text-3xl text-white dark:text-white ml-8">{item.value}</h4>
      </div>
    </div>
  </div>
);

const DataStatsOne: React.FC<dataStats> = () => {
  const { data: session, status } = useSession()
  const [accessTokenGoogle, setaccessTokenGoogle] = useState("")
  useEffect(() => {
    // console.log("Session status:", status)
    // console.log("Session data:", session)
    if (session) {
      localStorage.setItem('accessTokenGoogle',session?.accessToken );
      setaccessTokenGoogle(session?.accessToken)
      // console.log("Retrieved access token:", session.accessToken);
    }
  }, [session, status])
  const{
    projects,
    isModalVisible,
    showModal,
    handleCancel,
    createProject,
    fetchProjects,
    selectedProject,
    setSelectedProject
} = useProjectContext();

  const [form] = Form.useForm();
  const [showRangePicker, setShowRangePicker] = useState(false);
  const { fetchGSCData, loading, dateData, setpredefinedDays, predefinedDays } = useGoogleSearchConsoleData();
  // console.log(selectedProject);
  

  const today = dayjs();

  // Set default date range to last 7 days
  useEffect(() => {
    const defaultRange = [today.subtract(7, 'days').format('YYYY-MM-DD'), today.format('YYYY-MM-DD')];
    form.setFieldsValue({ dateRange: defaultRange });
    // fetchGSCData(selectedProject?.project_id, selectedProject?.project_url, defaultRange); 
  }, []);

  const handleDateChange = (dates: any) => {
    if (dates) {
      const startDate = dates[0].format('YYYY-MM-DD');
      const endDate = dates[1].format('YYYY-MM-DD');
      fetchGSCData(accessTokenGoogle, selectedProject?.project_url, [startDate, endDate]); // Replace with actual project ID and URL
    }
  };

  const handlePredefinedRangeChange = (value: number) => {
    setShowRangePicker(value === 30);
    setpredefinedDays(value);
    const startDate = today.subtract(value, 'days').format('YYYY-MM-DD');
    const endDate = today.format('YYYY-MM-DD');
    
    form.setFieldsValue({
      dateRange: [startDate, endDate],
    });
    fetchGSCData(accessTokenGoogle, selectedProject?.project_url, [startDate, endDate]); // Replace with actual project ID and URL
  };


  

  // Calculate data only if dateData is not empty
  const totalClicks = dateData?.length > 0 ? dateData.reduce((acc, { clicks }) => acc + clicks, 0) : 0;
  const totalImpressions = dateData?.length > 0 ? dateData.reduce((acc, { impressions }) => acc + impressions, 0) : 0;
  const averageCtr = dateData?.length > 0 ? (dateData.reduce((acc, { ctr }) => acc + ctr, 0) / dateData.length) : 0;
  const averagePosition = dateData?.length > 0 ? (dateData.reduce((acc, { position }) => acc + position, 0) / dateData?.length) : 0;

  const dataStatsList = [
    {
      icon: <MdOutlineAdsClick className="text-xl" />,
      color: "#fff",
      bg: "#006BD7",
      title: "Total Clicks",
      value: totalClicks,
    },
    {
      icon: <MdOutlineAutoGraph className="text-xl" />,
      color: "#fff",
      bg: "#EF1649",
      title: "Total Impressions",
      value: millify(totalImpressions),
    },
    {
      icon: <TbCirclePercentage className="text-xl" />,
      color: "#fff",
      bg: "#1090D0",
      title: "Average CTR",
      value: averageCtr.toFixed(3),
    },
    {
      icon: <MdGraphicEq className="text-xl" />,
      color: "#fff",
      bg: "#F24A25",
      title: "Average Position",
      value: averagePosition.toFixed(3),
    },
  ];

  return (
    <div className="gap-4 md:grid-cols-2 md:gap-6 flex md:flex-row flex-col 2xl:gap-7.5 ">
      {loading ? (
        <>
          {dataStatsList.map((item, index) => (
            <Skeleton key={index} variant="rectangular" animation="wave" width={250} height={100} className="rounded-[10px]" />
          ))}
        </>
      ) : (
        <>
          {dataStatsList.map((item, index) => (
            <DataStatCard key={index} item={item} />
          ))}
        </>
      )}

<div className="flex flex-1 flex-col justify-between gap-4 items-center w-full  col-span-full">
      {/* Select Dropdown */}
      <div className="w-full">
        <Select
          defaultValue={7}
          onChange={handlePredefinedRangeChange}
          className="w-full border border-black text-black font-bold rounded-md text-lg"
        >
          <Option  value={7}>Last 7 days</Option>
          <Option  value={16}>Last 16 days</Option>
          <Option  value={30}>Last 30 days</Option>
        </Select>
      </div>

      {/* Conditionally show Date Range Picker */}
      {showRangePicker && (
        <div className="w-full dark:text-white">
          <Form.Item
            label="Select Date Range"
            name="dateRange"
            rules={[{ required: true, message: 'Please select a date range!' }]}
            className=" dark:text-white"
          >
            <RangePicker
              className="py-1 px-4 w-full border border-black text-black  rounded-md text-lg"
              onChange={handleDateChange}
            />
          </Form.Item>
        </div>
      )}
    </div>

    </div>
  );
};

export default DataStatsOne;
