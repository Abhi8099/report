'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import {motion} from "framer-motion"
import { useInView } from 'react-intersection-observer';

export default function HomeForm() {

    const { ref, inView } = useInView({
        triggerOnce: true, // Only trigger the animation once
        threshold: 0.1,    // Trigger when 10% of the component is visible
    });
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
    })

    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
    })

    const validateField = (name: string, value: string) => {
        switch (name) {
            case 'fullName':
                return value.trim() === '' ? 'Full name is required' : ''
            case 'email':
                return !/\S+@\S+\.\S+/.test(value) ? 'Invalid email address' : ''
            default:
                return ''
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Here you would typically send the form data to your backend
        console.log('Form submitted:', formData)
    }

    return (
        <motion.div 
        ref={ref}
        initial={{ opacity: 0, y: 50 }} 
        animate={inView ? { opacity: 1, y: 0 } : {}} 
        transition={{ duration: 0.7 }}
        className="flex justify-between p-8 text-black mb-10 gap-15 lg:px-25 md:px-12.5 xl:px-50">


                        <div className="w-1/3 ">
                        <h3 className='text-[45px] font-extrabold text-black leading-tight text-start'>Have questions or need support?</h3>
            </div>
            <form onSubmit={handleSubmit} className="w-1/3 gap-8 space-y-4 flex items-center  flex-col justify-center ">
<div className='flex flex-col gap-3'>
<div> 
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="w-[400px] px-5 py-3 border border-[#979797] smooth3 rounded-[10px] outline-none  focus:outline-none  focus:border-primary"
                    />
                    {errors.fullName && <p className="mt-1 text-red-500 text-sm">{errors.fullName}</p>}
                </div>
                <div>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="E-mail"
                        className="w-[400px] px-5 py-3  border border-[#979797] smooth3 rounded-[10px] outline-none focus:outline-none focus:border-primary"
                    />
                    {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
                </div>
</div>
                <button
                    type="submit"
                    className="w-[200px]  py-3 px-4 bg-primary text-white rounded-[10px] hover:bg-primary transition duration-300"
                >
                    Contact Us
                </button>
            </form>
            <div className="w-1/3 text-right flex items-end flex-col  ">
                <p className='flex gap-3 items-center'><span className='font-bold'>Email:</span> support@analytixio.com</p>
                <p className='flex gap-3 items-center'><span className='font-bold'>Phone Number:</span> +1-800-123-4567</p>
                <p className='flex gap-3 items-center'><span className='font-bold'>Address:</span> 123 Analytics Drive, Data</p>
                <p className='flex gap-3 items-center'>City, TX 78901</p>
            </div>
        </motion.div>
    )
}