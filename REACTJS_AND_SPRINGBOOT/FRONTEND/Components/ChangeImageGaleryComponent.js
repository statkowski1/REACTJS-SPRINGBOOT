import Carousel from 'react-bootstrap/Carousel';
import React from 'react'
import '../stylecss/carousel.css'
import img1 from '../Images/ciudad-maderas-MXbM1NrRqtI-unsplash.jpg'
import img2 from '../Images/edvin-johansson-rlwE8f8anOc-unsplash.jpg'
import img3 from '../Images/ralph-ravi-kayden-FqqiAvJejto-unsplash.jpg'

const ChangeImageGaleryComponent = () => {
  return (
    <Carousel>
        <Carousel.Item>
            <div class="carousel-image-wrapper mx-auto">
                <img
                    class="d-block w-100"
                    src={img1}
                    alt="x1"
                />
            </div>
            <Carousel.Caption>
                <h3 style={{ color: 'black' }}>Hotel</h3>
                <p style={{ color: 'black' }}>Hotel jest w posiadaniu dużego basenu</p>
            </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
            <div class="carousel-image-wrapper mx-auto">
                <img
                    class="d-block w-100"
                    src={img2}
                    alt="x2"
                />
            </div>
            <Carousel.Caption>
                <h3 style={{ color: 'black' }}>Plaża</h3>
                <p style={{ color: 'black' }}>Hotel ma w posiadaniu prywatną plażę</p>
            </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
            <div class="carousel-image-wrapper mx-auto">
                <img
                    class="d-block w-100"
                    src={img3}
                    alt="x3"
                />
            </div>
            <Carousel.Caption>
                <h3 style={{ color: 'black' }}>Pokoje</h3>
                <p style={{ color: 'black' }}>Hotel posiada wygodne pokoje</p>
            </Carousel.Caption>
        </Carousel.Item>
    </Carousel>
  )
}

export default ChangeImageGaleryComponent