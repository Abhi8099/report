"use client"
import Image from 'next/image'
import React from 'react'
import {motion} from "framer-motion"
import { useInView } from 'react-intersection-observer';

const Benifits = () => {
    const { ref, inView } = useInView({
        triggerOnce: true, // Only trigger the animation once
        threshold: 0.1,    // Trigger when 10% of the component is visible
    });
  return (
    <motion.div
        className='h-screen flex items-center justify-center gap-12'
        ref={ref}
       initial={{ opacity: 0, y: 50 }} 
        animate={inView ? { opacity: 1, y: 0 } : {}} 
        transition={{ duration: 0.7 }}
 >
                    <Image
                        className=""
                        src={"/images/new/Group 1000004892.svg"}
                        alt="new"
                        width={500}
                        height={500}
                    />
<div className='flex flex-col gap-15'>
    <h3 className='text-[45px] font-extrabold text-black leading-tight'>How Analytixio Can <br /> Benefit You</h3>
    <div className='flex flex-col gap-4'>
        <div className='flex gap-4'>
            <div className='h-[195px] w-[307px] bg-[#F5F5F5] hover:bg-white group flex flex-col gap-2 p-4 rounded-[10px] hover:shadow-lg smooth3 hover:scale-105'>
                <h3 className='text-lg group-hover:text-primary smooth1 text-black font-semibold'>Unified Reporting Platform</h3>
                <h5 className='text-[#77838F] font-medium text-base'>Access Google Analytics, Google Search Console, Google Ads, and more from one place, eliminating the hassle of switching between multiple platforms.</h5>
            </div>
            <div className='h-[195px] w-[307px] bg-[#F5F5F5] hover:bg-white group flex flex-col gap-2 p-4 rounded-[10px] hover:shadow-lg smooth3 hover:scale-105'>
                <h3 className='text-lg group-hover:text-primary smooth1 text-black font-semibold'>Real-Time Data Analysis</h3>
                <h5 className='text-[#77838F] font-medium text-base'>Stay up to date with real-time insights into your key metrics, ensuring you can act quickly and accurately.</h5>
            </div>
            <div className='h-[195px] w-[307px] bg-[#F5F5F5] hover:bg-white group flex flex-col gap-2 p-4 rounded-[10px] hover:shadow-lg smooth3 hover:scale-105'>
                <h3 className='text-lg group-hover:text-primary smooth1 text-black font-semibold'>Customizable Dashboards</h3>
                <h5 className='text-[#77838F] font-medium text-base'>Create personalized dashboards that suit your unique needs, making your analytics experience efficient and tailored to your business.</h5>
            </div>
        </div>
        <div className='flex gap-4'>
            <div className='h-[195px] w-[307px] bg-[#F5F5F5] hover:bg-white group flex flex-col gap-2 p-4 rounded-[10px] hover:shadow-lg smooth3 hover:scale-105'>
                <h3 className='text-lg group-hover:text-primary smooth1 text-black font-semibold'>Comprehensive Reports</h3>
                <h5 className='text-[#77838F] font-medium text-base'>Generate detailed reports with ease, covering everything from traffic insights to conversion tracking, all in one tool.</h5>
            </div>
            <div className='h-[195px] w-[307px] bg-[#F5F5F5] hover:bg-white group flex flex-col gap-2 p-4 rounded-[10px] hover:shadow-lg smooth3 hover:scale-105'>
                <h3 className='text-lg group-hover:text-primary smooth1 text-black font-semibold'>Simplified Workflow</h3>
                <h5 className='text-[#77838F] font-medium text-base'>Save time by streamlining your analytics processes, reducing manual data collection, and focusing on decision-making.</h5>
            </div>
            <div className='h-[195px] w-[307px] bg-[#F5F5F5] hover:bg-white group flex flex-col gap-2 p-4 rounded-[10px] hover:shadow-lg smooth3 hover:scale-105'>
                <h3 className='text-lg group-hover:text-primary smooth1 text-black font-semibold'>Cross-Platform Integrations</h3>
                <h5 className='text-[#77838F] font-medium text-base'>Connect multiple data sources, integrating everything from SEO analytics to ad performance into a single, unified view.</h5>
            </div>
        </div>
    </div>
    <button className="flex flex-1 items-center justify-center px-4 py-3 bg-primary rounded-full w-1/4 text-white text-base">Connect With Us</button>

</div>
    </motion.div>
  )
}

export default Benifits
