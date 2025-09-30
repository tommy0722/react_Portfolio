import React, { useState, useEffect } from 'react';
import performRequest from './api';
import fetchNearbyRestaurants from './googlemapapi'

function LocationComponent() {
  const [radius, setRadius] = useState(500);
  const [wheel, setWheel] = useState(null);
  const [winningRestaurant, setWinningRestaurant] = useState(null);
  const apikey = 'AIzaSyAmYZHvMoDf0Oc-7DK4-QmUNGD88YHX6xA';
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

  useEffect(() => {
    if (location.loaded && location.restaurants.length > 0) {
      const segments = location.restaurants.map((item, index) => {
        if (item.currentOpeningHours && item.currentOpeningHours.openNow === true) {
          return {
            'fillStyle': ['#AAAAFF', '#84C1FF', '#A6FFFF', '#96FED1', '#BBFFBB', '#D3FF93', '#FFFFAA', '#FFED97', '#FFD1A4', '#FFDAC8'][index % 10],
            'text': item.displayName.text,
          };
        }
        return null;
      }).filter(segment => segment !== null);
      const newWheel = new window.Winwheel({
        'numSegments': segments.length,
        'outerRadius': 150,
        'textFontSize': 12,
        'segments': segments,
        'animation': {
          'type': 'spinToStop',
          'duration': 5,
          'spins': 8,
          'callbackFinished': async (indicatedSegment) => {
            const restaurant = location.restaurants.find(r => r.displayName.text === indicatedSegment.text);
            setWinningRestaurant(restaurant);
            alert("你抽中了：" + indicatedSegment.text);
            const mapUrl = `${restaurant.googleMapsUri}`;
            if (window.confirm("要導向Google Map查看餐廳位置嗎?")) {
              window.open(mapUrl, '_blank');
            }
            const locationString = `${location.coordinates.lat}, ${location.coordinates.lng}`;
            const [, error] = await performRequest(
              'https://myweb-backend-571409330129.asia-east1.run.app/api/roulette/eatlogs/',
              'POST',
              { body: { Customer: locationString, Food: indicatedSegment.text } }
            );
            if (error) {
              console.error("Failed to save the winning food:", error);
            } else {
              console.log("Winning food saved successfully:", location.restaurants);
              newWheel.rotationAngle = 0;
              newWheel.draw();
            }

          }
        }
      });
      setWheel(newWheel);
    }
  }, [location.loaded, location.restaurants]);

  if (location.error) return <div>Error: {location.error.message}</div>;
  if (!location.loaded) return <div>Loading location...</div>;
  // if (!location.restaurants.length) return <div>Loading restaurants...</div>;
  const startSpin = () => {
    wheel?.startAnimation();

  };
  return (
    <div>
      {/* <div>JSON Data: {JSON.stringify(location.restaurants, null, 2)}</div> */}
      {/* <ul>
        {location.restaurants.map((restaurant, index) => (
          <li key={index}>{restaurant.displayName && restaurant.displayName.text}</li>
          // <li key={index}>{restaurant}</li>
        ))}
      </ul> */}

      <h1>尋找附近的餐廳</h1>
      <h3>如果沒顯示代表你附近沒營業的餐廳</h3>
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
      <canvas canvas id="canvas" onClick={startSpin} width="400" height="400" style={{width:'100%',maxWidth:'800px',minWidth:'300px'}}>
        Canvas not supported, use another browser.
      </canvas>

      <div>
        {winningRestaurant ? (
          <div>
            <p>你抽中了: <a href={winningRestaurant.googleMapsUri} target="_blank" rel="noopener noreferrer">{winningRestaurant.displayName.text}</a></p>
          </div>
        ) : (
          <p>請點選輪盤選餐廳</p>
        )}
      </div>
    </div>
  );
}

export default LocationComponent;