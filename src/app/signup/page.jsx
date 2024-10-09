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

  return (
    <>
      <HeaderComp />
      <div className='h-screen flex items-center justify-center px-60 text-black'>
        <div className="h-[746px] w-full flex shadow-lg bg-gradient-to-b from-primary to-[#fff] rounded-[37px]">
          <div className="flex flex-1 flex-col gap-6 items-center justify-center bg-primary rounded-l-[37px] rounded-br-[37px] text-white">
            <h3 className='text-[43px] font-semibold text-white'>Analytixio</h3>
            <h3 className='text-base text-center font-medium text-white/65'>
              Lorem Ipsum is simply dummy text of the <br /> printing and typesetting industry.
            </h3>
            <Image alt='amico' src={"/images/new/amico.svg"} width={400} height={400} className='object-cover' />
          </div>
          <div className="flex flex-1 bg-white rounded-r-[37px] rounded-tl-[37px] flex-col gap-6 items-center justify-center ">
            <div className='w-[550px] flex flex-col gap-6'>
              <Image alt='amico' src={"/images/new/Group.svg"} width={50} height={50} className='object-cover' />
              <h3 className='text-[28px] font-semibold text-black'>Create Account</h3>
              <div className='flex flex-col gap-8 w-full'>
                <div className="w-full">
                  <input
                    className={`w-full outline-none py-3 border-b ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder='Full Name'
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName}</span>}
                </div>
                <div className="w-full">
                  <input
                    className={`w-full outline-none border-b py-3 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder='Email Address'
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                </div>
                <div className="w-full">
                  <input
                    className={`w-full outline-none border-b py-3 ${errors.mobile ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder='Mobile No.'
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                  {errors.mobile && <span className="text-red-500 text-sm">{errors.mobile}</span>}
                </div>
                <div className="w-full flex justify-between items-center gap-4">
                  <div className="w-full">
                    <input
                      className={`w-full outline-none border-b py-3 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder='Password'
                      type={isVisible? "text":"password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                  </div>{isVisible? 
                  <IoMdEye className='text-2xl cursor-pointer' onClick={() => setIsVisible(!isVisible)} />
                  :
                  <IoMdEyeOff className='text-2xl cursor-pointer' onClick={() => setIsVisible(!isVisible)} />
                  }
                </div>
              </div>
              <button
              onClick={handleSubmit}
                className='w-full py-3 bg-primary text-white py-2 flex items-center justify-center disabled:opacity-50 rounded-lg disabled:cursor-not-allowed'
                disabled={!formData.fullName || !formData.email || !formData.mobile || !formData.password || Object.values(errors).some(err => err !== '')}
              >
                Create Account
              </button>
              <h3 className='text-center text-[#948F8F] font-medium w-full flex items-center justify-center gap-2'>Already have an account? <Link href={"/signin"} className='text-primary font-semibold hover:scale-105 hover:underline smooth3'>Login</Link></h3>
              <h3 className='text-center w-full flex items-center justify-center gap-2 font-semibold'>Follow - <FaFacebook className='text-primary text-lg' /><FaInstagram className='text-primary text-lg' /><FaLinkedinIn className='text-primary text-lg' /><BsPinterest className='text-primary text-lg' /></h3>
            </div>
          </div>
        </div>
      </div>
      <FooterFour />
    </>
  );
};

export default Signup;
