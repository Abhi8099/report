'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function Component() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0])

  return (
    <motion.div 
      ref={ref}
      style={{ opacity, y }}
      className='flex md:h-[60vh] h-max flex-col gap-10 sm:px-6 md:px-8 lg:px-12 xl:px-50 2xl:mt-10 xl:mt-45 mb-20'
    >
      {/* Header section */}
      <div className='flex flex-col gap-2 text-center lg:text-left'>
        <h3 className='text-2xl sm:text-3xl lg:text-[45px] font-extrabold text-black leading-tight'>How It Works?</h3>
        <h3 className='text-[#7C7C7C] font-medium text-base sm:text-lg'>
          With Analytixio, you can quickly connect all your analytics accounts and <br className="hidden sm:inline" /> create a tailored dashboard that focuses on your essential metrics.
        </h3>
      </div>

      {/* Cards section */}
      <div className='flex flex-col lg:flex-row gap-10 lg:gap-10 justify-between items-center'>
        <Card number="01" delay={0} scrollYProgress={scrollYProgress} />
        <Card number="02" delay={0.2} scrollYProgress={scrollYProgress} />
        <Card number="03" delay={0.4} scrollYProgress={scrollYProgress} />
      </div>
    </motion.div>
  )
}

function Card({ number, delay, scrollYProgress }) {
  const opacity = useTransform(scrollYProgress, 
    [0, 0.3 + delay, 0.5 + delay], 
    [0, 0, 1]
  )
  const y = useTransform(scrollYProgress, 
    [0, 0.3 + delay, 0.5 + delay], 
    [50, 50, 0]
  )

  return (
    <motion.div
      style={{ opacity, y }}
      className='h-[337px] w-[350px] md:w-[441px] bg-primary rounded-[16px] shadow-lg relative overflow-hidden group smooth3'
    >
      <div className='size-[210px] rounded-full bg-[#007bf6] group-hover:shadow-lg smooth3 flex items-center justify-center absolute -left-16 -top-20'>
        <h3 className='text-white/30 pt-15 pl-13 text-[40px] font-medium group-hover:text-white smooth3'>{number}</h3>
      </div>
      <div className='absolute bottom-0 w-full flex flex-col p-5 sm:p-[34px] gap-5'>
        <h3 className='text-white text-lg sm:text-xl font-semibold'>
          {number === "01" && "Log In & Connect Accounts"}
          {number === "02" && "Customize Your Dashboard"}
          {number === "03" && "Analyze and Generate Reports"}
        </h3>
        <h3 className='text-white/65 text-sm sm:text-base font-medium'>
          {number === "01" && "Sign in to your Analytixio account and connect your Google Analytics, Google Ads, and other platforms in a few easy clicks."}
          {number === "02" && "Tailor your dashboard to showcase key metrics that matter most to you, creating a unified view of your data."}
          {number === "03" && "Effortlessly analyze your data and generate simplified reports that can be shared with your team for informed decision-making."}
        </h3>
      </div>
    </motion.div>
  )
}