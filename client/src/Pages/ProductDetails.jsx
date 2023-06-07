import { Fragment, useEffect, useRef, useState } from 'react'
import { Tab } from '@headlessui/react'
import { StarIcon as AiFillStar, ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { StarIcon as AiOutlineStar } from '@heroicons/react/24/outline'
import Magnifier from 'react-magnifier'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { GetProducts } from '../Redux/Slices/ProductSlice'
import { toast } from 'react-toastify'
import { addToCart, storeCart, updateCart } from '../Redux/Slices/CartSlice'
import Header from '../Components/Header'
import { addToFavorites } from '../Redux/Slices/WishlistSlice'
import { deleteRating, rateProduct } from './../Redux/Slices/RatingSlice';
import { Rate } from 'antd';
import Slider from "react-slick";
import LoginModal from '../Components/LoginModal'
import RegisterModal from '../Components/RegisterModal'
import { GetOrders } from '../Redux/Slices/AdminOrderSlice'
import Loading from '../Components/Loading'
import ProductSliderSettings from '../settings/ProductSliderSettings';
import ProductCard from '../Components/ProductCard'


const faqs = [
    {
        question: 'What format is the Italian Soft Men s Leather Bomber Jacket available in?  ',
        answer:
            'The Italian Soft Men s Leather Bomber Jacket is available in a classic jacket format. It is crafted from premium lamb leather, offering a luxurious and timeless style.'
    },

    {
        question: "What material is the Italian Soft Men s Leather Bomber Jacket made of?",
        answer: "The Italian Soft Men's Leather Bomber Jacket is made of premium lamb leather, known for its softness and durability."
    },
]
const license = {
    href: '#',
    summary: "The Italian Soft Men's Leather Bomber Jacket is intended for personal and professional use only. It cannot be resold or redistributed in its original or modified state. This ensures that the jacket remains exclusive to the original purchaser and protects the rights of the product's creators."
    , content: `
    <p>Overview:<br>
    The Italian Soft Men's Leather Bomber Jacket is intended for personal and professional use only. It cannot be resold or redistributed in its original or modified state.</p>
    <ul role="list">
      <li>You are allowed to use the Italian Soft Men's Leather Bomber Jacket in unlimited projects.</li>
      <li>No attribution is required when using the jacket.</li>
    </ul>
    <h4>Permitted Usage</h4>
    <ul role="list">
      <li>Feel free to use the Italian Soft Men's Leather Bomber Jacket in your personal and professional work.</li>
      <li>You can customize the jacket, including changing the colors, to suit your project or brand.</li>
    </ul>
    <h4>Restrictions</h4>
    <ul role="list">
      <li>Selling or distributing the Italian Soft Men's Leather Bomber Jacket, whether in its original or modified state, is strictly prohibited.</li>
      <li>The Italian Soft Men's Leather Bomber Jacket cannot be used on websites or applications that promote illegal or immoral beliefs or activities.</li>
    </ul>
  `,
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ProductDetails() {
    const [selectedProduct, setSelectedProduct] = useState()
    const [reviewInput, setReviewInput] = useState(false)
    const [mainImage, setMainImage] = useState()
    const [starNumber, setStarNumber] = useState(0)
    const [relatedProducts, setRelatedProducts] = useState([])
    const [hoverStar, setHoverStar] = useState(undefined)
    const [loginModal, setLoginModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [registerModal, setRegisterModal] = useState(false)
    const cancelButtonRef = useRef(null)

    const [onUpdate, setOnUpdate] = useState(false)
    const textAreaRef = useRef()

    const { id } = useParams()
    const { connected_user, token } = useSelector(state => state.Auth)
    const { cart } = useSelector(state => state.Cart)
    const { wishlist } = useSelector(state => state.Wishlist)
    const { Orders } = useSelector(state => state.Order)
    const { Products } = useSelector(state => state.Product)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const fetchProductInformation = () => {
        setLoading(true)
        dispatch(GetProducts()).unwrap()
            .then(data => {
                const selectedProduct = data.data.find(product => product.id == id)
                if (selectedProduct && selectedProduct.status == 0) {
                    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                    selectedProduct.Ratings.forEach((rating) => {
                        counts[Math.floor(parseInt(rating.rating))]++;
                    });
                    const result = Object.entries(counts)
                        .map(([rating, count]) => ({
                            rating: parseInt(rating),
                            count,
                        }))
                        .filter((obj) => obj.count !== 0)

                    setSelectedProduct({ ...selectedProduct, count: result })
                } else {
                    toast.error("Product doesn't exists")
                    navigate('/404')
                }
            })
            .catch((rejectedValueOrSerializedError) => {
                toast.error(rejectedValueOrSerializedError)
                console.log("Error Occured :", rejectedValueOrSerializedError)
            })
        dispatch(GetOrders()).unwrap()
            .catch((rejectedValueOrSerializedError) => {
                toast.error(rejectedValueOrSerializedError)
                console.log("Error Occured :", rejectedValueOrSerializedError)
            })
        setTimeout(() => {
            setLoading(false)
        }, 1500);
    }
    useEffect(() => {
        fetchProductInformation()
        setMainImage()
    }, [id])

    useEffect(() => {
        if (selectedProduct) {
            const relatedProducts = Products.filter(product => (product.status == 0 && (product.category.id == selectedProduct.category.id) && (product.id != id)))
            setRelatedProducts(relatedProducts)
        }
    }, [selectedProduct])

    const handleAddToCart = (product) => {
        if (selectedProduct.quantity <= 0) {
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
    const handleUpdateReview = async (review) => {
        await setReviewInput(true)
        if (textAreaRef.current) {
            setOnUpdate(true)
            setStarNumber(parseInt(review.rating))
            textAreaRef.current.value = `${review.comment}`
            textAreaRef.current.focus()
        }
    }
    const handleEditRating = () => {
        if (starNumber == 0 || textAreaRef.current.value.trim() == "" || textAreaRef.current.value.length > 255) {
            if (starNumber == 0 && textAreaRef.current.value.trim() == "") {
                toast.error("Please choose a star number and add a comment about this product")
            } else {
                if (starNumber == 0) {
                    toast.error("Choose a star number")
                } else if (textAreaRef.current.value.trim() == "") {
                    toast.error("Add a comment about this product")
                } else {
                    toast.error("The comment should be less than 255 caracters")
                }
            }
        } else {
            const body = new FormData()
            body.append("rating", starNumber)
            body.append("comment", textAreaRef.current.value.trim())
            dispatch(rateProduct({ product_id: id, body, token }))
                .then(data => {
                    toast.success("Your feedback has been updated")
                    setOnUpdate(false)
                    setReviewInput(false)
                    fetchProductInformation()
                })
                .catch((rejectedValueOrSerializedError) => {
                    toast.error(rejectedValueOrSerializedError)
                    console.log("Error Occured :", rejectedValueOrSerializedError)
                })
        }
    }
    const handleDeleteReview = () => {
        dispatch(deleteRating({ product_id: id, token })).unwrap()
            .then(data => {
                toast.success("Your feedback has been deleted")
                fetchProductInformation()
            })
            .catch((rejectedValueOrSerializedError) => {
                toast.error(rejectedValueOrSerializedError)
                console.log("Error Occured :", rejectedValueOrSerializedError)
            })
    }
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
    const handlRating = () => {
        if (starNumber == 0 || textAreaRef.current.value.trim() == "" || textAreaRef.current.value.length > 255) {
            if (starNumber == 0 && textAreaRef.current.value.trim() == "") {
                toast.error("Please choose a star number and add a comment about this product")
            } else {
                if (starNumber == 0) {
                    toast.error("Choose a star number")
                } else if (textAreaRef.current.value.trim() == "") {
                    toast.error("Add a comment about this product")
                } else {
                    toast.error("The comment should be less than 255 caracters")
                }
            }
        } else {
            const body = new FormData()
            body.append("rating", starNumber)
            body.append("comment", textAreaRef.current.value.trim())
            dispatch(rateProduct({ product_id: id, body, token }))
                .then(data => {
                    toast.success("Thank you for providing your feedback")
                    setReviewInput(false)
                    fetchProductInformation()
                })
                .catch((rejectedValueOrSerializedError) => {
                    toast.error(rejectedValueOrSerializedError)
                    console.log("Error Occured :", rejectedValueOrSerializedError)
                })
        }
    };
    return (
        <>
            {
                loading && <Loading />
            }
            <Header />
            <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} cancelButtonRef={cancelButtonRef} setRegisterModal={setRegisterModal} />
            <RegisterModal registerModal={registerModal} cancelButtonRef={cancelButtonRef} setRegisterModal={setRegisterModal} setLoginModal={setLoginModal} />
            <main className="mx-auto pt-14 pb-24 px-4 sm:pt-16 sm:pb-32 sm:px-6 lg:max-w-7xl lg:px-8">
                {/* Product */}
                <div className="lg:grid lg:grid-rows-1 lg:grid-cols-7 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
                    {/* Product image */}
                    <div className="lg:row-end-1 lg:col-span-4">
                        <div className="aspect-w-4 flex flex-col justify-center items-center aspect-h-3 overflow-hidden ">
                            <Magnifier src={mainImage ? mainImage : selectedProduct?.images[0].image} alt={`Product-${selectedProduct?.images[0].id}`} width={396} />
                            <div className="mt-2 flex flex-wrap justify-center gap-3">
                                {
                                    selectedProduct?.images.map(image =>
                                        <img
                                            key={image.id}
                                            src={image.image}
                                            alt={`Product-${image.id}`}
                                            className="h-20 rounded-lg cursor-pointer w-h-20 object-cover object-center"
                                            onClick={e => setMainImage(image.image)}
                                        />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className="max-w-2xl mx-auto mt-14 sm:mt-16 lg:max-w-none lg:mt-0 lg:col-span-3">
                        <div className="flex flex-col-reverse">
                            <div className="mt-4">
                                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{selectedProduct?.name}</h1>
                                <h2 id="information-heading" className="sr-only">
                                    Product information
                                </h2>
                            </div>
                            <div>
                                <h3 className="sr-only">Reviews</h3>
                                <div className="flex items-center">
                                    {
                                        selectedProduct?.Ratings.length != 0 &&
                                        <Rate value={(selectedProduct?.Ratings.reduce((acc, cur) => (parseFloat(acc) + parseFloat(cur.rating)), 0) / selectedProduct?.Ratings.length)} disabled count={5} allowHalf />
                                    }
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-500 mt-6">{selectedProduct?.description}</p>
                        <p className="text-4xl text-black mt-6">${selectedProduct?.selling_price} <span className="text-gray-600 line-through">${selectedProduct?.original_price}</span> </p>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                            <button
                                type="button"
                                className="w-full bg-gradient-to-r from-red-500 to-yellow-400  border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white "
                                onClick={e => handleAddToCart({ product_id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.selling_price, image: selectedProduct.images[0] })}
                            >
                                Add to cart
                            </button>
                            <button
                                type="button"
                                className="w-full border border-yellow-400 bg-white rounded-md py-3 px-8 flex items-center justify-center text-base font-medium bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent "
                                onClick={e => handleAddToWishList(selectedProduct.id)}
                            >
                                Add to whishlist
                            </button>
                        </div>
                    </div>
                </div >
                {
                    relatedProducts.length >= 3 && <div className="max-w-2xl mx-auto mb-14 sm:mb-20 mt-3 lg:max-w-none">
                        <h2 className="text-lg font-medium text-gray-900">Related products</h2>
                        <Slider {...ProductSliderSettings} className="py-6 ">
                            {relatedProducts?.map((product, index) => (
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
                                        navigate('/product/' + product.id)
                                    }}
                                />
                            ))}
                        </Slider>
                    </div>
                }

                <div className="w-full max-w-2xl mx-auto mt-16 lg:max-w-none lg:mt-0 lg:col-span-7">
                    <Tab.Group as="div">
                        <div className="border-b border-gray-200">
                            <Tab.List className="-mb-px flex space-x-8">
                                {
                                    (selectedProduct?.Ratings.length != 0 ||
                                        Orders.find(order =>
                                            order.email === connected_user?.email &&
                                            order.order_items.some(orderedItem => orderedItem.product_id == id)
                                        ) != null) &&
                                    <Tab
                                        className={({ selected = true }) =>
                                            classNames(
                                                selected
                                                    ? 'bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent border-b-2 border-yellow-400'
                                                    : 'text-gray-700 hover:text-gray-800 hover:border-gray-300 hover:border-b-2',
                                                'whitespace-nowrap py-6 font-medium text-sm'
                                            )
                                        }
                                    >
                                        Customer Reviews
                                    </Tab>
                                }
                                <Tab
                                    className={({ selected }) =>
                                        classNames(
                                            selected
                                                ? 'bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent border-b-2 border-yellow-400'
                                                : 'text-gray-700 hover:text-gray-800 hover:border-gray-300 hover:border-b-2',
                                            'whitespace-nowrap py-6 font-medium text-sm'
                                        )
                                    }
                                >
                                    FAQ
                                </Tab>
                                <Tab
                                    className={({ selected }) =>
                                        classNames(
                                            selected
                                                ? 'bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent border-b-2 border-yellow-400'
                                                : 'text-gray-700 hover:text-gray-800 hover:border-gray-300 hover:border-b-2',
                                            'whitespace-nowrap py-6 font-medium text-sm'
                                        )
                                    }
                                >
                                    License
                                </Tab>
                            </Tab.List>
                        </div>
                        <Tab.Panels as={Fragment}>
                            {
                                (selectedProduct?.Ratings.length != 0 ||
                                    Orders.find(order =>
                                        order.email === connected_user?.email &&
                                        order.order_items.some(orderedItem => orderedItem.product_id == id)
                                    ) != null) &&
                                <Tab.Panel className="-mb-10">
                                    <h3 className="sr-only">Customer Reviews</h3>
                                    <div>
                                        <div className="max-w-2xl mx-auto pt-5 pb-16 px-4 sm:pb-24 sm:px-6 lg:max-w-7xl lg:pb-32 lg:px-8 lg:grid lg:grid-cols-12 lg:gap-x-8">
                                            <div className="lg:col-span-4">

                                                <div className="mt-3 flex items-center">
                                                    <div>
                                                        <div className="flex items-center">
                                                            <Rate value={(selectedProduct?.Ratings.reduce((acc, cur) => (parseFloat(acc) + parseFloat(cur.rating)), 0) / selectedProduct?.Ratings.length)} disabled count={5} allowHalf />
                                                        </div>
                                                    </div>
                                                    <p className="ml-2 mt-[calc(0.35rem)] text-sm text-gray-900">Based on {selectedProduct?.Ratings.length} reviews</p>
                                                </div>

                                                <div className="mt-6">
                                                    <h3 className="sr-only">Review data</h3>
                                                    <dl className="space-y-3">
                                                        {selectedProduct?.count.map((rating, index) => (
                                                            <div key={rating.id} className="flex items-center text-sm">
                                                                <dt className="flex-1 flex items-center">
                                                                    <p className="w-3 font-medium text-gray-900">
                                                                        {parseInt(rating.rating)}
                                                                        <span className="sr-only"> star reviews</span>
                                                                    </p>
                                                                    <div aria-hidden="true" className="ml-1 flex-1 flex items-center">
                                                                        <AiFillStar
                                                                            className={classNames(
                                                                                parseInt(rating.rating) > 0 ? 'text-yellow-400' : 'text-gray-300',
                                                                                'flex-shrink-0 h-5 w-5'
                                                                            )}
                                                                            aria-hidden="true"
                                                                        />

                                                                        <div className="ml-3 relative flex-1">
                                                                            <div className="h-3 bg-gray-100 border border-gray-200 rounded-full" />
                                                                            {parseInt(rating.rating) > 0 ? (
                                                                                <div
                                                                                    className="absolute inset-y-0 bg-yellow-400 border border-yellow-400 rounded-full"
                                                                                    style={{ width: `calc(${selectedProduct?.count.find(selectedProductCount => parseInt(rating.rating) == selectedProductCount.rating).count} / ${selectedProduct?.count.reduce((acc, cur) => acc + cur.count, 0)} * 100%)` }}
                                                                                />
                                                                            ) : null}
                                                                        </div>
                                                                    </div>
                                                                </dt>
                                                                <dd className="ml-3 w-10 text-right tabular-nums text-sm text-gray-900">
                                                                    {Math.round((selectedProduct?.count.find(selectedProductCount => parseInt(rating.rating) == selectedProductCount.rating).count / selectedProduct?.count.reduce((acc, cur) => acc + cur.count, 0)) * 100)}%
                                                                </dd>
                                                            </div>
                                                        ))}
                                                    </dl>
                                                </div>
                                                <div className="mt-10">
                                                    {
                                                        connected_user &&
                                                        <>
                                                            <div className="flex justify-around flex-col">
                                                                {
                                                                    (Orders.find(order => order.email === connected_user?.email &&
                                                                        order.order_items.some(orderedItem => orderedItem.product_id == id)) &&
                                                                        selectedProduct?.Ratings.findIndex(rating => rating.user.id == connected_user?.id) == -1) &&
                                                                    <>
                                                                        <h3 className="text-lg font-medium text-gray-900">Share your thoughts</h3>
                                                                        <p className="mt-1 text-sm text-gray-600">
                                                                            If you've used this product, share your thoughts with other customers
                                                                        </p>
                                                                        <button
                                                                            className="mt-6 inline-flex w-full bg-white border border-gray-300 rounded-md py-2 px-8 items-center justify-center text-sm font-medium text-gray-900 hover:bg-gray-50 sm:w-auto lg:w-full"
                                                                            onClick={e => setReviewInput(true)}
                                                                        >
                                                                            Write a review
                                                                        </button>
                                                                    </>
                                                                }

                                                                {
                                                                    selectedProduct?.Ratings.find(rating => rating.user.id == connected_user.id) &&
                                                                    <>
                                                                        <button
                                                                            className="mt-6 inline-flex w-full bg-green-500 border border-gray-300 rounded-md py-2 px-8 items-center justify-center text-sm font-medium text-white  sm:w-auto lg:w-full"
                                                                            onClick={e => {
                                                                                handleUpdateReview(selectedProduct?.Ratings.find(rating => rating.user.id == connected_user.id))
                                                                            }}
                                                                        >
                                                                            Update my review
                                                                        </button>
                                                                        <button
                                                                            className="mt-6 inline-flex w-full bg-red-500 border border-gray-300 rounded-md py-2 px-8 items-center justify-center text-sm font-medium text-white  sm:w-auto lg:w-full"
                                                                            onClick={e => handleDeleteReview()}
                                                                        >
                                                                            Delete my review
                                                                        </button>
                                                                    </>
                                                                }
                                                            </div>

                                                        </>
                                                    }
                                                </div>

                                            </div>
                                            <div className="mt-16 lg:mt-0 lg:col-start-6 lg:col-span-7">
                                                <h3 className="sr-only">Recent reviews</h3>

                                                <div className="flow-root">
                                                    <div className="-my-12 divide-y divide-gray-200">
                                                        {reviewInput &&
                                                            <div className="pt-12 pb-2 w-full flex flex-col gap-3">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex">
                                                                        <div className="user-image bg-indigo-500 w-8 h-8 flex justify-center items-center rounded-full">
                                                                            <span className="initial select-none text-white font-medium">{connected_user.full_name?.charAt(0)}</span>
                                                                        </div>
                                                                        <div className="ml-4">
                                                                            <h4 className="text-sm font-bold text-gray-900">{connected_user.full_name}</h4>
                                                                            <div className="flex gap-2">
                                                                                {Array(5).fill().map((_, index) =>
                                                                                    starNumber >= index + 1 || hoverStar >= index + 1 ?
                                                                                        <AiFillStar
                                                                                            key={index}
                                                                                            className='w-5 h-5 cursor-pointer text-yellow-400'
                                                                                            onMouseOver={() => !starNumber && setHoverStar(index + 1)}
                                                                                            onMouseLeave={() => setHoverStar(undefined)}
                                                                                            onClick={() => setStarNumber(index + 1)} />
                                                                                        :
                                                                                        <AiOutlineStar
                                                                                            key={index}
                                                                                            className='w-5 h-5 cursor-pointer text-yellow-400'
                                                                                            onMouseOver={() => !starNumber && setHoverStar(index + 1)}
                                                                                            onMouseLeave={() => setHoverStar(undefined)}
                                                                                            onClick={() => setStarNumber(index + 1)} />
                                                                                )}
                                                                            </div>
                                                                            <p className="sr-only">3 out of 5 stars</p>
                                                                        </div>
                                                                    </div>
                                                                    <XMarkIcon onClick={e => setReviewInput(false)} className='w-10 h-10 rounded-xl p-2 text-black cursor-pointer bg-gray-50' />
                                                                </div>
                                                                <textarea ref={textAreaRef} name="comment" className='border w-full rounded-lg mt-2 py-2 px-4 min-h-[calc(81px)] outline-none transition duration-300 ease-in-out focus:placeholder:opacity-0 ' placeholder='How was the product ?'></textarea>

                                                                {onUpdate ? <button onClick={e => handleEditRating()} className='px-4 py-2 border rounded-lg hover:bg-gray-50 w-20 self-end'>Update</button> :
                                                                    <button onClick={e => handlRating()} className='px-4 py-2 border rounded-lg hover:bg-gray-50 w-20 self-end'>Rate</button>}
                                                            </div>
                                                        }
                                                        {selectedProduct?.Ratings.map((review) => (
                                                            <div key={review.id} className="py-12">
                                                                <div className="flex items-center">
                                                                    <div className="user-image bg-indigo-500 w-8 h-8 flex justify-center items-center rounded-full">
                                                                        <span className="initial select-none text-white font-medium">{review.user.full_name?.charAt(0)}</span>
                                                                    </div>
                                                                    <div className="ml-4">
                                                                        <h4 className="text-sm font-bold text-gray-900">{review.user.full_name}</h4>
                                                                        <div className="mt-1 flex items-center">
                                                                            {[0, 1, 2, 3, 4].map((rating) => (
                                                                                <AiFillStar
                                                                                    key={rating}
                                                                                    className={classNames(
                                                                                        parseInt(review.rating) > rating ? 'text-yellow-400' : 'text-gray-300',
                                                                                        'h-5 w-5 flex-shrink-0'
                                                                                    )}
                                                                                    aria-hidden="true"
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                        <p className="sr-only">{parseInt(review.rating)} out of 5 stars</p>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="mt-4 space-y-6 text-base italic text-gray-600">
                                                                    {review.comment}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Tab.Panel>
                            }


                            <Tab.Panel as="dl" className="text-sm text-gray-500">
                                <h3 className="sr-only">Frequently Asked Questions</h3>

                                {faqs.map((faq) => (
                                    <Fragment key={faq.question}>
                                        <dt className="mt-10 font-medium text-gray-900">{faq.question}</dt>
                                        <dd className="mt-2 prose prose-sm max-w-none text-gray-500">
                                            <p>{faq.answer}</p>
                                        </dd>
                                    </Fragment>
                                ))}
                            </Tab.Panel>

                            <Tab.Panel className="pt-10">
                                <h3 className="sr-only">License</h3>

                                <div
                                    className="prose prose-sm max-w-none text-gray-500"
                                    dangerouslySetInnerHTML={{ __html: license.content }}
                                />
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </main >
        </ >
    )
}
