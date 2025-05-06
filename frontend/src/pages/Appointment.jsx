import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const Navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const dayScrollRef = useRef(null);
  const timeScrollRef = useRef(null);

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = () => {
    let today = new Date();
    let slots = [];

    for (let i = 0; i < 7; i++) {
      let date = new Date(today);
      date.setDate(today.getDate() + i);

      let startTime = new Date(date);
      let endTime = new Date(date);
      endTime.setHours(21, 0, 0, 0);

      let now = new Date();

      // Today's logic for current time
      if (i === 0) {
        const currentHour = now.getHours();
        const currentMin = now.getMinutes();

        if (currentHour < 9 || (currentHour === 9 && currentMin <= 30)) {
          startTime.setHours(9, 30, 0, 0);
        } else {
          startTime.setHours(currentHour, currentMin, 0, 0);
          const minutes = startTime.getMinutes();
          if (minutes > 30) {
            startTime.setHours(startTime.getHours() + 1);
            startTime.setMinutes(0);
          } else if (minutes > 0) {
            startTime.setMinutes(30);
          }
        }
      } else {
        startTime.setHours(9, 30, 0, 0);
      }

      let timeSlots = [];

      while (startTime < endTime) {
        const hrs = startTime.getHours();
        const mins = startTime.getMinutes();

        // Skip lunch break 12:30 - 1:30
        if (!(hrs === 12 && mins === 30) && !(hrs === 13 && mins === 0)) {
          const formattedTime = startTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          let day=date.getDate()
          let month=date.getMonth()
          let year=date.getFullYear()

          const slotDate=day+"_"+month+"_"+year
          const slotTime=formattedTime
          
          const isSlotAvailable=docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime)?false:true

          console.log(docInfo.slots_booked[slotDate])
          if(isSlotAvailable){
            timeSlots.push({
              datetime: new Date(date),
              time: formattedTime,
            });
          }

        }

        startTime.setMinutes(startTime.getMinutes() + 30);
      }

      slots.push(timeSlots);
    }

    setDocSlots(slots);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return Navigate("/login");
    }
    try {
      const date = docSlots[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth();
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        {
          docId,
          slotDate,
          slotTime,
        },
        {
          headers: { token },
        }
      );
      if(data.success){
        toast.success(data.message)
        getDoctorsData()
        Navigate('/my-appointments')
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    const handleWheelScroll = (e, ref) => {
      if (ref.current) {
        e.preventDefault();
        ref.current.scrollLeft += e.deltaY * 3;
      }
    };

    const onWheelDay = (e) => handleWheelScroll(e, dayScrollRef);
    const onWheelTime = (e) => handleWheelScroll(e, timeScrollRef);

    dayScrollRef.current?.addEventListener("wheel", onWheelDay, {
      passive: false,
    });
    timeScrollRef.current?.addEventListener("wheel", onWheelTime, {
      passive: false,
    });

    return () => {
      dayScrollRef.current?.removeEventListener("wheel", onWheelDay);
      timeScrollRef.current?.removeEventListener("wheel", onWheelTime);
    };
  }, []);

  return (
    docInfo && (
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              src={docInfo.image}
              alt="Doctor"
              className="bg-[#5f6fff] w-full sm:max-w-72 rounded-lg"
            />
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="Verified" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm font-medium text-gray-900 mb-1 mt-2">
                <p>About</p>
                <img src={assets.info_icon} alt="" className="w-4 h-4" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed text-justify max-w-2xl">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySymbol} {docInfo.fees * 10}
              </span>
            </p>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="mt-6 sm:ml-72 sm:pl-4 font-medium text-gray-700">
          <p>Booking Slots</p>

          {/* Days */}
          <div
            ref={dayScrollRef}
            className="flex gap-3 items-center w-full overflow-x-auto mt-4 px-2"
          >
            {docSlots.map((item, index) => {
              const day = new Date();
              day.setDate(day.getDate() + index);
              return (
                <div
                  onClick={() => setSlotIndex(index)}
                  key={index}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer flex-shrink-0 ${
                    slotIndex === index
                      ? "bg-[#5f6fff] text-white"
                      : "border border-gray-200 text-gray-600"
                  }`}
                >
                  <p>{daysOfWeek[day.getDay()]}</p>
                  <p>{day.getDate()}</p>
                </div>
              );
            })}
          </div>

          {/* Time slots */}
          <div
            ref={timeScrollRef}
            className="flex items-center gap-3 w-full overflow-x-auto mt-4 px-2"
          >
            {docSlots.length > 0 && docSlots[slotIndex]?.length > 0 ? (
              docSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-[#5f6fff] text-white"
                      : "text-gray-400 border border-gray-300"
                  }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))
            ) : (
              <p className="mt-2 text-[20px] text-gray-400">
                No slots available
              </p>
            )}
          </div>
          <button
            onClick={bookAppointment}
            className="bg-[#5f6fff] mt-5 text-white cursor-pointer text-sm font-light px-14 py-3 rounded-full 
          hover:bg-[#4a58e6] hover:scale-105 transition duration-300 ease-in-out shadow-md active:scale-95"
          >
            Book an appointment
          </button>
        </div>

        {/** Listening Related Doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
