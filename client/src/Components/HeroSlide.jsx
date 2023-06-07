import { BuildingStorefrontIcon } from '@heroicons/react/24/solid'
import { NavLink } from 'react-router-dom';

export default function HeroSlide({ image, title, description }) {
    return (
        <div className="container mx-auto md:pb-2 flex items-center">
            <div className="relative mx-1 flex-1 overflow-hidden rounded-md w-full h-[calc(100vh-10rem)]">
                <img
                    src={image}
                    alt="A work table with house plants"
                    className="h-full w-full object-cover object-center"
                />
                <div className="overlay absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center text-left px-8 justify-center flex-col lg:items-start lg:pl-24 lg:pr-0 ">
                    <h1 className="text-4xl text-center font-header text-white md:text-5xl">{title}</h1>
                    <p className="text-xl font-sans w-full text-center text-white mt-4 md:3/4 lg:w-auto lg:text-left">{description}</p>
                    <NavLink to="/store" className="font-sans hidden sm:flex bg-gradient-to-r from-red-500 to-yellow-400 py-4 px-8 text-lg font-medium text-white mt-8 focus:outline-none rounded-lg items-center ">Browse Store <span className="w-6 h-6 ml-2"><BuildingStorefrontIcon /></span> </NavLink>
                </div>
                <NavLink to="/store" className="font-sans absolute bottom-0 sm:hidden bg-gradient-to-r from-red-500 to-yellow-400 py-4 text-base font-medium text-white mt-8 flex justify-center items-center w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 hover:bg-gray-700">Browse Store <span className="w-6 h-6 ml-2"><BuildingStorefrontIcon /></span> </NavLink>
            </div>
        </div>
    );
};
