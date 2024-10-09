"use client"
import React, { useEffect, useState } from "react";
import ChartThree from "../Charts/ChartThree";
import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableOne";

import ProjectHeader from "../ProjectHeader";
import DataStatsOne from "@/components/DataStats/DataStatsOne";
import ChartOne from "@/components/Charts/ChartOne";
import { formatDistanceToNow } from 'date-fns';

const ECommerce: React.FC = () => {

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);


  return (
    <>
          <div className="mb-4  w-full  md:mt-6 ">
    <ProjectHeader />
          </div>
          <div className="mb-4 flex items-center w-full justify-between  px-4  md:mt-6 ">
<h3 className="text-2xl font-semibold text-black">Google search console:</h3>
<h3 className="text-sm font-semibold">      Last update: {formatDistanceToNow(currentTime, { addSuffix: true })}</h3>
          </div>
          <div className=' bg-white p-7 rounded-[10px]'>
          <DataStatsOne />
          </div>

      <div className="mt-4 w-full gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <ChartOne />

        <div className="col-span-12 xl:col-span-8 mt-8">
          <TableOne />
        </div>
      </div>
    </>
  );
};

export default ECommerce;
