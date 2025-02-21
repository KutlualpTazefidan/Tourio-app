import Link from "next/link.js";
import styled from "styled-components";
import { StyledImage } from "./StyledImage.js";
import { useState, useEffect } from "react";
const Article = styled.article`
  border: 5px solid transparent;
  border-radius: 0.8rem;
  padding: 0.5rem;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
`;

const ImageContainer = styled.div`
  position: relative;
  height: 10rem;
`;

const Figure = styled.figure`
  position: relative;
  margin: 0;
`;

const Anchor = styled.a`
  &::after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;

const ScreenReaderOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

let index = 0;

export default function Card({ name, image, location, id }) {
  const imagesToDisplay = JSON.parse(image);

  const [singleImage, setSingleImage] = useState(imagesToDisplay[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      index = (index + 1) % imagesToDisplay.length;
      console.log("image", singleImage, index);
      setSingleImage(imagesToDisplay[index]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Article>
      <Figure>
        <ImageContainer>
          <StyledImage
            src={singleImage}
            fill
            sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
            alt=""
          />
        </ImageContainer>
        <figcaption>
          <strong>{name}</strong>
        </figcaption>
      </Figure>
      <p>Location: {location}</p>
      <Link href={`places/${id}`} passHref legacyBehavior>
        <Anchor>
          <ScreenReaderOnly>More Info</ScreenReaderOnly>
        </Anchor>
      </Link>
    </Article>
  );
}
