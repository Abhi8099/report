"use client";
import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { GoPlus } from 'react-icons/go';
import { motion } from 'framer-motion'; 
import { useInView } from 'react-intersection-observer';

const Faq = () => {

    const { ref, inView } = useInView({
        triggerOnce: true, // Only trigger the animation once
        threshold: 0.1,    // Trigger when 10% of the component is visible
    });

    const [openIndex, setOpenIndex] = useState(0); // Set the first question as open

    const toggleAnswer = (index) => {
        setOpenIndex(openIndex === index ? null : index); // Toggle the clicked question
    };

    const faqs = [
        {
            title: 'What is Analytixio?',
            description: 'Analytixio is a platform where buyers and sellers can connect to trade Analytixio opportunities on high-quality websites.'
        },
        {
            title: 'How do I purchase a Analytixio?',
            description: 'You can purchase Analytixios by browsing through available offers, selecting the one that fits your needs, and completing the checkout process.'
        },
        {
            title: 'What payment methods do you accept?',
            description: 'We accept a variety of payment methods including PayPal, Stripe, and all major credit cards.'
        },
        {
            title: 'Can I track the status of my order?',
            description: 'Yes, you can track the status of your order by navigating to the "My Orders" section in your account dashboard.'
        }
    ];

    return (
        <motion.div 
        ref={ref}
        initial={{ opacity: 0, y: 50 }} 
        animate={inView ? { opacity: 1, y: 0 } : {}} 
        transition={{ duration: 0.7 }}
        className="flex md:h-[90vh] flex-col items-center gap-15 px-4 sm:px-8 md:px-12 xl:px-16">
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-black leading-tight text-center">
                Got Questions? We&apos;ve Got Answers!
            </h3>
            <div className="bg-white rounded-[37px] w-full  max-w-[1284px] shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16">
                {faqs.map((question, index) => (
                    <div key={index} className="flex flex-col mb-6 sm:mb-8 lg:mb-10 border-b pb-4 sm:pb-5">
                        <div className="flex justify-between items-center">
                            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-400 mr-3 font-bold">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <div className="flex items-center justify-start w-3/4">
                                <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">{question.title}</span>
                            </div>
                            {openIndex === index ? (
                                <div
                                    className="bg-primary h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center cursor-pointer button-transition button-visible"
                                    onClick={() => toggleAnswer(index)}
                                >
                                    <GoPlus className="text-white text-lg sm:text-xl md:text-2xl rotate-45 smooth3" />
                                </div>
                            ) : (
                                <div
                                    className="cursor-pointer button-transition button-visible group hover:bg-primary h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center smooth3"
                                    onClick={() => toggleAnswer(index)}
                                >
                                    <GoPlus className="text-primary text-lg sm:text-xl md:text-2xl group-hover:text-white smooth3" />
                                </div>
                            )}
                        </div>
                        {openIndex === index && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }} // Animation starting point
                                animate={{ opacity: 1, height: "auto" }} // When opened
                                exit={{ opacity: 0, height: 0 }} // When closed
                                transition={{ duration: 0.5 }} // Smooth animation duration
                                className="mt-4 text-gray-600 ml-8 2xl:ml-39 sm:ml-12 md:ml-16 lg:ml-20 "
                            >
                                <p>{question.description}</p>
                            </motion.div>
                        )}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default Faq;
