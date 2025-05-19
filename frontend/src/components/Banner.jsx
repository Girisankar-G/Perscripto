import React from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Banner = () => { 
    const navigate=useNavigate();   
        return (
            <>
                <div className='flex bg-[#5f6fff] rounded-lg px-8 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>
                    {/** Left Side */}
                    <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-50'>
                        <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl front-semibold text-white'>
                            <p>
                                Book Appointment  
                            </p>
                            <p className='mt-4'>
                                With 100 + Trusted Doctors
                            </p>
                        </div>
                        <div>
                            <button onClick={()=>{navigate('/login'); scrollTo(0,0)}} className='cursor-pointer bg-white text-grey-600 px-12 py-3 rounded-full mt-6 hover:scale-105 transition-all duration-500'>Create account</button>
                        </div>
                    </div>
    
                    {/** Right Side */}
                    <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
                        <img className='w-full md:absolute bottom-0 right-0 max-w-md' src={assets.appointment_img} alt="" />
                    </div>
                </div>
            </>
        );
    }

export default Banner