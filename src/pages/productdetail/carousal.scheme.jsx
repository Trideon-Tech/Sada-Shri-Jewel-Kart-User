import React from 'react';
import Carousel from 'react-material-ui-carousel'

export default function CarouselScheme() {
    var items = [
        {
            imageName: "22.webp",
            alt: "scheme1"
        },
        {
            imageName: "23.webp",
            alt: "scheme2"
        },
        {
            imageName: "24.webp",
            alt: "scheme3"
        }
    ]

    // remove left and right arrows
    return (
        <Carousel 
            navButtonsAlwaysInvisible 
            indicators={false} 
            sx={{ 
                width: {
                    xs: "100%", // width for extra-small devices (phones)
                    sm: "100%", // width for small devices (tablets)
                    md: "98%", // width for medium and larger devices
                },
                // margin: "auto" // center the carousel
            }}
        >
            {
                items.map((item, i) => <Item key={i} item={item} />)
            }
        </Carousel>
    )
}

function Item(props) {
    return (
        // only show the image when fully loaded
        <img
            src={process.env.PUBLIC_URL + `/assets/${props.item.imageName}`}
            alt={props.item.alt}
            style={{
                width: "100%",
                height: "100%",
                borderRadius: "10px",
            }}
        />
    )
}