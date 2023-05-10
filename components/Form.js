import styled from "styled-components";
import { StyledButton } from "./StyledButton.js";
import { useRef, useState } from "react";
import { StyledImage } from "./StyledImage.js";
// checking if the map is loaded
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import Link from "next/link.js";

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: inherit;
  border: 3px solid transparent;
  border-radius: 0.5rem;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
`;

const Textarea = styled.textarea`
  font-family: inherit;
  border: 3px solid transparent;
  border-radius: 0.5rem;
  padding: 0.5rem;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
`;

const Label = styled.label`
  font-weight: bold;
`;

const StyledAddButton = styled(StyledButton)`
  margin-top: 1rem;
`;

const StyledMapContainer = styled.div`
  align-self: center;
  width: 90%;
  aspect-ratio: 1 / 1;
`;

const StyledInput = styled(Input)`
  width: 100%;
`;

const StyledList = styled.ul`
  list-style-type: none; /* Remove bullets */
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 4rem;
  align-items: center;
  justify-content: center;
`;

export default function Form({ onSubmit, formName, defaultData }) {
  console.log(defaultData);
  // load google map api key and libraries, enabling places
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // to get the entered location
  const autocompleteRef = useRef(null);

  const [centerCoordinate, setCenterCoordinate] = useState({
    lat: 52.5021,
    lng: 13.4113,
  });

  // if the type of the variable is provided, autocompletion is possible
  // const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [mapURL, setMapURL] = useState(defaultData?.mapURL || "http://maps.");

  // updated location after user input
  const [location, setLocation] = useState(defaultData?.location || "");

  // images container from google maps
  const [imageContainer, setImageContainer] = useState(
    defaultData ? JSON.parse(defaultData.image) : []
  );

  // to check if the map is loaded
  if (!isLoaded) {
    return <div>Loading the map ...</div>;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    onSubmit(data);
    event.target.reset();
  }

  const handleMapLoad = (map) => {
    // setMap(map);
    const center = map?.getCenter();
    const zoom = map?.getZoom();
    console.log(zoom, "zoom");
    setMapURL(
      `https://www.google.com/maps/@${center?.lat()},${center?.lng()},${zoom}z`
    );
    console.log("map url", mapURL);
  };

  async function handlePlaceSelect() {
    const enteredPlace = autocompleteRef.current.getPlace();
    console.log("place", enteredPlace);
    setLocation(enteredPlace.formatted_address);
    if (enteredPlace?.geometry?.location) {
      const { lat, lng } = enteredPlace.geometry.location;
      setCenterCoordinate({ lat: lat(), lng: lng() });
      const imageURLs = enteredPlace.photos.map((photoData) =>
        photoData.getUrl()
      );
      setImageContainer(imageURLs);
      setMapURL(`https://www.google.com/maps/@${lat()},${lng()},15z`);
    }
  }

  return (
    <FormContainer aria-labelledby={formName} onSubmit={handleSubmit}>
      <Label htmlFor="name">Name</Label>
      <Input
        id="name"
        name="name"
        type="text"
        defaultValue={defaultData?.name}
      />
      <Label htmlFor="location">Location</Label>
      <Autocomplete
        onLoad={(autocomplete) => {
          autocompleteRef.current = autocomplete;
          autocomplete.addListener("place_changed", handlePlaceSelect);
        }}
      >
        <StyledInput
          id="location"
          name="location"
          type="text"
          defaultValue={defaultData?.location}
          onChange={(event) => setLocation(event.target.value)}
          value={location}
        />
      </Autocomplete>
      <Label htmlFor="description">Description</Label>
      <Textarea
        name="description"
        id="description"
        cols="30"
        rows="10"
        defaultValue={defaultData?.description}
      ></Textarea>
      <Label htmlFor="map-url">Map Url</Label>
      <Input id="map-url" name="mapURL" type="text" value={mapURL} />
      <StyledMapContainer>
        <GoogleMap
          center={centerCoordinate}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => handleMapLoad(map)}
        >
          {centerCoordinate ? <Marker position={centerCoordinate} /> : <></>}
        </GoogleMap>
      </StyledMapContainer>
      <StyledAddButton type="submit">
        {defaultData ? "Update place" : "Add place"}
      </StyledAddButton>
      <Label htmlFor="image-url">Image Urls</Label>
      <StyledList>
        {imageContainer ? (
          imageContainer.slice(0, 8).map((image, i) => (
            <li key={i}>
              <Link href={image}>
                <StyledImage
                  src={image}
                  width={100}
                  height={100}
                  style={{ width: "10rem", height: "10rem" }}
                  alt=""
                />
              </Link>
            </li>
          ))
        ) : (
          <></>
        )}
      </StyledList>
      <Input
        id="image-url"
        name="image"
        type="hidden"
        defaultValue={defaultData?.image}
        value={JSON.stringify(imageContainer)}
      />
    </FormContainer>
  );
}
