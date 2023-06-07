import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, deleteFromCart, destroyUserCart, removeCartItem, updateCart, updateCartItem, updateProductInCart } from "../Redux/Slices/CartSlice";
import { toast } from "react-toastify";
import { PlusIcon, MinusIcon } from '@heroicons/react/20/solid';
import { GetProducts } from "../Redux/Slices/ProductSlice";


export default function CartModal({ cartModal, setCartModal, setLoginModal }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { token } = useSelector(state => state.Auth)
    const { cart } = useSelector(state => state.Cart)
    const { Products: products } = useSelector(state => state.Product)


    useEffect(() => {
        dispatch(GetProducts()).unwrap()
            .catch((rejectedValueOrSerializedError) => {
                toast.error(rejectedValueOrSerializedError)
                console.log("Error Occured :", rejectedValueOrSerializedError)
            })
    }, [])

    const handleClearCart = () => {
        if (token) {
            dispatch(destroyUserCart()).unwrap()
                .then(data => {
                    if (data.status == 200) {
                        toast.success("Cart cleared")
                        setCartModal(false)
                    }
                })
                .catch((rejectedValueOrSerializedError) => {
                    toast.error(rejectedValueOrSerializedError)
                    console.log("Error Occured :", rejectedValueOrSerializedError)
                })
        } else {
            dispatch(clearCart())
            toast.success("Cart cleared")
            setCartModal(false)
        }
    }

    const handleRemoveProductFromCart = (id) => {
        if (token) {
            dispatch(removeCartItem(id)).unwrap()
                .then(data => {
                    if (data.status == 200) {
                        const newCart = cart.filter(cartItem => cartItem.id != id);
                        dispatch(updateCart(JSON.stringify(newCart)))
                    }
                    else if (data.status == 404) {
                        toast.error(data.message)
                    }
                })
                .catch((rejectedValueOrSerializedError) => {
                    toast.error(rejectedValueOrSerializedError)
                    console.log("Error Occured :", rejectedValueOrSerializedError)
                })
        } else {
            dispatch(deleteFromCart(id))
        }
    }

    const handleProductQty = (id, operator) => {
        if (token) {
            const selectedCartItem = cart.find(cartItem => cartItem.id == id)
            let newQuantity = selectedCartItem.quantity
            if (operator == '+') {
                newQuantity++
            } else {
                newQuantity--
            }
            if (newQuantity == 0) {
                handleRemoveProductFromCart(id)
            }
            dispatch(updateCartItem({ id, quantity: newQuantity })).unwrap()
                .then(data => {
                    if (data.status == 200) {
                        const newCart = cart.map(cartItem => {
                            if (cartItem.id === id) {
                                return { ...cartItem, quantity: newQuantity };
                            }
                            return cartItem;
                        });
                        dispatch(updateCart(JSON.stringify(newCart)))
                    }
                })
                .catch((rejectedValueOrSerializedError) => {
                    toast.error(rejectedValueOrSerializedError)
                    console.log("Error Occured :", rejectedValueOrSerializedError)
                })
        } else {
            const selectedProduct = cart.find(product => product.product_id == id)
            let newQuantity = selectedProduct.quantity
            if (operator == '+') {
                newQuantity++
            } else {
                newQuantity--
            }
            dispatch(updateProductInCart({ product_id: id, quantity: newQuantity }))
        }

    }

    return (
        <Transition.Root show={cartModal} as={Fragment}>
            <Dialog as="div" className="relative z-20" onClose={setCartModal}>
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
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col bg-white shadow-xl">
                                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-medium text-gray-900">Shopping cart</Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                                        onClick={() => setCartModal(false)}
                                                    >
                                                        <span className="sr-only">Close panel</span>
                                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                            {cart.length != 0 ?
                                                <div className="mt-8">
                                                    <div className="flow-root">
                                                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                                                            {token ? cart.map((product) => (
                                                                <li key={product?.product?.id} className="flex py-6">
                                                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                                        <img
                                                                            src={product?.product?.images[0]?.image}
                                                                            alt={`Product Image ${product?.product?.images[0]?.id}`}
                                                                            className="h-full w-full object-cover object-center"
                                                                        />
                                                                    </div>
                                                                    <div className="ml-4 flex flex-1 flex-col">
                                                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                                                            <div className="flex flex-col">
                                                                                <h3>
                                                                                    <div className="cursor-pointer" onClick={e => {
                                                                                        setCartModal(false)
                                                                                        navigate(`/product/${product?.product?.id}`)
                                                                                    }} >{product?.product?.name}</div>
                                                                                </h3>
                                                                                <h3>
                                                                                    <div className="text-sm text-red-500">
                                                                                        {
                                                                                            products?.find(p => p.id === product?.product?.id)?.quantity == 0 ? "Out of stock" :
                                                                                                product?.quantity > products?.find(p => p.id === product?.product?.id)?.quantity &&
                                                                                                `Only ${products?.find(p => p.id === product?.product?.id)?.quantity} left in stock`
                                                                                        }
                                                                                    </div>
                                                                                </h3>
                                                                            </div>
                                                                            <p className="ml-4">${product?.product?.selling_price * product?.quantity}</p>
                                                                        </div>
                                                                        <div className="flex flex-1 items-end justify-between text-sm">
                                                                            <p className="text-gray-500 flex items-center">
                                                                                <MinusIcon className="w-5 h-5 cursor-pointer hover:text-black" onClick={e => handleProductQty(product?.id, '-')} />
                                                                                <span className="px-4 text-lg select-none cursor-default">{product?.quantity}</span>
                                                                                <PlusIcon className="w-5 h-5 cursor-pointer hover:text-black" onClick={e => handleProductQty(product?.id, '+')} />
                                                                            </p>
                                                                            <div className="flex">
                                                                                <button
                                                                                    type="button"
                                                                                    className="font-medium select-none bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent"
                                                                                    onClick={e => handleRemoveProductFromCart(product?.id)}
                                                                                >
                                                                                    Remove
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            )) :
                                                                cart?.map((product) => (
                                                                    <li key={product?.id} className="flex py-6">
                                                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                                            <img
                                                                                src={product?.image?.image}
                                                                                alt={`Product Image ${product?.image?.id}`}
                                                                                className="h-full w-full object-cover object-center"
                                                                            />
                                                                        </div>
                                                                        <div className="ml-4 flex flex-1 flex-col">
                                                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                                                <h3>
                                                                                    <div className="cursor-pointer" onClick={e => {
                                                                                        setCartModal(false)
                                                                                        navigate(`/product/${product?.product_id}`)
                                                                                    }} >{product?.name}</div>
                                                                                </h3>
                                                                                <p className="ml-4">${product?.price * product?.quantity}</p>
                                                                            </div>
                                                                            <div className="flex flex-1 items-end justify-between text-sm">
                                                                                <p className="text-gray-500 flex items-center">
                                                                                    <MinusIcon className="w-5 h-5 cursor-pointer hover:text-black" onClick={e => handleProductQty(product?.product_id, '-')} />
                                                                                    <span className="px-4 text-lg select-none cursor-default">{product?.quantity}</span>
                                                                                    <PlusIcon className="w-5 h-5 cursor-pointer hover:text-black" onClick={e => handleProductQty(product?.product_id, '+')} />
                                                                                </p>
                                                                                <div className="flex">
                                                                                    <button
                                                                                        type="button"
                                                                                        className="font-medium select-none bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent"
                                                                                        onClick={e => handleRemoveProductFromCart(product?.product_id)}
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
                                                <h1 className="text-4xl font-sans h-[calc(100%-20%)] flex justify-center items-center">Cart is empty</h1>
                                            }
                                        </div>
                                        {cart.length != 0 &&
                                            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                                <div className="mb-6 flex flex-col justify-around md:flex-row">
                                                    <div className="w-full md:w-49  select-none">
                                                        <div onClick={e => {
                                                            setCartModal(false)
                                                            token ?
                                                                navigate('/checkout')
                                                                :
                                                                setLoginModal(true)
                                                        }} className="flex cursor-pointer items-center justify-center rounded-md border-transparent bg-gradient-to-r from-red-500 to-yellow-400 px-6 py-3 text-base font-medium text-white shadow-sm">
                                                            Checkout
                                                        </div>
                                                    </div>
                                                    <div className="mt-6 md:mt-0 bg-white select-none border rounded w-full md:w-49">
                                                        <div onClick={e => handleClearCart()} className="flex cursor-pointer items-center justify-center rounded-md bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent px-6 py-3 text-base font-medium shadow-sm">
                                                            Clear cart
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <p>Subtotal</p>
                                                    <p>${token ?
                                                        cart.reduce((total, product) => total + (parseFloat(product?.product?.selling_price) * parseFloat(product?.quantity)), 0) :
                                                        cart.reduce((total, product) => total + (parseFloat(product?.price) * parseFloat(product?.quantity)), 0)}</p>
                                                </div>
                                                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout</p>
                                                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                                    <p>
                                                        or <NavLink
                                                            to="/store"
                                                            className="font-medium text-transparent bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text"
                                                            onClick={() => {
                                                                setCartModal(false)
                                                            }}
                                                        >Continue Shopping
                                                            <span aria-hidden="true"> &rarr;</span>
                                                        </NavLink>
                                                    </p>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div >
                </div >
            </Dialog >
        </Transition.Root >
    )
}
