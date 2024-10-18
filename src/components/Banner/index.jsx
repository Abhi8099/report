"use client"
import Image from 'next/image';
import React from 'react'
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

const people = [
    {
        id: 1,
        name: "John Doe",
        designation: "Software Engineer",
        image:
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
    },
    {
        id: 2,
        name: "Robert Johnson",
        designation: "Product Manager",
        image:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    {
        id: 3,
        name: "Jane Smith",
        designation: "Data Scientist",
        image:
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    {
        id: 4,
        name: "Emily Davis",
        designation: "UX Designer",
        image:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    {
        image:
            "/images/Group 1000004966.svg",
    },

];

const Banner = () => {

    return (
        <div className='flex flex-col xl:flex-row w-full h-screen xl:pl-45 xl:pt-41'>
            <div className='flex flex-col items-start justify-center gap-7 px-5 pt-10 xl:pr-10 xl:pt-0 xl:-mt-20'>
                <h1 className='text-[30px] sm:text-[36px] lg:text-[45px] xl:text-[55px] text-black font-extrabold leading-tight'>
                    Multiple Reports, <br />
                    One Solution <br />
                    Simplify your workflow <br />
                    with Analytixio
                </h1>
                <h3 className='text-[#7C7C7C] font-medium text-sm sm:text-base xl:text-lg'>
                    Your all-in-one analytics dashboard for data-driven decisions.
                </h3>
                <div className='flex flex-col gap-2'>
                    <h3 className='text-sm sm:text-base text-black font-semibold'>Integrated Platforms</h3>
                    <Image
                        src={"/images/new/Group 1000004888.svg"}
                        alt="new"
                        width={100}
                        height={100}
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <button className="flex items-center justify-center px-5 py-2 sm:px-10 sm:py-3 bg-primary rounded-full text-white text-sm sm:text-base hover:text-primary hover:bg-white hover:border-primary border border-white transition">
                        Get Started Free
                    </button>
                    <div className="flex flex-row items-center">
                        <AnimatedTooltip items={people} />
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-center xl:justify-end flex-1'>
                <Image
                    src={"/images/new/Group 1000004972.svg"}
                    alt="new"
                    width={950}
                    height={950}
                    className="w-full xl:w-auto"
                />
            </div>
        </div>
    )
}

export default Banner;
