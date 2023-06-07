import React, { useState, useEffect } from "react";
import CLientSideBar from "./CLientSideBar";
import { GetOrders } from "../Redux/Slices/AdminOrderSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { CheckCircleIcon } from "@heroicons/react/solid";
import moment from "moment";
import { addToCart } from "../Redux/Slices/CartSlice";
import { toast } from "react-toastify";

export default function ClientOrderDetial() {
  // const [Subtotal, setSubtotal] = useState(0);
  const [Total, setTotal] = useState(0);
  const [Order, setOrder] = useState({});
  const dispatch = useDispatch();
  const { Orders } = useSelector((state) => state.Order);
  const { connected_user } = useSelector((state) => state.Auth);
  const { id } = useParams();

  useEffect(() => {
    if (Orders && connected_user) {
      const Order = Orders.find(
        (order) => order?.user_id == connected_user.id && order?.id == id
      );
      if (Order) {
        setOrder(Order);
        const calculatedSubtotal = Order.order_items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        if(Order.coupon_discount){
          setTotal(calculatedSubtotal-Order.coupon_discount);
        }else{
          setTotal(calculatedSubtotal);
        }
        // setSubtotal(calculatedSubtotal);
      } else {
        // redirect him back
      }
    }
  }, [Orders, connected_user, id]);

  useEffect(() => {
    if (Orders.length == 0) {
      dispatch(GetOrders());
    }
  }, [dispatch, Orders]);
  console.log("order state", Order);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    toast.success("Product added to cart");
  };
  return (
    <div>
      <div className="flex">
        <CLientSideBar />

        <div className="bg-white flex-1">
          <div className="">
            <div className="max-w-7xl mx-auto sm:px-2 lg:px-8">
              {/* <div className="max-w-2xl mx-auto px-4 lg:max-w-4xl lg:px-0">
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  Order history
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  Check the status of recent orders, manage returns, and
                  discover similar products.
                </p>
              </div> */}
            </div>

            <div className="mt-16 ">
              <h2 className="sr-only">Recent orders</h2>
              <div className="max-w-7xl mx-auto sm:px-2 lg:px-8 ">
                <div className="max-w-2xl mx-auto space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">



                <div className="max-w-xl">
            <h1 className="text-sm font-semibold uppercase tracking-wide text-transparent bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text">Thank you!</h1>
            <p className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {Order?.status_message=="cancelled" ?
              (<p className="text-red-300"> Order Canceled</p>):(

                "It's on the way!"
              )  
            }
              </p>
            <p className="mt-2 text-base text-gray-500">
            {
            Order?.status_message=="in-progress"? `Your order #${Order?.id} is currently in progress and will be shipped soon.`:
            Order?.status_message=="shipped"? `Your order #${Order?.id} has been shipped and will be delivered soon. Thank you for your purchase!`:
            Order?.status_message=="in-route"? `Your order #${Order?.id} is in transit and on its way to you. We appreciate your business!`:
            Order?.status_message=="delivered"? `Your order #${Order?.id} has been delivered. We hope you enjoy your purchase! Thank you for shopping with us!`:
            Order?.status_message=="cancelled"? `Unfortunately, your order #${Order?.id} has been cancelled. If you have any questions, please contact our customer support.`:''
            }
             </p>
  
            <dl className="mt-12 text-sm font-medium">
              <dt className="text-gray-900">Tracking number</dt>
              <dd className="text-transparent bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text mt-2">{Order?.tracking_no}</dd>
            </dl>
          </div>
                {/* <dl className="mt-12 text-sm font-medium">
              <dt className="text-gray-900">Tracking number</dt>
              <dd className="text-transparent bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text mt-2">{Order?.tracking_no}</dd>
            </dl> */}
                  <div className="bg-white border-t border-b border-gray-200 shadow-sm sm:rounded-lg sm:border">
                    <h3 className="sr-only">
                      Order placed on
                      {moment(Order?.created_at).format(
                        "Do MMMM YYYY [at] h:mm A"
                      )}
                    </h3>

                    <div className="flex items-center p-4 border-b border-gray-200 sm:p-6 sm:grid sm:grid-cols-4 sm:gap-x-6">
                      <dl className="flex-1 grid grid-cols-2 gap-x-6 text-sm sm:col-span-3 sm:grid-cols-3 lg:col-span-2">
                        <div className="hidden sm:block">
                          <dt className="font-medium text-gray-900">
                            Date placed
                          </dt>
                          <dd className="mt-1 text-gray-500">
                            {moment
                              .utc(Order?.created_at)
                              .format("MMM D, YYYY")}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium text-gray-900">
                            Total amount
                          </dt>
                          <dd className="mt-1 font-medium text-gray-900">
                            ${(Total-(Order?.coupon_discount)).toFixed(2)}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium text-gray-900">
                            Discount
                          </dt>
                          <dd className="mt-1 font-medium text-gray-900">
                            ${Order?.coupon_discount}
                          </dd>
                        </div>
                      </dl>

                      <Menu
                        as="div"
                        className="relative flex justify-end lg:hidden"
                      >
                        <div className="flex items-center">
                          <Menu.Button className="-m-2 p-2 flex items-center text-gray-400 hover:text-gray-500">
                            <span className="sr-only">
                              Options for order 99999
                              {/* {Order?.number} */}
                            </span>
                            {/* <DotsVerticalIcon className="w-6 h-6" aria-hidden="true" /> */}
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
                          <Menu.Items className="origin-bottom-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href={Order?.href}
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-2 text-sm"
                                    )}
                                  >
                                    View
                                  </a>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href={Order?.invoiceHref}
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-2 text-sm"
                                    )}
                                  >
                                    Invoice
                                  </a>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>

                      <div className="hidden lg:col-span-2 lg:flex lg:items-center lg:justify-end lg:space-x-4">
                        <a
                          href={"/"}
                          // href={Order?.href}
                          className="flex items-center justify-center bg-white py-2 px-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <span>Download invoice</span>
                          <span className="sr-only">
                            {/* {Order?.number} */} 999
                          </span>
                        </a>
                        <a
                          // href={Order?.invoiceHref}
                          href={"/"}
                          className="flex items-center justify-center bg-white py-2 px-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <span>View Invoice</span>
                          <span className="sr-only">
                            for order
                            {/* {Order?.number} */} 999
                          </span>
                        </a>
                      </div>
                    </div>

                    {/* Products */}
                    <h4 className="sr-only">Items</h4>
                    <ul className="divide-y divide-gray-200">
                      {Order.order_items?.map((item) => (
                        <li key={item.product.id} className="p-4 sm:p-6">
                          <div className="flex items-center sm:items-start">
                            <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden sm:w-40 sm:h-40">
                              <img
                                src={item.product.images[0].image}
                                alt={item.product.name}
                                className="w-full h-full object-center object-cover"
                              />
                            </div>
                            <div className="flex-1 ml-6 text-sm">
                              <div className="font-medium text-gray-900 sm:flex sm:justify-between">
                                <h5>{item.product.name}</h5>
                                <p className="mt-2 sm:mt-0">
                                  $ {item.product.selling_price}
                                </p>
                              </div>
                              <p className="hidden text-gray-500 sm:block sm:mt-2">
                                {item.product.description}
                              </p>
                            </div>
                          </div>

                          <div className="mt-6 sm:flex sm:justify-between">
                            <div className="flex items-center">
                              {/* <CheckCircleIcon className="w-5 h-5 text-green-500" aria-hidden="true" /> */}
                              <p className="ml-2 text-sm font-medium text-gray-500">
                                Delivered on{" "}
                                {moment(Order?.created_at).format(
                                  "Do MMMM YYYY [at] h:mm A"
                                )}
                              </p>
                            </div>

                            <div className="mt-6 border-t border-gray-200 pt-4 flex items-center space-x-4 divide-x divide-gray-200 text-sm font-medium sm:mt-0 sm:ml-4 sm:border-none sm:pt-0">
                              <div className="flex-1 flex justify-center">
                                <Link
                                  href={"/"}
                                  to={"/product/" + item.product.id}
                                  className="text-transparent bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text whitespace-nowrap"
                                >
                                  View product
                                </Link>
                              </div>
                              <div className="flex-1 pl-4 flex justify-center">
                                <button
                                  onClick={(e) => handleAddToCart(item.product)}
                                  className="text-transparent bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text whitespace-nowrap"
                                >
                                  Buy again
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
