import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css'; 
import Doctors from '../pages/Doctors';

const Navbar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [token, setToken] = useState(true);

    return (
        <div className='flex items-center justify-between text-base py-5 mb-6 border-b border-b-gray-400'>
            <img onClick={()=>navigate('/')} className='w-60 cursor-pointer' src={assets.logo} alt="Logo" />

            <ul className='hidden md:flex items-start gap-5 font-semibold lg:text-[18px]'>
                <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                    <li className='py-2 text-center'>
                        HOME
                        <hr className='border-none outline-none h-1 bg-[#5f6fff] w-3/5 m-auto hidden' />
                    </li>
                </NavLink>
                <NavLink to="/doctors" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                    <li className='py-2 text-center'>
                        ALL DOCTORS
                        <hr className='border-none outline-none h-1 bg-[#5f6fff] w-3/5 m-auto hidden' />
                    </li>
                </NavLink>
                <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                    <li className='py-2 text-center'>
                        ABOUT
                        <hr className='border-none outline-none h-1 bg-[#5f6fff] w-3/5 m-auto hidden' />
                    </li>
                </NavLink>
                <NavLink to="/contacts" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                    <li className='py-2 text-center'>
                        CONTACT
                        <hr className='border-none outline-none h-1 bg-[#5f6fff] w-3/5 m-auto hidden' />
                    </li>
                </NavLink>
            </ul>

            <div className='flex items-center gap-5'>
                {token ? (
                    <div className='flex items-center gap-3 cursor-pointer group relative text-lg'>
                        <img className='w-12 rounded-full' src={assets.profile_pic} alt="" />
                        <img className='w-3' src={assets.dropdown_icon} alt="" />
                        <div className='absolute top-0 right-0 pt-16 text-lg font-medium text-gray-700 z-20 hidden group-hover:block'>
                            <div className='min-w-52 bg-stone-100 rounded-lg flex flex-col gap-5 p-5'>
                                <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                                <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                                <p onClick={() => setToken(false)} className='hover:text-black cursor-pointer'>Logout</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className='cursor-pointer bg-[#5f6fff] text-white px-10 py-4 rounded-full font-semibold sm:h-12 sm:w-45 sm:text-[13px] text-lg hidden md:block'
                    >
                        Create Account
                    </button>
                )}
            </div>
        </div>
    );
};

export default Navbar;
