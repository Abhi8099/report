import React from 'react'
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ECommerce from "@/components/Dashboard/E-commerce";
import ProjectHeader from '@/components/ProjectHeader';
import { RiArrowDropDownLine } from 'react-icons/ri';
import ChartAnalytics from '@/components/Charts/ChartAnalytics';




const Analytics = () => {
  return (
    <DefaultLayout>
          <div className="mb-4  w-full  md:mt-6 ">
    <ProjectHeader />
          </div>
          <div className="mb-4 flex items-center w-full justify-between  px-4  md:mt-6 ">
<h3 className="text-2xl font-semibold text-black">Google Analytics:</h3>
          </div>
          <div className="mb-4 flex  flex-col items-center w-full   px-11 py-8 h-[607px]  md:mt-6 bg-white rounded-[10px] ">
          <div className='flex justify-between items-center w-full'>
  <div className='flex gap-2'>
    <div className='flex flex-col gap-0.5'>
      <select name="" id="">
        <option value="">Active users</option>
        <option value="">Active users</option>
        <option value="">Active users</option>
      </select>
      <h3>1.2K</h3>
      <h3>25.8%</h3>
    </div>
  </div>
  <div className="flex justify-end">
    <button className="bg-[#F8F8F8] text-base flex font-medium text-primary h-[43px] px-4 py-2 rounded">
      Last 30 days <RiArrowDropDownLine className="text-[26px]" />
    </button>
  </div>
</div>
<ChartAnalytics/>
          </div>
          <div className="mb-4 flex items-center w-full justify-between  px-4  md:mt-6 ">
<h3 className="text-2xl font-semibold text-black">Suggested for you:</h3>
          </div>
<div className='flex justify-between px-11 py-8   md:mt-6'>
<div className="mb-4 flex flex-[2]  flex-col items-center w-full  bg-white rounded-[10px] ">

            </div>
          <div className="mb-4 flex flex-1  flex-col items-center w-full  bg-white rounded-[10px] ">
            

            </div>
</div>
  </DefaultLayout>
  )
}

export default Analytics
