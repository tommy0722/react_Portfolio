import React, { useState, useEffect } from 'react';
import performRequest from './api';
import fetchNearbyRestaurants from './googlemapapi'



function LocationComponent() {
  const [radius, setRadius] = useState(500);
  const apikey = 'AIzaSyAmYZHvMoDf0Oc-7DK4-QmUNGD88YHX6xA';
  const [showClosedRestaurants, setShowClosedRestaurants] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: "", lng: "" },
    restaurants: [],
    error: null
  });

  const renderRadiusOptions = () => {
    const options = [500, 1000, 1500, 2000, 3000, 5000, 10000];
    return options.map(option => (
      <option key={option} value={option}>{option} 公尺</option>
    ));
  };

  const toggleClosedRestaurants = () => {
    setShowClosedRestaurants(!showClosedRestaurants);
  };
  useEffect(() => {
    const geoSuccess = position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setLocation({
        loaded: true,
        coordinates: { lat, lng },
        restaurants: [],
        error: null
      });

      const fetchAndSetRestaurants = async () => {
        try {
          const restaurants = await fetchNearbyRestaurants(lat, lng, apikey, radius);
          setLocation(prevState => ({
            ...prevState,
            restaurants: restaurants
          }));
        } catch (error) {
          setLocation(prevState => ({
            ...prevState,
            restaurants: []
            // error: error
          }));
        }
      };

      fetchAndSetRestaurants();
    };

    const geoError = error => {
      setLocation(prev => ({
        ...prev,
        loaded: true,
        error: error
      }));
    };

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  }, [apikey, radius]);

  const selectRandomRestaurant = async () => {
    const openRestaurants = location.restaurants.filter(restaurant => restaurant.currentOpeningHours && restaurant.currentOpeningHours.openNow);

    if (openRestaurants.length === 0) {
      console.log("No open restaurants available.");
      setAnimating(false);
      return;  // 退出函数，因为没有餐厅可供选择
    }

    setAnimating(true);
    const timesToChange = 30;
    let changeCount = 0;
    let lastSelectedRestaurant = null;

    const interval = setInterval(async () => {
      if (changeCount < timesToChange) {
        const randomIndex = Math.floor(Math.random() * openRestaurants.length);
        setSelectedRestaurant(openRestaurants[randomIndex]);
        lastSelectedRestaurant = openRestaurants[randomIndex];  
        changeCount++;
      } else {
        clearInterval(interval);
        setAnimating(false);
        if (lastSelectedRestaurant && lastSelectedRestaurant.displayName) {
          const locationString = `${location.coordinates.lat}, ${location.coordinates.lng}`;
          const [, error] = await performRequest(
            'https://myweb-backend-571409330129.asia-east1.run.app/api/roulette/eatlogs/',
            'POST',
            { body: { Customer: locationString, Food: lastSelectedRestaurant.displayName.text } }
          );
          if (error) {
            console.error("Failed to send data to backend:", error);
          } else {
            console.log("Data sent successfully to backend:", lastSelectedRestaurant);
          }
        } else {
          console.error("Selected restaurant is null or does not have a displayName");
        }
      }
    }, 100);
  };


  if (location.error) return <div>Error: {location.error.message}</div>;
  if (!location.loaded) return <div>Loading location...</div>;


  return (
    <div>
      <h1>尋找附近的餐廳</h1>
      <button onClick={toggleClosedRestaurants} className="btn btn-secondary my-3">
        {showClosedRestaurants ? "隱藏未營業的餐廳" : "顯示未營業的餐廳"}
      </button>
      <div className='row'>
        <div className="col d-flex justify-content-center">
          <div className="col-auto">
            <label htmlFor="radius" className='text-start'>尋找公尺數：</label>
          </div>
          <div className="col-auto">
            <select className='form-select text-center mb-5' value={radius} onChange={e => setRadius(parseInt(e.target.value, 10))}>
              {renderRadiusOptions()}
            </select>
          </div>
        </div>
      </div>

      <div>
        <ul>
          {location.restaurants.map((restaurant, index) => {
            // Always show open restaurants
            if (restaurant.currentOpeningHours && restaurant.currentOpeningHours.openNow) {
              return <li key={index}>{restaurant.displayName.text} - 開放中</li>;
            }
            // Conditionally show closed restaurants
            if (showClosedRestaurants && (!restaurant.currentOpeningHours || !restaurant.currentOpeningHours.openNow)) {
              return <li key={index}>{restaurant.displayName.text} - 未營業</li>;
            }
            return null;
          })}
        </ul>
      </div>
      <button onClick={selectRandomRestaurant} className="btn btn-primary">隨機選擇餐廳</button>

      <div>
        {selectedRestaurant ? (
          <p><a href={selectedRestaurant.googleMapsUri} target="_blank" rel="noopener noreferrer">{selectedRestaurant.displayName.text}</a></p>
        ) : (
          <p>點擊按鈕以選擇一家餐廳</p>
        )}
      </div>
    </div>
  );
}

export default LocationComponent;