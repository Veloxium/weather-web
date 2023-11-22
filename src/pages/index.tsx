import Image from "next/image";
import React, { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import clear from "../assets/clear.png";
import cloud from "../assets/cloud.png";
import bcloud from "../assets/bcloud.png";
import mist from "../assets/mist.png";
import rain from "../assets/rain.png";
import snow from "../assets/snow.png";
import thunder from "../assets/thunder.png";
import { motion } from "framer-motion";
import XMarquee from "@/components/xmarquee";
import emojicloud from "@/assets/26C5.svg";
import emojime from "@/assets/1F9B9-200D-2642-FE0F.svg";

async function getWeather(param: string) {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  if (param !== "") {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${param}&appid=${apiKey}&units=metric`
    );
    return res.json();
  }
}

export default function Home() {
  const [query, setQuery] = useState("Mataram");
  const [data, setData] = useState(Object);
  const [great, setGreat] = useState("");
  const [img, setImg] = useState<any>("");
  const [weather, setWeather] = useState(Object);
  const [isError, setIsError] = useState(false);
  const [isDetail, setIsDetail] = useState(false);

  const debounceValue = useDebounce(query, 1000);
  useEffect(() => {
    if (!debounceValue) {
      return;
    }
    const fetchData = async () => {
      try {
        const weatherData = await getWeather(debounceValue);
        setData(weatherData);
        iconShow(weatherData.weather[0].icon);
        setWeather(weatherData.weather[0]);
        good();
        setIsError(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setIsError(true);
      }
    };
    fetchData();
  }, [debounceValue]);

  const onSearch = (e: any) => {
    // e.preventDefault();
    // const inputQuery = e.target[0].value;
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
    }
    setQuery(e.target.value);
  };

  let date = new Date(); // create a date object
  let dayName = date.toLocaleString("en-us", { weekday: "long" }); // get the day of the week as a name
  let time = date.toLocaleTimeString("en-us", {
    hour12: true,
    timeStyle: "short",
  });

  const checkTime = parseInt(time.slice(0, 1));
  console.log(checkTime)
  const good = () => {
    if (checkTime > 6) {
      if (time.slice(-2) === "AM") {
        setGreat("Good Morning");
      } else if (time.slice(-2) === "PM") {
        setGreat("Good Night");
      }
    } else if (checkTime < 6) {
      if (time.slice(-2) === "AM") {
        setGreat("Good Subuh Sir !");
      } else if (time.slice(-2) === "PM") {
        if (checkTime > 3) {
          setGreat("Good Afternoon");
        } else {
        setGreat("Good Day Sir !");
        }
      }
    }
  };

  const iconShow = (e: string) => {
    if (e == "02n" || e == "02d" || e == "03d" || e == "03n") {
      setImg(cloud);
    } else if (e == "01d" || e == "01n") {
      setImg(clear);
    } else if (e == "04d" || e == "04n") {
      setImg(bcloud);
    } else if (e == "09d" || e == "09n" || e == "10d" || e == "10n") {
      setImg(rain);
    } else if (e == "11d" || e == "11n") {
      setImg(thunder);
    } else if (e == "13d" || e == "13n") {
      setImg(snow);
    } else if (e == "50d" || e == "50n") {
      setImg(mist);
    } else {
      setImg(`https://openweathermap.org/img/wn/${e}@2x.png`);
    }
  };

  const handleDetail = () => {
    setIsDetail(!isDetail);
  };

  const containerAnimationVariants = {
    initial: {},
    animate: {
      transition: {
        delayChildren: 0.5,
        staggerChildren: 0.7, // Adjust the delay between elements
      },
    },
  };

  const childAnimationVariants = {
    initial: { y: 540 },
    animate: { y: 0 },
    transition: { type: "spring", stiffness: 60 },
  };

  const childTransition = {
    type: "spring", // Customize the transition type
    stiffness: 40, // Customize the transition stiffness
    // delay: 0.5, // Add a delay to each child element
  };

  return (
    <main className="relative overflow-hidden">
      <div
        className="flex min-h-screen flex-col items-center justify-center primary px-20"
        onClick={() => {
          setIsDetail(false);
        }}
      >
        <div className="absolute top-0 w-full">
          <XMarquee />
        </div>
        <div className="my-4 flex flex-col -mt-10">
          <div className="flex items-center">
            <p className="text-slate-700">Today is</p>
            <Image src={emojicloud} alt="emoji" className="w-8 h-8" />
          </div>
          <p className="text-6xl text-slate-700">{dayName}</p>
          <div className="text-end ">
            <p className="text-md inline-flex bg-slate-700 px-2 my-1 text-white">
              {time}
            </p>
          </div>
        </div>
        <form className="flex pr-2 py-1 border-2 rounded-lg justify-center items-center bg-white hover:border-neutral-700">
          <input
            type="text"
            value={query}
            className="text-black pl-2 focus:outline-none"
            onChange={onSearch}
            onKeyDown={onSearch}
            placeholder="Seacrh your city"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 opacity-50"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </form>
        {isError ? (
          <div className="mt-20 text-md opacity-50">
            <p>City is Not Found</p>
          </div>
        ) : (
          <div>
            {weather && data && (
              <div>
                <motion.div
                  key={data?.name}
                  initial={{ y: 540 }}
                  animate={{ y: 0 }}
                  exit={{ y: 540 }}
                  transition={{ type: "spring", stiffness: 60 }}
                  className="flex justify-center items-center mt-10"
                >
                  {img && (
                    <Image
                      src={img}
                      width={200}
                      height={200}
                      alt="Icon"
                      priority
                    />
                  )}
                </motion.div>
                <motion.div
                  key={data?.id}
                  initial="initial"
                  animate="animate"
                  variants={containerAnimationVariants}
                  // transition={{delay : 1}}
                  className="flex flex-col items-center"
                >
                  <motion.p
                    variants={childAnimationVariants}
                    transition={childTransition}
                    className="text-2xl"
                  >
                    {weather?.main}
                  </motion.p>
                  <motion.p
                    variants={childAnimationVariants}
                    transition={childTransition}
                    className="text-4xl my-2"
                  >
                    {data?.main?.temp}° C
                  </motion.p>
                  <motion.p
                    variants={childAnimationVariants}
                    transition={childTransition}
                    className="text-xl opacity-60"
                  >
                    {great}
                  </motion.p>
                </motion.div>
              </div>
            )}
          </div>
        )}
      </div>
      {data && weather && (
        <motion.div
          initial={{ x: 280 }}
          animate={{ x: isDetail ? 0 : 250 }}
          transition={{ type: "just", stiffness: 40 }}
          className="absolute right-0 top-0 inline-flex items-center justify-center z-20"
        >
          <div
            onClick={handleDetail}
            className="absolute -left-6 hover:cursor-pointer secondary rounded-l-md py-4 pl-1 inline-flex"
          >
            <p className="absolute transform -rotate-90 -translate-x-12 secondary w-20 text-center text-white rounded-t-md"></p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
              />
            </svg>
          </div>
          <div className="secondary min-h-screen w-[260px] flex justify-center items-center flex-col">
            <p className="text-white font-bold uppercase">{weather?.description}</p>
            <div className="flex gap-2 font-semibold items-center justify-between">
              <p className="text-slate-400 text-5xl">Temp</p>
              <p className="text-white">{data?.main?.temp}° C</p>
            </div>
            <div className="flex gap-2 font-semibold items-center justify-between">
              <p className="text-blue-400 text-3xl">Humidity</p>
              <p className="text-white text-4xl">{data?.main?.humidity}</p>
            </div>
            <div className="flex gap-2 font-semibold items-center justify-between">
              <p className="text-red-400 text-4xl">Pressure</p>
              <p className="text-white text-sm">{data?.main?.pressure}</p>
            </div>
            <div className="flex gap-2 font-semibold items-center justify-between">
              <p className="text-orange-400 text-2xl">Feels Like</p>
              <p className="text-white">{data?.main?.feels_like}° C</p>
            </div>
            <div className="flex gap-2 font-semibold items-center justify-between">
              <p className="text-slate-100">Wind Speed</p>
              <p className="text-white text-4xl">{data?.wind?.speed}</p>
            </div>
            <div className="absolute bottom-3 flex gap-2 items-center">
              <p className="text-white text-sm">Made With </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="red"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="red"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      )}
      <div className="absolute bottom-7 w-full flex justify-center items-center">
        <p className="text-xs">Copyright Veloxium</p>
        <Image src={emojime} alt="me" className="w-6 h-6"/>
      </div>
    </main>
  );
}
