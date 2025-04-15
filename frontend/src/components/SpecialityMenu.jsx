import React from 'react';
import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';

const SpecialityMenu = () => {
  return (
    <div id="speciality" className="flex flex-col items-center gap-7 py-16 text-gray-800">
      <h1 className="lg:text-[40px] font-semibold">Find by Speciality</h1>
      <p className="sm:w-1/3 text-center lg:text-[17px] font-medium">
        Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
      </p>
      {/* Wrapper to center scrollable content */}
      <div className="flex justify-center gap-6 pt-5 w-full overflow-scroll">
        {specialityData.map((item, index) => (
          <Link 
            onClick={()=>scrollTo(0,0)}
            className="flex flex-col items-center text-sm cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500" 
            to={`/doctors/${item.speciality}`} 
            key={index}
          >
            <img className="w-20 sm:w-28 mb-3" src={item.image} alt={item.speciality} />
            <p className="text-lg font-medium">{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
