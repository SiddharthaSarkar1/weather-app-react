import React, { useEffect, useState } from "react";
import Clock from "react-live-clock";
import loader from "../images/WeatherIcons.gif";
import AnimatedWeather from "react-animated-weather";
import RightSection from "./RightSection";

const dateBuilder = (d) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let date = d.getDate();
  let day = days[d.getDay()];
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

const LeftSection = () => {
  let data;

  const [weatherData, setWeatherData] = useState({
    lat: undefined,
    lon: undefined,
    errorMessage: undefined,
    temperatureC: undefined,
    temperatureF: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    icon: "CLEAR_DAY",
    sunrise: undefined,
    sunset: undefined,
    errorMsg: undefined,
  });

  const getPosition = (options) => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  const getWeather = async (lat, lon) => {
    const api_call = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=${
        import.meta.env.VITE_APIKEY
      }`
    );
    data = await api_call.json();
  };


  useEffect(() => {
    if (navigator.geolocation) {
      getPosition()
        .then((position) => {
          getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch((err) => {
          getWeather(28.67, 77.22);
          alert("You have disabled location service...");
        });
  
      const timeoutIdTwo = setTimeout(() => {
        const updatedData = {
          lat: 28.67,
          lon: 77.22,
          city: data.name,
          temperatureC: Math.round(data.main.temp),
          temperatureF: Math.round(data.main.temp * 1.8 + 32),
          humidity: data.main.humidity,
          main: data.weather[0].main,
          country: data.sys.country,
        };
  
        switch (data.weather[0].main) {
          case "Haze":
            updatedData.icon = "CLEAR_DAY";
            break;
          case "Clouds":
            updatedData.icon = "CLOUDY";
            break;
          case "Rain":
            updatedData.icon = "RAIN";
            break;
          case "Snow":
            updatedData.icon = "SNOW";
            break;
          case "Dust":
            updatedData.icon = "WIND";
            break;
          case "Drizzle":
            updatedData.icon = "SLEET";
            break;
          case "Fog":
          case "Smoke":
            updatedData.icon = "FOG";
            break;
          case "Tornado":
            updatedData.icon = "WIND";
            break;
          default:
            updatedData.icon = "CLEAR_DAY";
        }
  
        setWeatherData((prevData) => ({ ...prevData, ...updatedData }));
      }, 2000);
  
      // Clear the timeout in the cleanup function
      return () => clearTimeout(timeoutIdTwo);
    } else {
      alert("Geolocation not available");
    }
  
    let timerID = setInterval(() => getWeather(weatherData.lat, weatherData.lon), 600000);
  
    // Clear the interval in the cleanup function
    return () => {
      clearInterval(timerID);
    };
  }, [weatherData.lat, weatherData.lon]);
  
  if (weatherData.temperatureC) {
    return (
      <>
        <div className="city">
          <div className="title">
            <h2>{weatherData.city}</h2>
            <h3>{weatherData.country}</h3>
          </div>
          <div className="mb-icon">
            {" "}
            <AnimatedWeather
              icon={weatherData.icon}
              color={defaults.color}
              size={defaults.size}
              animate={defaults.animate}
            />
            <p>{weatherData.main}</p>
          </div>
          <div className="date-time">
            <div className="dmy">
              <div id="txt"></div>
              <div className="current-time">
                <Clock format={'h:mm:ss A'} interval={1000} ticking={true} />
              </div>
              <div className="current-date">{dateBuilder(new Date())}</div>
            </div>
            <div className="temperature">
              <p>
                {weatherData.temperatureC}°<span>C</span>
              </p>
              {/* <span className="slash">/</span>
                {this.state.temperatureF} &deg;F */}
            </div>
          </div>
        </div>
        <RightSection icon={weatherData.icon} weather={weatherData.main} />
      </>
    );
  } else {
    return (
      <>
        <img src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} />
        <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
          Detecting your location
        </h3>
        <h3 style={{ color: "white", marginTop: "10px" }}>
          Your current location wil be displayed on the App <br></br> & used for
          calculating Real time weather.
        </h3>
      </>
    );
  }
};

export default LeftSection;
