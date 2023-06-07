import { HeartIcon, ShoppingBagIcon } from "@heroicons/react/24/solid";
import { addToCart, storeCart, updateCart } from "../Redux/Slices/CartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToFavorites } from "../Redux/Slices/WishlistSlice";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useRef, useState } from "react";

export default function ProductCard({
    id,
    name,
    price,
    oldPrice,
    images,
    onClick,
    quantity,
    inCart,
    inWishlist
}) {
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.Auth)
    const [loginModal, setLoginModal] = useState(false)
    const [registerModal, setRegisterModal] = useState(false)
    const cancelButtonRef = useRef(null)

    const handleAddToCart = (product) => {
        if (quantity <= 0) {
            toast.info('The product is out of stock')
        } else {
            if (token) {
                dispatch(storeCart([{ ...product, quantity: 1 }])).unwrap()
                    .then(data => {
                        dispatch(updateCart(JSON.stringify(data.data)))
                        toast.success("Product added to cart");
                    })
                    .catch((rejectedValueOrSerializedError) => {
                        toast.error(rejectedValueOrSerializedError)
                        console.log("Error Occured :", rejectedValueOrSerializedError)
                    })
            }
            else {
                dispatch(addToCart({ ...product, quantity: 1 }));
                toast.success("Product added to cart");
            }
        }
    };

    const handleAddToWishList = (productId) => {
        if (token) {
            dispatch(addToFavorites({ productId, token })).unwrap()
                .then((data) => {
                    if (data.status == 409) {
                        toast.info("Product already in wishlist");
                    }
                    else if (data.status == 401) {
                        toast.error("You should be logged in to add products to wishlist");
                    } else {
                        toast.success("Product added to wishlist");
                    }
                })
                .catch((rejectedValueOrSerializedError) => {
                    toast.error(rejectedValueOrSerializedError)
                    console.log("Error Occured :", rejectedValueOrSerializedError)
                })
        } else {
            setLoginModal(true)
        }
    };

    return (
        <div
            key={id}
            className="group ml-3 relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden"
        >
            <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} cancelButtonRef={cancelButtonRef} setRegisterModal={setRegisterModal} />
            <RegisterModal registerModal={registerModal} cancelButtonRef={cancelButtonRef} setRegisterModal={setRegisterModal} setLoginModal={setLoginModal} />
            <div className="relative h-72 aspect-w-1 overflow-hidden rounded-lg bg-gray-200">
                <img
                    src={images[0].image}
                    alt={`Product ${images[0].id}`}
                    className="w-full h-full object-center object-cover sm:w-full sm:h-full"
                />
                <div
                    onClick={e => onClick()}
                    className="absolute cursor-pointer top-0 left-0 w-full z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300 transition-opacity"
                >
                    <div className="flex justify-between w-full " onClick={e => e.stopPropagation()}>
                        <div className={inWishlist ? " p-3 rounded-full bg-gradient-to-r from-red-500 to-yellow-400 text-white font-bold z-20 absolute top-4 left-5 "
                            : " p-3 rounded-full bg-gray-200 text-black font-bold absolute top-4 left-5 "}
                            onClick={e => handleAddToWishList(id)}
                        >
                            <HeartIcon className="w-4 h-4" />
                        </div>
                        <div className={inCart ? "p-3 rounded-full bg-gradient-to-r from-red-500 to-yellow-400  text-white font-bold z-20 absolute top-4 right-5"
                            : "p-3 rounded-full bg-gray-200 text-black font-bold absolute top-4 right-5"}
                            onClick={e => handleAddToCart({ product_id: id, price, name, image: images[0] })}
                        >
                            <ShoppingBagIcon className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between p-4 space-y-2">
                <div className="flex-1  flex flex-col">
                    <h3 className="text-xl font-medium text-gray-900">
                        <div>
                            <span aria-hidden="true" className="absolute inset-0" />
                            {name.length < 13 ? name : `${name.slice(0, 13)}...`}
                        </div>
                    </h3>
                    <div className="flex-1 flex flex-col justify-end">
                        <p className="text-base font-medium text-gray-900">${price}<span className="text-gray-600 line-through pl-2">${oldPrice}</span></p>
                    </div>
                </div>
                {quantity <= 0 ? <span className="text-red-500 font-semibold">Out of stock</span>
                    :
                    <span className="text-green-500 font-semibold">Available</span>
                }
            </div>
        </div >
    )
}
