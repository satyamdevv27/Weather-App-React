/* eslint-disable no-unused-vars */
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "../style/main.css";
import clear from "../assets/clear.png";
import humidity from "../assets/humidity.png";
import wind from "../assets/wind.png";
import { useState } from "react";
function Main() {
  const [input, setinput] = useState("");
  const [weatherdata, setweatherdata] = useState(false);
  const [forcastdata, setforcastdata] = useState([]);

  const fetchweather = async (city) => {
    const APIkey = "e14c33e2932e46366c55d1413d8aea01";
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIkey}`;
      const response = await fetch(url);
      const data = await response.json();
      const lat = data.coord.lat;
      const log = data.coord.lon;

      //forcast url

      const forcasurl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${log}&appid=${APIkey}&units=metric`;
      const forcast_response = await fetch(forcasurl);
      const forcast_data = await forcast_response.json();
      

      setweatherdata({
        location: data.name,
        humidity: data.main.humidity,
        speed: data.wind.speed,
        temprature: Math.floor(data.main.temp),
        icon: data.weather[0].icon,
        condition: data.weather[0].main,
      });
      setforcastdata(forcast_data.list);
    } catch (error) {
      alert("city not found");
    }
  };

  const handlesearch = () => {
    if (!input) {
      alert("city daal bsdk");
      return;
    }
    fetchweather(input);
  };
  const dailyForecast = forcastdata.filter((entry) =>
    entry.dt_txt.includes("12:00:00")
  );
const sliderSettings = {
  dots: true,         
  infinite: false,     
  speed: 500,         
  slidesToShow: 1,     
  slidesToScroll: 1,

};
  return (
    <div
      className={`main ${
        weatherdata ? weatherdata.condition.toLowerCase() : ""
      } `}
    >
      <div className="weather-container">
        <div className="weather-input">
          <input
            type="text"
            placeholder="enter city name"
            onChange={(e) => setinput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handlesearch();
              }
            }}
          />
          <button onClick={handlesearch}>search</button>
        </div>

        {weatherdata ? (
          <>
            <div className="weather-icon">
              <img
                src={`https://openweathermap.org/img/wn/${weatherdata.icon}@2x.png`}
                alt=""
              />
            </div>
            <div className="weather-info">
              <h1>{weatherdata.temprature} &#176;c</h1>
              <p>{weatherdata.location}</p>
            </div>
            <div className="weather-moreinfo">
              <div className="humidity">
                <div className="img">
                  <img src={humidity} alt="" />
                  <span>
                    <h1>{weatherdata.humidity}</h1>
                  </span>
                </div>
                <p>humidity</p>
              </div>
              <div className="speed">
                <div className="img">
                  <img src={wind} />
                  <span>
                    <h1>{weatherdata.speed}</h1>
                  </span>
                </div>
                <p>wind speed</p>
              </div>
            </div>
            <div className="five_day">
              <Slider {...sliderSettings}>
              {dailyForecast.map((item, index) => (
                <div className="forcast" key={index}>
                  <p>
                    {new Date(item.dt_txt).toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                    alt="weather icon"
                  />
                  <p>{Math.round(item.main.temp)} &#176;C</p>
                </div>
              ))}
              </Slider>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Main;
