import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'
import humidity_icon from '../assets/humidity.png'
import feelsLike_icon from '../assets/temperatureFeelsLike.png'
import sunrise_icon from '../assets/sunrise.png'
import sunset_icon from '../assets/sunset.png'

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const [city, setCity] = useState('');
  const [apiLimitReached, setApiLimitReached] = useState(false);
  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "05d": drizzle_icon,
    "05n": drizzle_icon,
    "06d": drizzle_icon,
    "06n": drizzle_icon,
    "07d": drizzle_icon,
    "07n": drizzle_icon,
    "08d": drizzle_icon,
    "08n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "11d": rain_icon,
    "11n": rain_icon,
    "12d": rain_icon,
    "12n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon
  }
  const search = async (city) => {
    if(city === "") {
      alert("Enter City Name");
      return;
    }
    let apiCalls = localStorage.getItem('apiCalls') || 0;
    let lastResetDate = localStorage.getItem('lastResetDate');
    const today = new Date().toISOString().split('T')[0];

    if(lastResetDate !== today) {
      localStorage.setItem('apiCalls', 0);
      localStorage.setItem('lastResetDate', today);
      apiCalls = 0;
    }
    
    if(apiCalls >= 1500) {
      setApiLimitReached(true);
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=c8fc2d377c3898ef57caa01b6f3bf5d9`;

      const response = await fetch(url);
      const data = await response.json();

      if(!response.ok) {
        alert(data.message);
        return;
      }

      console.log(data);

      const sunriseDate = new Date(data.sys.sunrise * 1000);
      // const sunriseUTCString = sunriseDate.toUTCString();
      const sunsetDate = new Date(data.sys.sunset * 1000);
      // const sunsetUTCString = sunsetDate.toUTCString();

      const icon = allIcons[data.weather[0].icon] || clear_icon;
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
        feels_like: Math.floor(data.main.feels_like),
        sunriseTime: sunriseDate.getUTCHours().toString().padStart(2, '0') + ":" + sunriseDate.getUTCMinutes().toString().padStart(2, '0'),
        sunsetTime: sunsetDate.getUTCHours().toString().padStart(2, '0') + ":" + sunsetDate.getUTCMinutes().toString().padStart(2, '0')
      });

      apiCalls = parseInt(apiCalls, 10) + 1;
      localStorage.setItem('apiCalls', apiCalls);
      setApiLimitReached(false);
    } catch (error) {
      setWeatherData(false);
      console.error("Error in fetching weather data");
    }
  }

  useEffect(() => {
    if(city && !apiLimitReached) {
      search(city);
      const intervalId = setInterval(() => {if(!apiLimitReached) search(city);}, 120000);
      return () => clearInterval(intervalId);
    }
  }, [city, apiLimitReached]);

  const handleSearch = () => {
    setCity(inputRef.current.value);
  }

  return (
    <div className='weather'>
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder='Search' />
        <img src={search_icon} alt="" onClick={handleSearch}/>
      </div>
      {apiLimitReached ? (
        <p>API limit reached. Please try again tommorow.</p>
      ) : weatherData ? (<>
        <img src={weatherData.icon} alt="" className='weather-icon'/>
      <p className='temperature'>{weatherData.temperature}°C</p>
      <p className='location'>{weatherData.location}</p>
      <div className="weather-data">
        <div className="col">
          <img src={humidity_icon} alt="" />
          <div>
            <p>{weatherData.humidity}%</p>
            <span>Humidity</span>
          </div>
        </div>
        <div className="col">
          <img src={wind_icon} alt="" />
          <div>
            <p>{weatherData.windSpeed} km/hr</p>
            <span>Wind Speed</span>
          </div>
        </div>
      </div>
      <div className="weather-data">
        <div className="col">
          <img src={sunrise_icon} alt="" className='invert-image'/>
          <div>
            <p>{weatherData.sunriseTime}</p>
            <span>Sunrise time</span>
          </div>
        </div>
        <div className="col">
          <img src={sunset_icon} alt="" className='invert-image'/>
          <div>
            <p>{weatherData.sunsetTime}</p>
            <span>Sunset time</span>
          </div>
        </div>
      </div>
      <div className="weather-data">
        <div className="col">
          <img src={feelsLike_icon} alt="" className='invert-image'/>
          <div>
            <p>{weatherData.feels_like}°C</p>
            <span>Feels like</span>
          </div>
        </div>
      </div>
      </>):<></>}
    </div>
  )
}

export default Weather
