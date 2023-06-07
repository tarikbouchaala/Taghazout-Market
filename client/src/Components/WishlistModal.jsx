import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PlusIcon, MinusIcon } from '@heroicons/react/20/solid';
import { removeFromFavorites } from "../Redux/Slices/WishlistSlice";


export default function WishlistModal({ wishlistModal, setWishlistModal }) {
    const { wishlist } = useSelector(state => state.Wishlist)
    const { token } = useSelector(state => state.Auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleRemoveProductFromWishlist = (productId) => {
        dispatch(removeFromFavorites({ productId, token })).unwrap()
            .then(data => {
                if (data.status == 200) {
                    toast.success(data.message)
                }
                else {
                    toast.info(data.message)
                }
            })
            .catch((rejectedValueOrSerializedError) => {
                toast.error(rejectedValueOrSerializedError)
                console.log("Error Occured :", rejectedValueOrSerializedError)
            })
    }

    return (
        <Transition.Root show={wishlistModal} as={Fragment}>
            <Dialog as="div" className="relative z-20" onClose={setWishlistModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col bg-white shadow-xl">
                                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-medium text-gray-900">My Wishlist</Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                                        onClick={() => setWishlistModal(false)}
                                                      >
                                                        <span className="sr-only">Close panel</span>
                                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                            {wishlist?.length != 0 ? <div className="mt-8">
                                                <div className="flow-root">
                                                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                                                        {wishlist?.map((product) => (
                                                            <li key={product.product.id} className="flex py-6">
                                                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                                    <img
                                                                        src={product.product.product_images[0].image}
                                                                        alt={`Product Image ${product.product.product_images[0].id}`}
                                                                        className="h-full w-full object-cover object-center"
                                                                    />
                                                                </div>
                                                                <div className="ml-4 flex flex-1 flex-col">
                                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                                        <h3>
                                                                            <div className="cursor-pointer" onClick={e => {
                                                                                setWishlistModal(false)
                                                                                navigate(`/product/${product.product.id}`)
                                                                            }} >{product.product.name}</div>
                                                                        </h3>
                                                                    </div>
                                                                    <div className="flex flex-1 items-end justify-between text-sm">
                                                                        <div className="flex">
                                                                            <button
                                                                                type="button"
                                                                                className="font-medium select-none bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent"
                                                                                onClick={e => handleRemoveProductFromWishlist(product.product.id)}
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div> :
                                                <h1 className="text-4xl font-sans h-[calc(100%-20%)] flex justify-center items-center">Wishlist is empty</h1>
                                            }
                                        </div>
                                        {/* {[].length != 0 &&
                                            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                                <div className="mb-6 flex flex-col justify-around md:flex-row">
                                                    <div className="w-full md:w-49  select-none">
                                                        <NavLink to='/checkout' onClick={e => setWishlistModal(false)} className="flex items-center justify-center rounded-md border-transparent bg-gradient-to-r from-red-500 to-yellow-400 px-6 py-3 text-base font-medium text-white shadow-sm">
                                                            Checkout
                                                        </NavLink>
                                                    </div>
                                                    <div className="mt-6 md:mt-0 bg-white select-none border rounded w-full md:w-49">
                                                        <div onClick={e => handleClearCart()} className="flex cursor-pointer items-center justify-center rounded-md bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent px-6 py-3 text-base font-medium shadow-sm">
                                                            Clear cart
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <p>Subtotal</p>
                                                    <p>${cart.reduce((total, product) => total + parseFloat(product.price) * parseFloat(product.quantity), 0)}</p>
                                                </div>
                                                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout</p>
                                                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                                    <p>
                                                        or <NavLink
                                                            to="/store"
                                                            className="font-medium text-transparent bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text"
                                                            onClick={() => {
                                                                setWishlistModal(false)
                                                            }}
                                                        >Continue Shopping
                                                            <span aria-hidden="true"> &rarr;</span>
                                                        </NavLink>
                                                    </p>
                                                </div>
                                            </div>
                                        } */}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}