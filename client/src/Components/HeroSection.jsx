import decoration from "../assets/Images/decoration.jpg";
import sneakers from "../assets/Images/sneakers.jpg";
import electronics from "../assets/Images/electronics.jpg";
import watches from "../assets/Images/watches.jpg";
import Slider from "react-slick";
import HeroSlide from "./HeroSlide";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from "react-redux";

export default function HeroSection() {
    const sliders = [
        {
            image: decoration,
            title: "Transform Your Space",
            description: "Elevate your home with our unique and stylish decor collection"
        },
        {
            image: sneakers,
            title: "Step Up Your Style",
            description: "Find the perfect pair of sneakers to complete any look"
        },
        {
            image: electronics,
            title: "Immerse Yourself in Sound",
            description: "Experience top-quality headphones with our collection"
        },
        {
            image: watches,
            title: "Timeless Style",
            description: "Discover our collection of premium watches for any occasion"
        },
    ];

    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        fade: true,
        cssEase: "linear",
        arrows: false,
    };

    return (
        <Slider {...settings}>
            {
                sliders.map((slider, index) => {
                    return (
                        <HeroSlide
                            key={index}
                            image={slider.image}
                            title={slider.title}
                            description={slider.description}
                        />
                    );
                })}
        </Slider>
    );
}
