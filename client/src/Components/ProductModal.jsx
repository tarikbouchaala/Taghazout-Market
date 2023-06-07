import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/20/solid'
import Magnifier from "react-magnifier";
import { useDispatch } from 'react-redux';
import { addToCart, storeCart, updateCart } from '../Redux/Slices/CartSlice';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { addToFavorites } from '../Redux/Slices/WishlistSlice';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ProductModal({ setProductModal, productModal, selectedProductModal, setLoginModal }) {

    const { token } = useSelector(state => state.Auth)
    const dispatch = useDispatch()

    const handleAddToCart = (product) => {
        if (selectedProductModal.quantity <= 0) {
            toast.info('The product is out of stock')
        } else {
            if (token) {
                // User is connected
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
                // User not connected yet
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
                        setLoginModal(true)
                        setProductModal(false)
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
            setProductModal(false)
        }
    };

    return (
        selectedProductModal &&
        <Transition.Root show={productModal} as={Fragment}>
            <Dialog as="div" className="relative z-20" onClose={setProductModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                            enterTo="opacity-100 translate-y-0 md:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 md:scale-100"
                            leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                        >
                            <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                                <div className="relative flex md:rounded-lg w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                                    <button
                                        type="button"
                                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                                        onClick={() => setProductModal(false)}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>

                                    <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                                        <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
                                            <Magnifier src={selectedProductModal.images[0].image} alt={`Produc Image ${selectedProductModal.images[0].id}`} className='object-cover object-center' />
                                        </div>
                                        <div className="sm:col-span-8 lg:col-span-7">
                                            <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">{selectedProductModal.name}</h2>

                                            <section aria-labelledby="information-heading" className="mt-2">
                                                <h3 id="information-heading" className="sr-only">
                                                    Product information
                                                </h3>
                                                <p className="text-2xl text-gray-900"><span className='mr-2 text-gray-600 line-through'>${selectedProductModal.original_price}</span>${selectedProductModal.selling_price}</p>
                                                {/* Reviews */}
                                                <div className="mt-2">
                                                    {/* <h4 className="sr-only">Reviews</h4>
                                                    <div className="flex items-center">
                                                        <div className="flex items-center">
                                                            {[0, 1, 2, 3, 4].map((rating) => (
                                                                <StarIcon
                                                                    key={rating}
                                                                    className={classNames(
                                                                        3.5 > rating ? 'text-gray-900' : 'text-gray-200',
                                                                        'h-5 w-5 flex-shrink-0'
                                                                    )}
                                                                    aria-hidden="true"
                                                                />
                                                            ))}
                                                        </div>
                                                        <p className="sr-only">3.5 out of 5 stars</p>
                                                        <div className="ml-3 cursor-default text-sm font-medium bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                                                            127 reviews
                                                        </div>
                                                    </div> */}
                                                    <div className="description mt-2">
                                                        <h2 className="text-2xl font-bold mb-4">Description</h2>
                                                        <p className="text-gray-700">
                                                            {selectedProductModal.description.length > 600 ? selectedProductModal.description.slice(0, 600) + "..." : selectedProductModal.description}
                                                        </p>
                                                    </div>
                                                    <div className="flex w-full gap-3 items-center justify-around">
                                                        <button
                                                            className="mt-6 w-2/5 rounded-md bg-gradient-to-r from-red-500 to-yellow-400 px-8 py-3 text-base font-medium text-white focus:outline-none"
                                                            onClick={e => {
                                                                handleAddToCart({ product_id: selectedProductModal.id, name: selectedProductModal.name, price: selectedProductModal.selling_price, image: selectedProductModal.images[0] })
                                                                setProductModal(false)
                                                            }}
                                                        >
                                                            Add to cart
                                                        </button>
                                                        <button
                                                            className="mt-6 w-2/5 rounded-md bg-gradient-to-r from-red-500 to-yellow-400 px-8 py-3 text-base font-medium bg-clip-text border border-yellow-400 text-transparent focus:outline-none"
                                                            onClick={e => {
                                                                handleAddToWishList(selectedProductModal.id)
                                                                setProductModal(false)
                                                            }}
                                                        >
                                                            Add to wishlist
                                                        </button>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div >
            </Dialog >
        </Transition.Root >
    )
}

