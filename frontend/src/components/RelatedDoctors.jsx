import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext);

  const [relDoc, setRelDoc] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      );
      setRelDoc(doctorsData);
    }
  }, [doctors, speciality, docId]);

  const handleDoctorClick = (doctorId) => {
    // Smooth scroll effect
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    // Navigate to appointment page
    setTimeout(() => {
      navigate(`/appointment/${doctorId}`);
    }, 500); // Delay navigation to allow the scroll effect to finish
  };

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>Top Doctors To Book</h1>
      <p className='sm:w-1/3 text-center text-sm'>
        Simply browse through our exclusive list of trusted doctors
      </p>
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {relDoc.slice(0, 5).map((item, index) => (
          <div
            onClick={() => handleDoctorClick(item._id)}
            className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
            key={index}
          >
            <img className='w-full bg-blue-100' src={item.image} alt={item.name} />
            <div className='p-4'>
              <div className='flex items-center gap-2 text-sm text-green-500'>
                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                <p>Available</p>
              </div>
              <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
              <p className='text-gray-600 text-sm'>{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      {/* More button */}
      <button
        onClick={() => {
          // Smooth scroll to the top when 'More' button is clicked
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
          setTimeout(() => {
            navigate('/doctors');
          }, 500); // Allow scroll effect to finish
        }}
        className='cursor-pointer h-14 w-40 bg-blue-100 text-grey-600 px-12 rounded-full mt-10 hover:translate-y-[-10px] transition-all duration-500'
      >
        More
      </button>
    </div>
  );
};

export default RelatedDoctors;
