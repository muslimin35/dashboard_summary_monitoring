"use client"; // Add this at the top of your component file

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUsers,
  faCar,
  faUserCheck,
  faUserTimes,
  faCarSide,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Logo6 from "../app/asset/Logo.png";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const REFRESH_INTERVAL = parseInt(process.env.NEXT_PUBLIC_REFRESH_INTERVAL, 10);

export default function Home() {
  const today = moment().format("YYYY-MM-DD");
  const [date, setDate] = useState(today);
  const [data, setData] = useState({
    employeeIn: 0,
    employeeOut: 0,
    visitorIn: 0,
    visitorOut: 0,
    vehicleIn: 0,
    vehicleOut: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (dateParam) => {
    setIsLoading(true); // Start loading
    try {
      const [employeeRes, visitorRes, vehicleRes] = await Promise.all([
        fetch(`${API_BASE_URL}/count_employee?date=${dateParam}`),
        fetch(`${API_BASE_URL}/count_visitor?date=${dateParam}`),
        fetch(`${API_BASE_URL}/count_vehicle?date=${dateParam}`),
      ]);

      const employeeData = await employeeRes.json();
      const visitorData = await visitorRes.json();
      const vehicleData = await vehicleRes.json();

      setData({
        employeeIn: employeeData.employeeInCount || 0,
        employeeOut: employeeData.employeeOutCount || 0,
        visitorIn: visitorData.visitorInCount || 0,
        visitorOut: visitorData.visitorOutCount || 0,
        vehicleIn: vehicleData.vehicleInCount || 0,
        vehicleOut: vehicleData.vehicleOutCount || 0,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    fetchData(date);

    const intervalId = setInterval(() => {
      fetchData(date);
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [date]);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (moment(selectedDate).isAfter(today)) {
      alert("Date cannot be in the future. Please select a valid date.");
    } else {
      setDate(selectedDate);
    }
  };


  return (
    <div className="bg-white min-h-screen">
      {/* Navbar */}
      <div className="navbar bg-white border-b-4 border-blue-600 flex justify-between items-center p-4">
        <div className="flex items-center">
          <Image
            alt="logo"
            src={Logo6}
            width={60}
            height={60}
            style={{ marginLeft: "10px" }}
          />
          <a className="font-bold text-xl text-blue-600">
            PLN <br></br> UPT Purworejo
          </a>
          {isLoading && (
            <div className="ml-2 w-6 h-6 border-4 border-t-blue-600 border-blue-300 rounded-full animate-spin"></div>
          )}
        </div>
        <div className="flex items-center">
          <span className="font-bold text-blue-900 text-xl mr-4">Today's Information</span>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            max={today}
            className="border-2 rounded py-1 px-3"
          />
        </div>
      </div>

      {/* Grid Layout */}
      <div className="container mx-auto p-4 grid gap-6 grid-cols-1 md:grid-cols-3 mt-14">
        {/* Card Component */}
        {[
          { title: "Employee IN", value: data.employeeIn, bg: "bg-green-700", icon: faUserCheck },
          { title: "Visitor IN", value: data.visitorIn, bg: "bg-blue-900", icon: faUsers },
          { title: "Vehicle IN", value: data.vehicleIn, bg: "bg-teal-700", icon: faCar },
          { title: "Employee OUT", value: data.employeeOut, bg: "bg-red-600", icon: faUserTimes },
          { title: "Visitor OUT", value: data.visitorOut, bg: "bg-red-900", icon: faUser },
          { title: "Vehicle OUT", value: data.vehicleOut, bg: "bg-black", icon: faCarSide },
        ].map((card, index) => (
          <div key={index} className={`card ${card.bg} text-white w-full h-52 flex flex-col justify-between p-4 rounded-lg shadow-lg`}>
            {/* Top Section: Icon and Value */}
            <div className="flex justify-between items-center">
              <FontAwesomeIcon icon={card.icon} size="5x" />
              <p className="text-4xl font-extrabold">{card.value}</p>
            </div>

            {/* Full-width HR with background matching */}
            <hr className="border-0 h-1 w-full bg-white mt-2" />

            {/* Bottom Section: Title */}
            <div className="flex justify-start">
              <p className="text-xl font-bold">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-2 text-black bg-white mt-6">
        <div>
          <p className="font-bold">Summary Counting of data per day</p>
          <p className="font-bold">Copyright © 2024</p>
        </div>
      </footer>
    </div>
  );
}
