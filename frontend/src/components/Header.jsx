import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className='flex flex-col md:flex-row bg-[#5f6fff] rounded-lg px-8 md:px-14 lg:px-24 h-180'>
                {/** Left Side */}
                <div className='md:w-1/2 flex flex-col justify-center gap-5 py-12 m-auto md:py-[10vw] md:mb-[-30px]'>
                    <p className='text-4xl md:text-5xl lg:text-[57px] text-white font-bold leading-tight md:leading-tight'>
                        Book Appointment <br /> With Trusted Doctors
                    </p>

                    <div className='flex flex-col md:flex-row items-center gap-4 text-white text-base font-light'>
                        <img className='w-36' src={assets.group_profiles} alt="" />
                        <p className='text-[18px] md:text-[22px] lg:text-[18px] text-white font-normal'>
                            Simply browse through our extensive list of trusted doctors,
                            <br className='hidden sm:block' />schedule your appointment hassle-free.
                        </p>
                    </div>

                    <div className='flex gap-4 mt-4'>
                        <a 
                          href="#speciality" 
                          onClick={() => navigate('/')} 
                          className='flex cursor-pointer items-center w-62 h-13 gap-3 bg-white px-10 py-4 rounded-full text-gray-600 text-base hover:scale-110 transition-all duration-300'>
                            Book Appointment <img className='w-5' src={assets.arrow_icon} alt="" />
                        </a>
                        
                    </div>
                </div>

                {/** Right Side */}
                <div className='md:w-1/2 relative'>
                    <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.header_img} alt="" />
                </div>
            </div>
        </>
    );
};

export default Header;
