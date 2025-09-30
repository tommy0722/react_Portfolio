const fetchNearbyRestaurants = async (latitude, longitude, apiKey, radius) => {
    const url = "https://places.googleapis.com/v1/places:searchNearby";
    const data = {
        includedTypes: ["restaurant"],
        maxResultCount: null,
        locationRestriction: {
            circle: {
                center: { latitude, longitude },
                radius: radius,
            }
        },
    };

    const headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.displayName,places.location,places.rating,places.priceLevel,places.googleMapsUri,places.businessStatus,places.currentOpeningHours",
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Network response was not ok.");
        const result = await response.json();
        return result.places;
    } catch (error) {
        console.error("Error fetching nearby restaurants:", error);
        alert(error)
        throw error;
    }
};
export default fetchNearbyRestaurants;