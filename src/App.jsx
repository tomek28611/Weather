import React, { useEffect, useState } from "react";
import './index.css'

function App() {
  const apiKey = "bdf2986863c74455aff94929231507";

  const [placesAndTemperatures, setPlacesAndTemperatures] = useState([]);
  const [errorCities, setErrorCities] = useState([]);


  async function fetchWeatherData(place) {
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${place}&aqi=no`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data for ${place}`);
    }
    return response.json();
  }


  useEffect(() => {
    const skyCities = ["Prague", "London", "Lisbon", "New York"];
    const smallCities = ["Neznámé Město"];

    async function fetchWeatherForCities() {
      try {
        const allCities = [...new Set([...skyCities, ...smallCities])];
        const successfulCityData = [];
        const errors = [];

        for (const city of allCities) {
          try {
            const weatherData = await fetchWeatherData(city);
            successfulCityData.push(weatherData);
          } catch (error) {
            errors.push(city);
            console.error(error.message);
          }
        }

        const placesAndTemperaturesData = successfulCityData.map((weatherData) => {
          const place = weatherData.location.name;
          const temperature = weatherData.current.temp_c;
          const time = weatherData.location.localtime;
          const condition = weatherData.current.condition.text;
          const conditionIcon = weatherData.current.condition.icon;
          const pressure = weatherData.current.pressure_mb;
          const country = weatherData.location.country;
          const isSkyCity = skyCities.includes(place);
          const isSmallCity = smallCities.includes(place);

          return { place, temperature, time, condition, conditionIcon, pressure, country, isSkyCity, isSmallCity };
        });

        setPlacesAndTemperatures(placesAndTemperaturesData);
        setErrorCities(errors);
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchWeatherForCities();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-200">
      <h2 className="text-4xl font-bold mb-8 mt-8 text-center">Places and Temperatures:</h2>
     
      {placesAndTemperatures.length > 0 ? (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {placesAndTemperatures.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-md shadow-xl bg-blue-50 hover:scale-105"
            >
              {item.isSkyCity && (
                <p className="p-4 mb-4 text-center bg-gray-600 rounded-xl text-gray-200">Sky City</p>
              )}
              {item.isSmallCity && (
                <p className="p-4 mb-4 text-center bg-gray-600 rounded-xl text-gray-200">Small City</p>
              )}
              <div className="flex justify-between">
                <div className="">
                <p className="text-2xl font-bold text-center">{item.place}</p>
                <p className="text-xs text-gray-500">{item.country}</p>
                </div>
                <img src={item.conditionIcon} alt="Icon" className="w-12" />
              </div>
              <p className="font-semibold text-center mt-4">{item.temperature}°C - {item.condition}</p>
              <p className="font-semibold text-center mt-2">Pressure {item.pressure} hPa</p>
              <p className="text-center text-gray-500 mt-2">{item.time}</p>

            </div>
          ))}
        </div>
      ) : (
        <p>No weather data available for the specified cities.</p>
      )}

      {errorCities.length > 0 && (
        <div>
          <h2 className="text-4xl font-bold mt-8 mb-4 text-center">Errors:</h2>
          <ul className="list-disc list-inside">
            {errorCities.map((city, index) => (
              <li key={index} className="p-4 rounded-md shadow-md bg-red-200 hover:scale-105">
                No weather data available for "{city}"
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;