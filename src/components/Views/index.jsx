"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';

const imageMapping = {
  dashboard: "/images/new/console.svg",
  analytics: "/images/new/Group 1000004935.svg",
  console: "/images/new/console.svg",
  ads: "/images/new/Group 1000004935.svg",
};

const Views = () => {
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
        const nextIndex = (keys.indexOf(prev) + 1) % keys.length; // Get the next key cyclically
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
      className='flex flex-col gap-15 lg:px-25 md:px-12.5 xl:px-50'>
      <div className='flex flex-col gap-4'>
        <h3 className='text-[45px] font-extrabold text-black leading-tight text-center'>Quick Views of Your Dashboard</h3>
        <div className='gap-4 flex items-center justify-center'>
          {Object.keys(imageMapping).map((key) => (
            <motion.button
              key={key}
              className={`px-10 py-3 rounded-[10px] border-[2px] smooth3 font-semibold border-primary hover:text-white hover:bg-primary ${active === key ? "text-white bg-primary" : "bg-white text-primary"}`}
              onClick={() => setActive(key)}
              whileHover={{ scale: 1.05 }} // Scale up on hover
              transition={{ type: "spring", stiffness: 300 }}
              onMouseEnter={() => setCurrentImage(imageMapping[key])} // Change image on hover
            >
              {key === "dashboard" ? "Dashboard" :
               key === "analytics" ? "Google Analytics" :
               key === "console" ? "Google Search Console" :
               "Google Ads"}
            </motion.button>
          ))}
        </div>
      </div>
      
      <motion.div
        key={currentImage} // Add key for animation reset on image change
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }} // Exit animation
        transition={{ type: "spring", stiffness: 200,  ease: "linear",duration: 5 }}
        className='h-[87vh]'
      >
        <Image
          src={currentImage}
          alt="current view"
          width={2000}
          height={2000}
        />
      </motion.div>

      <div className='flex items-center justify-center'>
        <button className="w-[200px] px-10 py-3 bg-primary rounded-full text-white text-base">Get Started Free</button>
      </div>
    </motion.div>
  );
}

export default Views;
