"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import { useRouter } from 'next/navigation';

const imageMapping = {
  dashboard: "/images/new/console.svg",
  analytics: "/images/new/Group 1000004935.svg",
  console: "/images/new/console.svg",
  ads: "/images/new/Group 1000004935.svg",
};

const Views = () => {
  const router = useRouter()
  const [active, setActive] = useState("dashboard");
  const [currentImage, setCurrentImage] = useState(imageMapping[active]);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(prev => {
        const keys = Object.keys(imageMapping);
        const nextIndex = (keys.indexOf(prev) + 1) % keys.length;
        return keys[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentImage(imageMapping[active]);
  }, [active]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className='md:flex flex-col my-5  gap-8 sm:gap-10 lg:gap-15 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-50  hidden mt-203 lg:mt-0'>
      
      {/* Heading */}
      <div className='flex flex-col gap-8'>
        <h3 className='text-2xl sm:text-3xl md:text-4xl xl:text-[45px] font-extrabold text-black leading-tight text-center'>
          Quick Views of Your Dashboard
        </h3>
        
        {/* Button Group */}
        <div className='gap-2 sm:gap-4 flex flex-col sm:flex-row items-center justify-center'>
          {Object.keys(imageMapping).map((key) => (
            <motion.button
              key={key}
              className={`px-6 sm:px-8 lg:px-10 py-2 sm:py-3 rounded-[10px] border-[2px] smooth3 font-semibold border-primary hover:text-white hover:bg-primary ${active === key ? "text-white bg-primary" : "bg-white text-primary"}`}
              onClick={() => setActive(key)}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              onMouseEnter={() => setCurrentImage(imageMapping[key])}
            >
              {key === "dashboard" ? "Dashboard" :
               key === "analytics" ? "Google Analytics" :
               key === "console" ? "Google Search Console" :
               "Google Ads"}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Image Display */}
      <div className='flex items-center justify-center'>
      <motion.div
        key={currentImage}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ type: "spring", stiffness: 200, ease: "linear", duration: 5 }}
        className=' md:h-[40vh] h-[30vh] lg:h-[60vh] xl:h-[87vh] w-full'>
        <Image
          src={currentImage}  
          alt="current view"
          layout="fill"
          objectFit="contain"
          priority

        />
      </motion.div>
      </div>
      {/* Call-to-action Button */}
      <div className='flex items-center justify-center'>
        <button 
        onClick={() => router.push('signin')}
        className="w-[200px] px-8 sm:px-10 py-2 sm:py-3 bg-primary rounded-full text-white text-sm sm:text-base hover:text-primary hover:bg-white hover:border-primary border border-white smooth3">
          Get Started Free
        </button>
      </div>
    </motion.div>
  );
}

export default Views;
