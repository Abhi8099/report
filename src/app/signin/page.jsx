"use client"
import React, { useState } from 'react';
import HeaderComp from "@/components/HeaderComp";
import { FooterFour } from "@/components/Footer";
import Image from 'next/image';
import { FaInstagram } from "react-icons/fa";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { BsPinterest } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import Link from 'next/link';
import { FaLinkedinIn } from "react-icons/fa";
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import axios from "axios";
import { BASE_URL } from '@/utils/api';
import { useRouter } from 'next/navigation';



const Signin = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });
    const [isVisible, setIsVisible] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let errorMsg = '';
        switch (name) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                errorMsg = emailRegex.test(value) ? '' : 'Enter a valid email';
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
            // console.log("data", formData);
            const response = await axios.post(
                `${BASE_URL}login/`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // console.log("res", response);
            toast.success("Signin successful");
            Cookies.set('login_access_token', response.data.access, {
                expires: 1,  // Token expiration (1 day in this case)
                path: '/',
                secure: process.env.NODE_ENV === 'production',  // Send cookie over HTTPS only in production
                sameSite: 'Strict',  // Protect against CSRF
            });

            Cookies.set('login_refresh_token', response.data.refresh, {
                expires: 7,  // Refresh token expiration (e.g., 7 days)
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
            });
            router.push("/google-console");
        } catch (error) {
            console.log(error.response);
        }
    };

    return (
        <>
            <HeaderComp />
            <div className='h-screen flex items-center justify-center px-60 text-black'>
                <div className="h-[746px] w-full flex shadow-lg bg-gradient-to-b from-primary to-[#fff] rounded-[37px]">
                    <div className="flex flex-1 flex-col gap-6 items-center justify-center bg-primary rounded-l-[37px] rounded-br-[37px] text-white">
                        <h3 className='text-[27px]  text-white'>Hello,</h3>
                        <h3 className='text-[43px] font-semibold text-white'>Welcome</h3>

                        <Image alt='amico' src={"/images/new/panaa.svg"} width={500} height={500} className='object-cover' />
                    </div>
                    <div className="flex flex-1 bg-white rounded-r-[37px] rounded-tl-[37px] flex-col gap-6 items-center justify-center ">
                        <div className='w-[550px] flex flex-col gap-6'>
                            <Image alt='amico' src={"/images/new/Group.svg"} width={50} height={50} className='object-cover' />
                            <h3 className='text-[28px] font-semibold text-black'>Log in</h3>
                            <div className='flex flex-col gap-8 w-full'>

                                <div className="w-full">
                                    <input
                                        className={`w-full outline-none border-b py-3 smooth3 bg-white autofill:bg-white  ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder='Email Address'
                                        type="text"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                                </div>

                                <div className="w-full flex justify-between items-center gap-4">
                                    <div className="w-full">
                                        <input
                                            className={`w-full outline-none border-b py-3 smooth3 bg-white autofill:bg-white  ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder='Password'
                                            type={isVisible ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                                    </div>{isVisible ?
                                        <IoMdEye className='text-2xl cursor-pointer' onClick={() => setIsVisible(!isVisible)} />
                                        :
                                        <IoMdEyeOff className='text-2xl cursor-pointer' onClick={() => setIsVisible(!isVisible)} />
                                    }
                                </div>
                            </div>
                            <button
                                onClick={handleSubmit}
                                className='w-full bg-primary text-white py-3 flex items-center justify-center disabled:opacity-50 rounded-lg disabled:cursor-not-allowed'
                                disabled={!formData.email || !formData.password || Object.values(errors).some(err => err !== '')}
                            >
                                Log in
                            </button>

                            <h3 className='text-center text-[#948F8F] font-medium w-full flex items-center justify-center gap-2'>Don&apos;t have an account ? <Link href={"/signup"} className='text-primary font-semibold hover:scale-105 hover:underline smooth3'>Sign Up</Link></h3>
                            <h3 className='text-center w-full flex items-center justify-center gap-2 font-semibold'>Follow - <FaFacebook className='text-primary text-lg' /><FaInstagram className='text-primary text-lg' /><FaLinkedinIn className='text-primary text-lg' /><BsPinterest className='text-primary text-lg' /></h3>
                        </div>
                    </div>
                </div>
            </div>
            <FooterFour />
        </>
    );
};

export default Signin;
