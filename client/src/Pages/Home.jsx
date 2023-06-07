import { useEffect, useRef, useState } from "react";
import AboutUs from "../Components/AboutUs";
import CollectionSection from "../Components/CollectionSection";
import HeroSection from "../Components/HeroSection";
import ProductCard from "../Components/ProductCard";
import ProductModal from "../Components/ProductModal";
import { Getsliders } from "../Redux/Slices/SliderSlice";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../Components/Footer";
import Contact from "../Components/Contact";
import Header from "../Components/Header";
import { GetProducts } from "../Redux/Slices/ProductSlice";
import { toast } from "react-toastify";
import Slider from "react-slick";
import ProductSliderSettings from "../settings/ProductSliderSettings";
import "../index.css";
import moment from "moment";
import LoginModal from "../Components/LoginModal";
import RegisterModal from "../Components/RegisterModal";
import Banner from "../Components/Banner";
import Loading from './../Components/Loading';

export default function Home() {
    const [productModal, setProductModal] = useState(false);
    const [selectedProductModal, setSelectedProductModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [FeaturedgProducts, setFeaturedgProducts] = useState([]);
    const [NewArrivalProducts, setnewArrivalProducts] = useState([]);
    const [loginModal, setLoginModal] = useState(false)
    const [registerModal, setRegisterModal] = useState(false)
    const cancelButtonRef = useRef(null)

    const dispatch = useDispatch();

    const { cart } = useSelector(state => state.Cart)
    const { wishlist } = useSelector(state => state.Wishlist)

    useEffect(() => {
        dispatch(GetProducts())
            .unwrap()
            .then((result) => {
                const newTrendingProducts = result.data.filter(
                    (product) => product.trending == 1 && product.status == 0
                );
                const FeaturedgProducts = result.data.filter(
                    (product) => product.featured == 1 && product.status == 0
                );
                const newProducts = [...result.data];
                newProducts.sort((a, b) => new Date(b.create_at) - new Date(a.create_at));
                const slicedProducts = newProducts.slice(0, 16);
                setnewArrivalProducts(slicedProducts);

                setTrendingProducts(newTrendingProducts);
                setFeaturedgProducts(FeaturedgProducts);
                setLoading(false);
            })
            .catch((rejectedValueOrSerializedError) => {
                setLoading(false);
                toast.error(rejectedValueOrSerializedError);
                console.log("Error Occured :", rejectedValueOrSerializedError);
            });
    }, [dispatch]);

    return (
        <>
            {
                loading && <Loading />
            }
            <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} cancelButtonRef={cancelButtonRef} setRegisterModal={setRegisterModal} />
            <RegisterModal registerModal={registerModal} cancelButtonRef={cancelButtonRef} setRegisterModal={setRegisterModal} setLoginModal={setLoginModal} />
            <Header />
            <div id='#'>
                <HeroSection />
                {
                    (trendingProducts?.length != 0 || FeaturedgProducts?.length != 0 || NewArrivalProducts?.length != 0) &&
                    <div className="bg-white">
                        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 ">
                            {
                                trendingProducts?.length != 0 &&
                                <div div id="trendingP" class="relative inline-block">
                                    <h2 class=" font-sans text-2xl font-bold  text-black inline-block mb-3">
                                        Trending Products
                                    </h2>
                                    <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-yellow-400"></div>
                                </div>
                            }
                            <Slider {...ProductSliderSettings} className="py-6 ">
                                {trendingProducts?.map((product, index) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        name={product.name}
                                        oldPrice={product.original_price}
                                        quantity={product.quantity}
                                        price={product.selling_price}
                                        inCart={cart.findIndex(productInCart => productInCart.product_id == product.id) != -1}
                                        inWishlist={!wishlist ? false : wishlist.findIndex(productInWishlist => productInWishlist.product_id === product.id) !== -1}
                                        images={product.images}
                                        onClick={(e) => {
                                            setProductModal(true);
                                            setSelectedProductModal(product);
                                        }}
                                    />
                                ))}
                            </Slider>
                            {
                                FeaturedgProducts?.length != 0 &&
                                <div id="FeaturedP" class="relative inline-block">
                                    <h2 class=" font-sans text-2xl font-bold  text-black inline-block mb-3">
                                        Featured Products
                                    </h2>
                                    <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-yellow-400"></div>
                                </div>
                            }
                            <Slider {...ProductSliderSettings} className="mt-6 flex gap-5 pb-6">
                                {FeaturedgProducts?.map((product, index) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        name={product.name}
                                        price={product.selling_price}
                                        quantity={product.quantity}
                                        oldPrice={product.original_price}
                                        inCart={cart.findIndex(productInCart => productInCart.product_id == product.id) != -1}
                                        inWishlist={!wishlist ? false : wishlist.findIndex(productInWishlist => productInWishlist.product_id === product.id) !== -1}
                                        images={product.images}
                                        onClick={(e) => {
                                            setProductModal(true);
                                            setSelectedProductModal(product);
                                        }}
                                    />
                                ))}
                            </Slider>
                            {
                                NewArrivalProducts?.length != 0 &&
                                <div id="NewArrivalP" class="relative inline-block">
                                    <h2 class=" font-sans text-2xl font-bold  text-black inline-block mb-3">
                                        New Arrival Products
                                    </h2>
                                    <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-yellow-400"></div>
                                </div>
                            }
                            <Slider {...ProductSliderSettings} className="mt-6 flex gap-5">
                                {NewArrivalProducts?.map((product, index) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        name={product.name}
                                        price={product.selling_price}
                                        quantity={product.quantity}
                                        oldPrice={product.original_price}
                                        inCart={cart.findIndex(productInCart => productInCart.product_id == product.id) != -1}
                                        inWishlist={!wishlist ? false : wishlist.findIndex(productInWishlist => productInWishlist.product_id === product.id) !== -1}
                                        images={product.images}
                                        onClick={(e) => {
                                            setProductModal(true);
                                            setSelectedProductModal(product);
                                        }}
                                    />
                                ))}
                            </Slider>
                            <ProductModal
                                setProductModal={setProductModal}
                                productModal={productModal}
                                selectedProductModal={selectedProductModal}
                                setLoginModal={setLoginModal}
                            />
                        </div>
                    </div>
                }

                <Banner />
                <Contact setLoading={setLoading} />
                <Footer />
            </div >
        </ >
    );
}
