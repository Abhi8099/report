"use client"
import React from 'react'
import {motion} from "framer-motion"
import { useInView } from 'react-intersection-observer';

const   Works = () => {
  const { ref, inView } = useInView({
    triggerOnce: true, 
    threshold: 0.1,   
});

  return (
    <motion.div 
    ref={ref}
    initial={{ opacity: 0, y: 50 }} 
    animate={inView ? { opacity: 1, y: 0 } : {}} 
    transition={{ duration: 0.7 }}
    className='flex flex-col gap-15  lg:px-25 md:px-12.5 xl:px-50 mt-15 mb-40'>
      <div className='flex flex-col gap-2'>
      <h3 className='text-[45px] font-extrabold text-black leading-tight'>How It Works?</h3>
      <h3 className='text-[#7C7C7C ] font-medium text-lg'>With Analytixio, you can quickly connect all your analytics accounts and <br /> create a tailored dashboard that focuses on your essential metrics.</h3>
      </div>

      <div className='flex gap-15 justify-between'>
        <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, delay:0.3 }}

        
        className='h-[337px] w-[441px] bg-primary rounded-[16px] shadow-lg relative overflow-hidden group smooth3'>
            <div className='size-[210px] rounded-full bg-[#007bf6] group-hover:shadow-lg smooth3  flex items-center justify-center absolute -left-16 -top-20 '>
                <h3 className='text-white/30 text-[40px] pt-15  pl-13 font-medium  group-hover:text-white smooth3 '>01</h3>
            </div>
<div className='absolute bottom-0 w-full  flex flex-col p-[34px] gap-5 '>
<h3 className='text-white text-xl font-semibold'>Log In & <br />
Connect Accounts</h3>
<h3 className='text-white/65 text-base font-medium'>Sign in to your Analytixio account and connect your Google Analytics, Google Ads, and other platforms in a few easy clicks.</h3>
</div>
        </motion.div>
        <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, delay:0.5 }}
         className='h-[337px] w-[441px] bg-primary rounded-[16px] shadow-lg relative overflow-hidden group smooth3'>
            <div className='size-[210px] rounded-full bg-[#007bf6] group-hover:shadow-lg smooth3  flex items-center justify-center absolute -left-16 -top-20 '>
                <h3 className='text-white/30 text-[40px] pt-15  pl-13 font-medium  group-hover:text-white smooth3 '>02</h3>
            </div>
<div className='absolute bottom-0 w-full  flex flex-col p-[34px] gap-5 '>
<h3 className='text-white text-xl font-semibold'>Customize Your <br /> Dashboard</h3>
<h3 className='text-white/65 text-base font-medium'>Tailor your dashboard to showcase key metrics that matter most to you, creating a unified view of your data.</h3>
</div>
        </motion.div>
        <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, delay:0.7 }}
         className='h-[337px] w-[441px] bg-primary rounded-[16px] shadow-lg relative overflow-hidden group smooth3'>
            <div className='size-[210px] rounded-full bg-[#007bf6] group-hover:shadow-lg smooth3  flex items-center justify-center absolute -left-16 -top-20 '>
                <h3 className='text-white/30 text-[40px] pt-15  pl-13 font-medium  group-hover:text-white smooth3 '>03</h3>
            </div>
<div className='absolute bottom-0 w-full  flex flex-col p-[34px] gap-5 '>
<h3 className='text-white text-xl font-semibold'>Analyze and <br /> Generate Reports</h3>
<h3 className='text-white/65 text-base font-medium'>Effortlessly analyze your data and generate simplified reports that can be shared with your team for informed decision-making.</h3>
</div>
        </motion.div>

      </div>
    </motion.div>
  )
}

export default Works
