"use client"

import React from 'react'
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';
import { BsPinterest } from 'react-icons/bs';
import { motion } from "framer-motion"
import { useInView } from 'react-intersection-observer';

export function FooterFour() {
    const { ref, inView } = useInView({
        triggerOnce: true, // Only trigger the animation once
        threshold: 0.1,    // Trigger when 10% of the component is visible
    });

    // Define the staggering animation variants
    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.section
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ duration: 0.7, staggerChildren: 0.3 }} // Staggering effect
            className="w-full h-[390px] flex flex-col gap-4 items-center justify-center pt-12 sm:pt-16 lg:pt-20  bgfooter"
        >
            <motion.h3
                variants={variants}
                className='text-center text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-semibold text-white'
            >
                Analytixio
            </motion.h3>
            <motion.h3
                variants={variants}
                className='text-center text-sm sm:text-base font-medium text-white/65 max-w-[90%] sm:max-w-[80%] lg:max-w-[70%]'
            >
               Your all-in-one analytics dashboard for data-driven decisions.

            </motion.h3>
            <motion.div className='flex flex-wrap gap-4 sm:gap-6 justify-center' variants={variants}>
                <Link href={"/"} className='text-sm sm:text-[17px] font-medium text-white'>Home</Link>
                <Link href={"/"} className='text-sm sm:text-[17px] font-medium text-white'>Features</Link>
                <Link href={"/"} className='text-sm sm:text-[17px] font-medium text-white'>Plans & pricing</Link>
                <Link href={"/"} className='text-sm sm:text-[17px] font-medium text-white'>Resources</Link>
            </motion.div>
            {/* <motion.div className='flex gap-3 sm:gap-4 mt-4' variants={variants}>
                <Link href={"/"} className='font-medium text-white'><FaFacebook className='text-xl sm:text-2xl' /></Link>
                <Link href={"/"} className='font-medium text-white'><FaInstagram className='text-xl sm:text-2xl' /></Link>
                <Link href={"/"} className='font-medium text-white'><BsPinterest className='text-xl sm:text-2xl' /></Link>
                <Link href={"/"} className='font-medium text-white'><FaLinkedinIn className='text-xl sm:text-2xl' /></Link>
            </motion.div> */}
            <motion.h3
                variants={variants}
                className='text-center text-xs sm:text-sm text-white mt-4'
            >
                Copyright © - All right reserved by Me!
            </motion.h3>
        </motion.section>
    )
}
