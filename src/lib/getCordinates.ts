export const getCoordinates = async (location: string) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${location}&format=json`
    );

    const coordinatesJson = await response.json();

    if (coordinatesJson && coordinatesJson.length > 0) {
      return coordinatesJson[0];
    } else {
      console.warn(`No coordinates found for location: ${location}`);
      return null;
    }
  } catch (error: any) {
    console.error("ERROR Fetching coordinates", error.message);
    return null;
  }
};
