"use client"
import Image from 'next/image'
import React from 'react'
import {motion} from "framer-motion"
import { useInView } from 'react-intersection-observer';
import { useRouter } from 'next/navigation';

const Benifits = () => {
    const router = useRouter()
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
<motion.div
    className="h-auto xl:h-screen flex flex-col 2xl:flex-row items-center justify-center gap-6 sm:gap-8 xl:gap-12 p-4 sm:px-6 md:px-8 lg:px-12 xl:px-50 xl:mb-80 2xl:m-0"
    ref={ref}
    initial={{ opacity: 0, y: 50 }} 
    animate={inView ? { opacity: 1, y: 0 } : {}} 
    transition={{ duration: 0.7 }}
>
    <Image
        className="mb-6 xl:mb-0 w-full max-w-[400px] 2xl:max-w-none"
        src={"/images/new/Group 1000004892.svg"}
        alt="new"
        width={500}
        height={500}
    />
    <div className="flex flex-col gap-6 sm:gap-8 mb-10 xl:mb-0">
        <h3 className="text-[clamp(24px,5vw,45px)] font-extrabold text-black leading-tight text-center xl:text-left">
            How Analytixio Can <br /> Benefit You
        </h3>
        <div className="flex flex-col gap-4">
            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-3 gap-4">
                <div className="h-auto md:h-[195px] w-full bg-[#F5F5F5] hover:bg-white group flex flex-col gap-2 p-4 rounded-[10px] hover:shadow-lg smooth3 hover:scale-105">
                    <h3 className="text-lg group-hover:text-primary smooth1 text-black font-semibold">Unified Reporting Platform</h3>
                    <h5 className="text-[#77838F] font-medium text-sm sm:text-base">Access Google Analytics, Google Search Console, Google Ads, and more from one place, eliminating the hassle of switching between multiple platforms.</h5>
                </div>
                <div className="h-auto md:h-[195px] w-full bg-[#F5F5F5] hover:bg-white group flex flex-col gap-2 p-4 rounded-[10px] hover:shadow-lg smooth3 hover:scale-105">
                    <h3 className="text-lg group-hover:text-primary smooth1 text-black font-semibold">Real-Time Data Analysis</h3>
                    <h5 className="text-[#77838F] font-medium text-sm sm:text-base">Stay up to date with real-time insights into your key metrics, ensuring you can act quickly and accurately.</h5>
                </div>
                <div className="h-auto md:h-[195px] w-full bg-[#F5F5F5] hover:bg-white group flex flex-col gap-2 p-4 rounded-[10px] hover:shadow-lg smooth3 hover:scale-105">
                    <h3 className="text-lg group-hover:text-primary smooth1 text-black font-semibold">Customizable Dashboards</h3>
                    <h5 className="text-[#77838F] font-medium text-sm sm:text-base">Create personalized dashboards that suit your unique needs, making your analytics experience efficient and tailored to your business.</h5>
                </div>
            </div>
            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-4">
                <div className="h-auto md:h-[195px] w-full bg-[#F5F5F5] hover:bg-white group flex flex-col gap-2 p-4 rounded-[10px] hover:shadow-lg smooth3 hover:scale-105">
                    <h3 className="text-lg group-hover:text-primary smooth1 text-black font-semibold">Comprehensive Reports</h3>
                    <h5 className="text-[#77838F] font-medium text-sm sm:text-base">Generate detailed reports with ease, covering everything from traffic insights to conversion tracking, all in one tool.</h5>
                </div>
                <div className="h-auto md:h-[195px] w-full bg-[#F5F5F5] hover:bg-white group flex flex-col gap-2 p-4 rounded-[10px] hover:shadow-lg smooth3 hover:scale-105">
                    <h3 className="text-lg group-hover:text-primary smooth1 text-black font-semibold">Simplified Workflow</h3>
                    <h5 className="text-[#77838F] font-medium text-sm sm:text-base">Save time by streamlining your analytics processes, reducing manual data collection, and focusing on decision-making.</h5>
                </div>
                <div className="h-auto md:h-[195px] w-full bg-[#F5F5F5] hover:bg-white group flex flex-col gap-2 p-4 rounded-[10px] hover:shadow-lg smooth3 hover:scale-105">
                    <h3 className="text-lg group-hover:text-primary smooth1 text-black font-semibold">Cross-Platform Integrations</h3>
                    <h5 className="text-[#77838F] font-medium text-sm sm:text-base">Connect multiple data sources, integrating everything from SEO analytics to ad performance into a single, unified view.</h5>
                </div>
            </div>
        </div>
        <button 
        onClick={() => router.push('signin')}
        className="flex items-center justify-center px-4 py-3 bg-primary rounded-full w-full md:w-1/3 xl:w-1/4 text-white text-base hover:text-primary hover:bg-white hover:border-primary border border-white smooth3">
            Connect With Us
        </button>
    </div>
</motion.div>

    )
}

export default Benifits;
