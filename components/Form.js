import styled from "styled-components";
import { StyledButton } from "./StyledButton.js";
import { useState } from "react";
// checking if the map is loaded
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

const center = { lat: 52.5021, lng: 13.4113 };

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

export default function Form({ onSubmit, formName, defaultData }) {
  // load google map api key and libraries, enabling places
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // if the type of the variable is provided, autocompletion is possible
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));

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
      <Autocomplete>
        <StyledInput
          id="location"
          name="location"
          type="text"
          defaultValue={defaultData?.location}
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
      <Label htmlFor="image-url">Image Url</Label>
      <Input
        id="image-url"
        name="image"
        type="text"
        defaultValue={defaultData?.image}
      />
      <Label htmlFor="map-url">Map Url</Label>
      <Input
        id="map-url"
        name="mapURL"
        type="text"
        defaultValue={defaultData?.mapURL}
      />
      <StyledMapContainer>
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} />
        </GoogleMap>
      </StyledMapContainer>
      <StyledAddButton type="submit">
        {defaultData ? "Update place" : "Add place"}
      </StyledAddButton>
    </FormContainer>
  );
}
