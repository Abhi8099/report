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
            className="w-full flex flex-col gap-4 items-center justify-center pt-20 h-100 bgfooter"
        >
            <motion.h3
                variants={variants}
                className='text-center text-[42px] font-semibold text-white'
            >
                Analytixio
            </motion.h3>
            <motion.h3
                variants={variants}
                className='text-center text-base font-medium text-white/65'
            >
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae minus qui consequuntur accusantium,
                <br /> totam aperiam corrupti nesciunt doloremque odio fugiat, ea eaque cumque cum.
            </motion.h3>
            <motion.div className='flex gap-6' variants={variants}>
                <Link href={"/"} className='text-[17px] font-medium text-white'>Home</Link>
                <Link href={"/"} className='text-[17px] font-medium text-white'>Features</Link>
                <Link href={"/"} className='text-[17px] font-medium text-white'>Plans & pricing</Link>
                <Link href={"/"} className='text-[17px] font-medium text-white'>Resources</Link>
            </motion.div>
            <motion.div className='flex gap-4' variants={variants}>
                <Link href={"/"} className='font-medium text-white'><FaFacebook className='text-2xl' /></Link>
                <Link href={"/"} className='font-medium text-white'><FaInstagram className='text-2xl' /></Link>
                <Link href={"/"} className='font-medium text-white'><BsPinterest className='text-2xl' /></Link>
                <Link href={"/"} className='font-medium text-white'><FaLinkedinIn className='text-2xl' /></Link>
            </motion.div>
            <motion.h3
                variants={variants}
                className='text-center text-sm text-white'
            >
                Copyright © - All right reserved by Me!
            </motion.h3>
        </motion.section>
    )
}
