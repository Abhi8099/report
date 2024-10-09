"use client";

import Image from 'next/image';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LiaArrowLeftSolid, LiaArrowRightSolid } from "react-icons/lia";
import { useInView } from 'react-intersection-observer';

const cards = [
  {
    id: 1,
    image: "/images/user/user-01.png",
    alt: "Image 1",
    text: '"On the Windows talking painted pasture yet its express parties use. Sure last upon he same as knew next. Of believed or diverted no."',
    author: "Dinesh Singh",
    location: "Mumbai, India",
  },
  {
    id: 2,
    image: "/images/user/user-02.png",
    alt: "Image 2",
    text: '"She was amazed at the beautiful landscape. The horizon painted itself with warm colors, and she felt at peace."',
    author: "Priya Sharma",
    location: "Delhi, India",
  },
  {
    id: 3,
    image: "/images/user/user-03.png",
    alt: "Image 3",
    text: '"The project was a great success, and everyone involved felt a sense of accomplishment."',
    author: "Rohit Verma",
    location: "Bangalore, India",
  }
];

const Testimonial = () => {

  const { ref, inView } = useInView({
    triggerOnce: true, // Only trigger the animation once
    threshold: 0.1,    // Trigger when 10% of the component is visible
});

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const rotateCards = (direction) => {
    setIsAnimating(true);
    setTimeout(() => {
      if (direction === 'next') {
        setActiveIndex((prev) => (prev + 1) % cards.length);
      } else {
        setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
      }
      setIsAnimating(false);
    }, 800);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      rotateCards('next');
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleButtonClick = (index) => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsAnimating(false);
    }, 800);
  };

  return (
    <motion.div
    ref={ref}
    initial={{ opacity: 0, y: 50 }} 
    animate={inView ? { opacity: 1, y: 0 } : {}} 
    transition={{ duration: 0.7 }}
    
    className='flex h-[80vh] flex-row gap-15 lg:px-25 md:px-12.5 xl:px-50'>
      <div className='flex flex-1 items-center justify-center bgTestimonial'>
        <div className="relative w-[450px] h-[200px] ">
          {cards.map((card, index) => {
            const cardIndex = (index - activeIndex + cards.length) % cards.length;
            return (
              <motion.div
                key={card.id}
                className={`absolute ${cardIndex === 0 ? '-bottom-0 -right-0' : cardIndex === 1 ? '-bottom-10 -right-10' : '-bottom-20 -right-20'} h-[245px] w-[504px] bg-white rounded-[10px] shadow-xl p-5 pt-6`}
                initial={{ opacity: 1, y: 0 }}
                animate={{
                  opacity: cardIndex === 0 && isAnimating ? 0 : 1,
                  y: cardIndex === 0 && isAnimating ? -50 : 0,
                  zIndex: cardIndex === 0 ? 3 : cardIndex === 1 ? 2 : 1,
                }}
                transition={{ duration: 0.8 }}
              >
                <div className="absolute -top-5 -left-5">
                  <Image
                    src={card.image}
                    alt={card.alt}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                </div>
                <p className="text-base font-medium text-[#6A707E] mb-2 mt-5">{card.text}</p>
                <h4 className="text-lg font-semibold text-black">{card.author}</h4>
                <span className="text-sm text-[#6A707E]">{card.location}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className='flex flex-1 flex-col gap-10 items-center justify-center'>
        <h3 className='text-[45px] font-extrabold text-black leading-tight text-start'>
          What people say <br /> about Us.
        </h3>
        <div className='flex gap-8 items-center justify-start -ml-24'>
          <div 
            className='h-12 w-12 text-[#6A707E] hover:text-primary hover:border-primary smooth3 border-[#6A707E] rounded-full border cursor-pointer flex items-center justify-center'
            onClick={() => rotateCards('prev')}
          >
            <LiaArrowLeftSolid className='text-2xl' />
          </div>

          {cards.map((_, index) => (
            <button
              key={index}
              className={`h-3 w-3 rounded-full ${activeIndex === index ? 'bg-primary' : 'bg-[#D1D3D4]'}`}
              onClick={() => handleButtonClick(index)}
            ></button>
          ))}

          <div 
            className='h-12 w-12 rounded-full hover:text-primary hover:border-primary smooth3 text-[#6A707E] border-[#6A707E] border cursor-pointer flex items-center justify-center'
            onClick={() => rotateCards('next')}
          >
            <LiaArrowRightSolid className='text-2xl' />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Testimonial;