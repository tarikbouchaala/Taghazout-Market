import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon } from '@heroicons/react/20/solid'
import ProductCard from '../Components/ProductCard'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { GetProducts, setSortOption } from '../Redux/Slices/ProductSlice'
import { toast } from 'react-toastify';
import { GetCategories } from '../Redux/Slices/CategorySlice'
import Pagination from '../Components/Pagination'
import { Scrollbars } from 'react-custom-scrollbars';
import ReactSliderInput from 'react-slider'
import Header from "../Components/Header";
import Loading from '../Components/Loading'

const breadcrumbs = [
  { name: 'Home', to: '/' },
  { name: 'Store', to: '/store' },
]
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export default function Store() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [categoriesFormFilter, setCategoriesFormFilter] = useState([])
  const [sortedProducts, setSortedProducts] = useState([]);
  const [minProductsPrice, setMinProductsPrice] = useState(0)
  const [maxProductsPrice, setMaxProductsPrice] = useState(0)
  const [priceValues, setPriceValues] = useState([0, 0])
  const [currentPage, setCurrentPage] = useState(1)
  const { sortOptions } = useSelector(state => state.Product)

  const indexOfLastProduct = currentPage * 6
  const indexOfFirstProduct = indexOfLastProduct - 6

  const productsNumber = categoriesFormFilter.length == 0 ?
    sortedProducts.length :
    sortedProducts.filter(product => categoriesFormFilter.findIndex(category => category == product.category_id) != -1).length

  const currentProducts = categoriesFormFilter.length == 0 ?
    sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct) :
    sortedProducts.filter(product => categoriesFormFilter.findIndex(category => category == product.category_id) != -1).slice(indexOfFirstProduct, indexOfLastProduct)

  const categoriesForm = useRef()
  const categoriesFormMobile = useRef()

  const { Products: products } = useSelector(state => state.Product)
  const { Categories: categories } = useSelector(state => state.Category)
  const { cart } = useSelector(state => state.Cart)
  const { wishlist } = useSelector(state => state.Wishlist)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSort = (optionName) => {
    const newSortOption = sortOptions.map(option => option.name == optionName ? { name: option.name, current: true } : { name: option.name, current: false })
    dispatch(setSortOption(newSortOption))
  }
  const paginate = (number) => setCurrentPage(number)

  function sortProducts(allProducts, sortOption) {
    let shownProducts = allProducts.filter(p => p.status == 0)
    const sortedProducts = [...shownProducts];

    if (sortOption === 'Most Popular') {
      sortedProducts.sort((a, b) => {
        if (a.trending === b.trending) {
          return a.name.localeCompare(b.name);
        }
        return b.trending - a.trending;
      });
    } else if (sortOption === 'Newest') {
      sortedProducts.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        if (dateA.getTime() === dateB.getTime()) {
          return a.name.localeCompare(b.name);
        }
        return dateB - dateA;
      });
    } else if (sortOption === 'Price: Low to High') {
      sortedProducts.sort((a, b) => {
        if (a.selling_price === b.selling_price) {
          return a.name.localeCompare(b.name);
        }
        return a.selling_price - b.selling_price;
      });
    } else if (sortOption === 'Price: High to Low') {
      sortedProducts.sort((a, b) => {
        if (a.selling_price === b.selling_price) {
          return a.name.localeCompare(b.name);
        }
        return b.selling_price - a.selling_price;
      });
    }
    setSortedProducts(sortedProducts)
  }
  useEffect(() => {
    dispatch(GetProducts()).unwrap().then(data => {
      const sortOptionName = sortOptions.find(option => option.current).name
      sortProducts(data.data, sortOptionName)
    })
      .catch((rejectedValueOrSerializedError) => {
        toast.error(rejectedValueOrSerializedError)
        console.log("Error Occured :", rejectedValueOrSerializedError)
      })
    dispatch(GetCategories()).unwrap()
      .catch((rejectedValueOrSerializedError) => {
        toast.error(rejectedValueOrSerializedError)
        console.log("Error Occured :", rejectedValueOrSerializedError)
      })
    setTimeout(() => {
      setLoading(false)
    }, 1000);
  }, [])

  useEffect(() => {
    setMaxProductsPrice(Math.max(...sortedProducts.map(product => product.selling_price)))
    setMinProductsPrice(Math.min(...sortedProducts.map(product => product.selling_price)))
  }, [currentProducts])

  useEffect(() => {
    setPriceValues([minProductsPrice, maxProductsPrice])
  }, [minProductsPrice, maxProductsPrice])

  useEffect(() => {
    if (products.length != 0) {
      sortProducts(products, sortOptions.find(option => option.current).name)
    }
  }, [sortOptions])

  return (
    <>
      {
        loading && <Loading />
      }
      <Header />
      <>
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <div className="mt-4 border-t border-gray-200" >
                    <h3 className="sr-only ">Categories</h3>
                    <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900 mb-4">Categories</span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
                                ) : (
                                  <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="max-h-40">
                            <div className="space-y-4 ">
                              <Scrollbars style={{ width: "100%", height: 190 }} >
                                <form className="space-y-6 w-32 mb-4 -mr-4" ref={categoriesFormMobile}>
                                  {categories.map(category =>
                                    <div key={category.id} className="flex items-center">
                                      <input
                                        id={`filter-mobile-categories-${category.id}`}
                                        name={`categories[]`}
                                        defaultValue={category.id}
                                        type="checkbox"
                                        onChange={e => {
                                          const formData = new FormData(categoriesFormMobile.current);
                                          const selectedCategories = Array.from(formData.getAll("categories[]"));
                                          setCategoriesFormFilter(selectedCategories);
                                        }}
                                        checked={categoriesFormFilter.findIndex(category_id => category_id == category.id) != -1 ? true : false}
                                        className="h-4 w-4 rounded border-gray-300"
                                      />
                                      <label
                                        htmlFor={`filter-mobile-categories-${category.id}`}
                                        className="ml-3 min-w-0 cursor-pointer flex-1 text-gray-500"
                                      >
                                        {category.name}
                                      </label>
                                    </div>
                                  )}
                                </form>
                              </Scrollbars>
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              <nav aria-label="Breadcrumb">
                <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 pr-4 sm:pr-6 lg:max-w-7xl lg:pr-8">
                  {breadcrumbs.map((breadcrumb, index) => (
                    <li key={index}>
                      <div className="flex items-center">
                        {
                          breadcrumbs.length - 1 != index ?
                            <>
                              <NavLink to={breadcrumb.to} className="mr-2 text-sm font-medium text-gray-900">
                                {breadcrumb.name}
                              </NavLink>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                              </svg>
                            </>
                            :
                            <NavLink to={breadcrumb.to} className="mr-2 text-sm font-medium cursor-default select-none  text-gray-500 hover:text-gray-600">
                              {breadcrumb.name}
                            </NavLink>
                        }
                      </div>
                    </li>
                  ))}
                </ol>
              </nav>
            </h1>
            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
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
                  <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-30">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <div
                              className={classNames(
                                option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                active ? 'bg-gray-100 cursor-pointer' : '',
                                'block px-4 py-2 text-sm'
                              )}
                              onClick={e => handleSort(option.name)}
                            >
                              {option.name}
                            </div>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
          {
            sortedProducts.length !== 0 ?
              <section aria-labelledby="products-heading" className="pb-24 pt-6">
                <h2 id="products-heading" className="sr-only">
                  Products
                </h2>
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                  {/* Filters */}
                  <h3 className="sr-only">Categories</h3>
                  <Disclosure as="div" className="border-gray-200 py-6 hidden lg:block" defaultOpen>
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white pr-2 py-3 text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900 mb-4">Categories</span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
                              ) : (
                                <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="max-h-48">
                          <div className="space-y-4 ">
                            <Scrollbars style={{ width: "100%", height: 190 }}>
                              <form className="space-y-6 w-64" ref={categoriesForm}>
                                {categories.map(category =>
                                  <div key={category.id} className="flex items-center">
                                    <input
                                      id={`filter-categories-${category.id}`}
                                      name={`categories[]`}
                                      defaultValue={category.id}
                                      type="checkbox"
                                      onChange={e => {
                                        const formData = new FormData(categoriesForm.current);
                                        const selectedCategories = Array.from(formData.getAll("categories[]"));
                                        setCategoriesFormFilter(selectedCategories);
                                      }}
                                      checked={categoriesFormFilter.findIndex(category_id => category_id == category.id) != -1 ? true : false}
                                      className="h-4 w-4 rounded border-gray-300 "
                                    />
                                    <label
                                      htmlFor={`filter-categories-${category.id}`}
                                      className="ml-3 min-w-0 cursor-pointer flex-1 text-gray-500"
                                    >
                                      {category.name}
                                    </label>
                                  </div>
                                )}
                              </form>
                            </Scrollbars>
                          </div>
                        </Disclosure.Panel>
                        <h3 className="-my-3 flow-root">
                          <div className="flex flex-col text-left w-full items-left bg-white pr-2 py-3 text-gray-400 hover:text-gray-500">
                            <span className="font-medium mb-2 mt-4 w-full text-gray-900">Price</span>
                            <div className="w-full flex items-end h-10 justify-between">
                              {priceValues[0]}
                              <ReactSliderInput
                                value={priceValues}
                                min={minProductsPrice}
                                max={maxProductsPrice}
                                onChange={setPriceValues}
                                className={"slider"}
                                withBars
                                pearling
                                minDistance={5}
                              />
                              {priceValues[1]}
                            </div>
                          </div>
                        </h3>
                      </>
                    )}
                  </Disclosure>

                  {/* Product grid */}
                  <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8">
                      {
                        currentProducts
                          .filter(product => product.selling_price >= priceValues[0] && product.selling_price <= priceValues[1])
                          .map((product) =>
                            <ProductCard
                              key={product.id}
                              id={product.id}
                              name={product.name}
                              quantity={product.quantity}
                              price={product.selling_price}
                              oldPrice={product.original_price}
                              images={product.images}
                              inCart={cart.findIndex(productInCart => productInCart.product_id == product.id) != -1}
                              inWishlist={!wishlist ? false : wishlist.findIndex(productInWishlist => productInWishlist.product_id === product.id) !== -1} onClick={e => navigate('/product/' + product.id)}
                            />)
                      }
                    </div>
                    <Pagination currentPage={currentPage} productsPerPage={6} indexOfLastProduct={indexOfLastProduct} productsNumber={productsNumber} totalProducts={productsNumber} paginate={paginate} indexOfFirstProduct={indexOfFirstProduct} />
                  </div>
                </div>
              </section>
              :
              <div className="flex justify-center items-center h-[calc(100vh-12em)]">
                <h2 className="text-center text-6xl font-header">No Products For Now</h2>
              </div>
          }
        </main >
      </ >
    </>

  )
}
