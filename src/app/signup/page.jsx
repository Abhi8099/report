  "use client"
import React, { useState } from 'react';
import HeaderComp from "@/components/HeaderComp";
import { FooterFour } from "@/components/Footer";
import Image from 'next/image';
import { FaInstagram } from "react-icons/fa";
import { IoMdEyeOff, IoMdEye  } from "react-icons/io";
import { BsPinterest } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import Link from 'next/link';
import { FaLinkedinIn } from "react-icons/fa";
import { toast } from 'react-hot-toast';
import axios from "axios";
import { BASE_URL } from '@/utils/api';
import { motion } from 'framer-motion'; 
import { FcGoogle } from "react-icons/fc";
import { signIn } from 'next-auth/react';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: ''
  });
  const[isVisible, setIsVisible] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = '';
    switch (name) {
      case 'fullName':
        errorMsg = value ? '' : 'Full Name is required';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        errorMsg = emailRegex.test(value) ? '' : 'Enter a valid email';
        break;
      case 'mobile':
        const mobileRegex = /^[0-9]{10}$/;
        errorMsg = mobileRegex.test(value) ? '' : 'Enter a valid 10-digit mobile number';
        break;
      case 'password':
        errorMsg = value.length >= 6 ? '' : 'Password must be at least 6 characters';
        break;
      default:
        break;
    }
    setErrors({ ...errors, [name]: errorMsg });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log("data",formData);
      const response = await axios.post(
        `${BASE_URL}register/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
console.log("res",response);
      toast.success("Signup successful");
      router.push("/signin");
    } catch (error) {

        toast.error(error.response);
    }
  };
  const handleGoogleSignIn = () => {
    signIn('google', {
      callbackUrl: 'http://localhost:3000/api/auth/callback/google',
    });
  };

  return (
<>
  <HeaderComp />
  <motion.div
  initial={{opacity:0}}
  animate={{opacity:1}}
  transition={{ease:"linear"}}
  className='h-screen flex items-center justify-center px-4 md:px-60 text-black'>
    <div className="h-[746px] w-full  flex flex-col md:flex-row shadow-lg bg-gradient-to-b from-primary to-[#fff] rounded-[37px]">
      <div className="hidden md:flex flex-1 flex-col gap-6 items-center justify-center bg-primary rounded-l-[37px] rounded-br-[37px] text-white">
        <h3 className='text-[43px] font-semibold text-white'>Analytixio</h3>
        <h3 className='text-base text-center font-medium text-white/65'>
          Lorem Ipsum is simply dummy text of the <br /> printing and typesetting industry.
        </h3>
        <Image alt='amico' src={"/images/new/amico.svg"} width={400} height={400} className='object-cover' />
      </div>
      <div className="flex flex-1 bg-white rounded-r-[37px] rounded-tl-[37px] flex-col gap-6 items-center justify-center p-6">
        <div className='w-full max-w-[550px] flex flex-col gap-4'>
          <Image alt='amico' src={"/images/new/Group.svg"} width={50} height={50} className='object-cover' />
          <h3 className='text-[28px] font-semibold text-black text-start'>Create Account</h3>
          <div className='flex flex-col gap-8 w-full'>
  {['fullName', 'email', 'mobile', 'password'].map((field, index) => (
    <div className="w-full" key={index}>
      <div className="relative w-full">
        <input
          className={`w-full outline-none py-3 border-b ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
          placeholder={field === 'fullName' ? 'Full Name' : field === 'email' ? 'Email Address' : field === 'mobile' ? 'Mobile No.' : 'Password'}
          type={field === 'password' ? (isVisible ? "text" : "password") : "text"}
          name={field}
          value={formData[field]}
          onChange={handleChange}
        />
        {field === 'password' && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            {isVisible ? (
              <IoMdEye className='text-2xl cursor-pointer' onClick={() => setIsVisible(!isVisible)} />
            ) : (
              <IoMdEyeOff className='text-2xl cursor-pointer' onClick={() => setIsVisible(!isVisible)} />
            )}
          </div>
        )}
      </div>
      {errors[field] && <span className="text-red-500 text-sm">{errors[field]}</span>}
    </div>
  ))}
</div>

          <button
            onClick={handleSubmit}
            className='w-full py-3 bg-primary text-white flex items-center justify-center disabled:opacity-50 rounded-lg disabled:cursor-not-allowed'
            disabled={!formData.fullName || !formData.email || !formData.mobile || !formData.password || Object.values(errors).some(err => err !== '')}
          >
            Create Account
          </button>
          {/* <button
      onClick={handleGoogleSignIn}
            className='w-full py-3 border gap-2 border-primary text-primary flex items-center justify-center disabled:opacity-50 rounded-lg disabled:cursor-not-allowed'
          >
            <FcGoogle className='text-xl' />Sign Up With Google
          </button> */}
          <h3 className='text-center text-[#948F8F] font-medium w-full flex items-center justify-center gap-2'>
            Already have an account? <Link href={"/signin"} className='text-primary font-semibold hover:scale-105 hover:underline smooth3'>Login</Link>
          </h3>

        </div>
      </div>
    </div>
  </motion.div>
  <FooterFour />
</>

  );
};

export default Signup;
