import { Fragment, useEffect, useRef, useState } from "react";
import { Disclosure, Menu, Transition, Popover } from "@headlessui/react";
import {
    Bars3Icon,
    UserIcon,
    XMarkIcon,
    MagnifyingGlassIcon,
    HeartIcon,
    ShoppingBagIcon
} from "@heroicons/react/24/outline";
import { NavHashLink } from 'react-router-hash-link';
import logo from '../assets/Images/logo.png'
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import CartModal from "./CartModal";
import Search from "./Search";
import { useDispatch, useSelector } from "react-redux";
import { LogOut } from "../Redux/Slices/AuthSlice";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import WishlistModal from "./WishlistModal";
import { emptyWishlist, fetchFavorites } from "../Redux/Slices/WishlistSlice";
import { clearCart } from "../Redux/Slices/CartSlice";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Example() {
    const [loginModal, setLoginModal] = useState(false)
    const [registerModal, setRegisterModal] = useState(false)
    const [cartModal, setCartModal] = useState(false)
    const [wishlistModal, setWishlistModal] = useState(false)
    const [search, setSearch] = useState(false)

    const cancelButtonRef = useRef(null)
    const smallUserNavToogle = useRef(null)

    const { connected_user, token } = useSelector(state => state.Auth)
    const { wishlist } = useSelector(state => state.Wishlist)
    const { cart } = useSelector(state => state.Cart)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (token && wishlist == null) {
            dispatch(fetchFavorites(token))
                .catch((rejectedValueOrSerializedError) => {
                    toast.error(rejectedValueOrSerializedError)
                    console.log("Error Occured :", rejectedValueOrSerializedError)
                })
        }
    }, [connected_user])
    const userNavigation = connected_user ? [
        {
            name: "My Dashboard", onClick: () => {
                const role = JSON.parse(localStorage.getItem('user')).role
                if (role == "admin") {
                    navigate('/dashboard/admin')
                } else {
                    navigate('/dashboard/client')
                }
            }
        },
        { name: "Settings", onClick: "#" },
        {
            name: "Sign out", onClick: () => {
                dispatch(clearCart())
                dispatch(LogOut()).unwrap()
                    .then(data => {
                        toast.success(data.message)
                        dispatch(emptyWishlist())
                        navigate('/')
                    })
                    .catch((rejectedValueOrSerializedError) => {
                        toast.error(rejectedValueOrSerializedError)
                        console.log("Error Occured :", rejectedValueOrSerializedError)
                    })
            }
        },
    ] : [
        {
            name: "Login", onClick: () => {
                setLoginModal(true)
            }
        },
        {
            name: "Register", onClick: () => {
                setRegisterModal(true)
            }
        },
    ];

    const SmallUserNavToogle = () => {
        smallUserNavToogle.current.classList.toggle('hidden')
    }
    return (
        <>
            <div className="min-h-full sticky top-0 z-20">
                <Disclosure as="nav" className="border-b bg-gray-50 ">
                    {({ open }) => (
                        <>
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="flex h-16 items-center justify-between">
                                    <div className="flex items-center">
                                        <NavLink onClick={() => window.scrollTo(0, 0)} to="/" className="flex-shrink-0">
                                            <img
                                                className="hidden md:block"
                                                src={logo}
                                                alt="Large Image"
                                            />
                                            <img
                                                className="block md:hidden"
                                                src={logo}
                                                alt="Small Image"
                                            />
                                        </NavLink>
                                    </div>
                                    <Popover.Group className="hidden lg:flex flex- lg:gap-x-12 ">
                                        <Popover className="relative">
                                            <NavHashLink
                                                to="/#"
                                                smooth
                                                className={({ isActive }) => isActive ? "flex items-center gap-x-1 text-md font-semibold leading-6 bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent" : "flex items-center gap-x-1 text-md font-semibold leading-6 text-gray-900"}>
                                                Home
                                            </NavHashLink>
                                        </Popover>
                                        <Popover className="relative">
                                            <NavLink onClick={() => window.scrollTo(0, 0)} to="/categories" className={({ isActive }) => isActive ? "flex items-center gap-x-1 text-md font-semibold leading-6 bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent" : "flex items-center gap-x-1 text-md font-semibold leading-6 text-gray-900"}>
                                                Categories
                                            </NavLink>
                                        </Popover>
                                        <Popover className="relative">
                                            <NavLink onClick={() => window.scrollTo(0, 0)} to="/store" className={({ isActive }) => isActive ? "flex items-center gap-x-1 text-md font-semibold leading-6 bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent" : "flex items-center gap-x-1 text-md font-semibold leading-6 text-gray-900"}>
                                                Store
                                            </NavLink>
                                        </Popover>
                                        <Popover>
                                            <NavHashLink
                                                to="/#contactUs"
                                                smooth
                                                className="flex items-center gap-x-1 text-md font-semibold leading-6 text-gray-900">
                                                Contact Us
                                            </NavHashLink>
                                        </Popover>
                                    </Popover.Group>
                                    {search && <Search setSearch={setSearch} />}
                                    <div className="hidden md:block">
                                        <div className="ml-4 flex items-center md:ml-6">
                                            <button type="button" onClick={e => setSearch(true)} className="relative rounded-full p-1 text-black hover:text-gray-400 focus:outline-none mx-2">
                                                <span className="sr-only">Search components</span>
                                                <MagnifyingGlassIcon className="h-6 w-6" />
                                            </button>
                                            {
                                                connected_user && <button
                                                    type="button"
                                                    className=" relative rounded-full p-1 text-black hover:text-gray-400 focus:outline-none mx-2"
                                                    onClick={e => setWishlistModal(true)}
                                                >
                                                    <HeartIcon className="h-6 w-6" aria-hidden="true" />
                                                    {(wishlist && wishlist.length != 0) && <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                                        {wishlist?.length}
                                                    </span>}
                                                </button>
                                            }
                                            <button
                                                type="button"
                                                className=" relative rounded-full p-1 text-black hover:text-gray-400 focus:outline-none mx-2"
                                                onClick={e => setCartModal(true)}
                                            >
                                                <ShoppingBagIcon
                                                    className="h-6 w-6 "
                                                    aria-hidden="true"
                                                />
                                                {cart.length !== 0 &&
                                                    <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                                        {cart.length === 1 && cart[0].quantity == 1
                                                            ? cart.length
                                                            : cart.reduce((total, product) => total + parseFloat(product.quantity), 0)}
                                                    </span>
                                                }

                                            </button>
                                            <Menu as="div" className="relative ml-3">
                                                <div>
                                                    <Menu.Button className="flex max-w-xs items-center rounded-full text-sm hover:text-gray-400 focus:outline-none ">
                                                        <span className="sr-only">Open user menu</span>
                                                        {connected_user ?
                                                            <div className="user-image bg-orange-500 w-8 h-8 flex justify-center items-center rounded-full">
                                                                <span className="initial select-none text-white font-medium">{connected_user.full_name?.charAt(0)}</span>
                                                            </div>
                                                            : <UserIcon className="h-6  w-6" aria-hidden="true" />
                                                        }
                                                    </Menu.Button>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        {userNavigation.map((item) => (
                                                            <Menu.Item key={item.name}>
                                                                {({ active }) => (
                                                                    <a
                                                                        onClick={e => item.onClick()}
                                                                        className={classNames(
                                                                            active ? "bg-gray-100" : "",
                                                                            "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                                                                        )}
                                                                    >
                                                                        {item.name}
                                                                    </a>
                                                                )}
                                                            </Menu.Item>
                                                        ))}
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        </div>
                                    </div>
                                    <div className="-mr-2 flex md:hidden">
                                        {/* Mobile menu button */}
                                        <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="sr-only">Open main menu</span>
                                            {open ? (
                                                <XMarkIcon
                                                    className="block h-6 w-6"
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <Bars3Icon
                                                    className="block h-6 w-6"
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </Disclosure.Button>
                                    </div>
                                </div>
                            </div>
                            <Disclosure.Panel className="md:hidden">
                                <div className="border-t border-gray-200 pb-3 pt-4">
                                    <div className="flex justify-center gap-4">
                                        {
                                            connected_user && <button
                                                type="button"
                                                className=" relative rounded-full p-1 text-black hover:text-gray-400 focus:outline-none mx-2"
                                                onClick={e => setWishlistModal(true)}
                                            >
                                                <HeartIcon className="h-6 w-6" aria-hidden="true" />
                                                {(wishlist && wishlist.length != 0) && <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                                    {wishlist?.length}
                                                </span>}
                                            </button>
                                        }
                                        <button
                                            type="button"
                                            className=" relative rounded-full p-1 text-black hover:text-gray-400 focus:outline-none mx-2"
                                        >
                                            <ShoppingBagIcon
                                                className="h-6 w-6 "
                                                aria-hidden="true"
                                                onClick={e => setCartModal(true)}
                                            />
                                            <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                                5
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={e => SmallUserNavToogle()}
                                            className="relative rounded-full p-1 text-black hover:text-gray-400 focus:outline-none mx-2"
                                        >
                                            {connected_user ?
                                                <div className="user-image bg-orange-500 w-8 h-8 flex justify-center items-center rounded-full">
                                                    <span className="initial select-none text-white font-medium">{connected_user.full_name.charAt(0)}</span>
                                                </div>
                                                : <UserIcon className="h-6  w-6" aria-hidden="true" />
                                            }
                                        </button>
                                    </div>
                                    <div className="mt-3 space-y-1 px-2 hidden" ref={smallUserNavToogle}>
                                        {userNavigation.map((item) => (
                                            <Disclosure.Button
                                                key={item.name}
                                                as="a"
                                                onClick={e => item.onClick()}
                                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                            >
                                                {item.name}
                                            </Disclosure.Button>
                                        ))}
                                    </div>
                                </div>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            </div >

            {/* Login Modal Starts */}
            < LoginModal loginModal={loginModal} setLoginModal={setLoginModal} cancelButtonRef={cancelButtonRef} setRegisterModal={setRegisterModal} />
            {/* Login Modal End */}

            {/* Register Modal Starts */}
            <RegisterModal registerModal={registerModal} cancelButtonRef={cancelButtonRef} setRegisterModal={setRegisterModal} setLoginModal={setLoginModal} />
            {/* Register Modal End */}

            {/* Cart Modal Starts */}
            <CartModal cartModal={cartModal} setLoginModal={setLoginModal} setCartModal={setCartModal} />
            {/* Cart Modal End */}

            {/* Cart Modal Starts */}
            <WishlistModal wishlistModal={wishlistModal} setWishlistModal={setWishlistModal} />
            {/* Cart Modal End */}
        </>
    );
}
