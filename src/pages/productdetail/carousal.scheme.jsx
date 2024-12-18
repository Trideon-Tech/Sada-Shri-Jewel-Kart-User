import React from 'react';
import Carousel from 'react-material-ui-carousel'

export default function CarouselScheme() {
    var items = [
        {
            imageName: "scheme_1.gif",
            alt: "scheme1"
        },
        {
            imageName: "scheme_2.gif",
            alt: "scheme2"
        },
        {
            imageName: "scheme_3.gif",
            alt: "scheme3"
        }
    ]

    return (
        <Carousel>
            {
                items.map((item, i) => <Item key={i} item={item} />)
            }
        </Carousel>
    )
}

function Item(props) {
    return (
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