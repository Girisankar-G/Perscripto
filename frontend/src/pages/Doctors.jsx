import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  const applyFilter = () => {
    if (speciality) {
      const filterData = doctors.filter((item) => item.speciality === speciality);
      setFilterDoc(filterData);
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [speciality, doctors]);

  return (
    <div className="px-4 sm:px-8 py-6">
      <p className="text-gray-600 text-lg font-medium mb-4">
        Browse through the doctor specialists.
      </p>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        
        {/* Specialities List */}
        <div>
          {[
            'General physician',
            'Gynecologist',
            'Dermatologist',
            'Pediatricians',
            'Neurologist',
            'Gastroenterologist'
          ].map((spec, i) => (
            <p
              onClick={() => navigate(speciality === spec ? '/doctors' : `/doctors/${spec}`)}
              key={i}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer mb-2 hover:bg-gray-100 ${speciality === spec ? 'bg-blue-100 font-medium' : ''}`}
            >
              {spec}
            </p>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterDoc.map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              key={index}
              className={`flex flex-col border rounded-xl overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105 shadow-sm hover:shadow-lg bg-white ${item.available ? 'border-green-500' : 'border-red-500'}`}
            >
              <div className="flex-1">
                <img
                  className="w-full h-60 object-cover bg-blue-100"
                  src={item.image}
                  alt={item.name}
                />
              </div>
              <div className="p-4">
                <div className={`flex items-center gap-2 text-sm mb-1 ${item.available ? 'text-green-500' : 'text-red-500'}`}>
                  <span className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <p>{item.available ? 'Available' : 'Not Available'}</p>
                </div>
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
