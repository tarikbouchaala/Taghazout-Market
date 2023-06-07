import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DeleteCoupon, GetCoupons } from "../../../Redux/Slices/CouponSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../Sidebar";
import { NavLink } from "react-router-dom";

function CouponTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [DeletedCoupon, setDeletedCoupon] = useState({});

  const dispatch = useDispatch();
  const { Coupons } = useSelector((state) => state.Coupon);



  const HandelDeleteCoupon = () => {
    dispatch(DeleteCoupon(DeletedCoupon))
      .unwrap()
      .then((result) => {
        toast.success("Coupon deleted  successfully!");
        setIsOpen(false)
      })
      .catch((reject) => {
        console.log('regicted', reject)
        toast.error(reject);
        setIsOpen(false)
      })
  };

  const handelOpen = (Category) => {
    setIsOpen(true);
    setDeletedCoupon(Category)
  }



  useEffect(() => {
    dispatch(GetCoupons());
  }, [dispatch]);
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full	px-5 mx-auto mt-14 ">
        <div className="flex justify-between bg-gray-100 p-4">
          <div className="">
            <h2 className="text-2xl font-bold text-gray-800">All Coupons</h2>
            <p className="text-gray-600 mt-1">
              {" "}
              Discover our latest coupon offers
            </p>
          </div>
          <div className="flex items-center">
            <NavLink to={"/dashboard/admin/coupon/add"}>
              <button className="px-6 py-2 text-lg font-medium text-white bg-gradient-to-r from-red-500 to-yellow-400  disabled:opacity-50">
                Add Coupon
              </button>
            </NavLink>
          </div>
        </div>

        <section className="container px-10 mx-auto">


          <div className="flex flex-col mt-6">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block w-auto py-2 min-w-full align-middle ">
                <div className="overflow-hidden  w-full border border-gray-200 dark:border-gray-700 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 px-10 text-sm gap-x-2  font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          <div className="flex items-center gap-x-1">
                            <span>Code</span>
                          </div>
                        </th>

                        <th
                          scope="col"
                          className="px-10 py-3.5 gap-x-2  text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-200"
                        >
                          <span>Type</span>
                        </th>

                        <th
                          scope="col"
                          className="px-10 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-200"
                        >
                          Value
                        </th>
                        <th
                          scope="col"
                          className="px-10 py-3.5  text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-200"
                        >
                          Cart value
                        </th>

                        <th
                          scope="col"
                          className="px-5 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                      {Coupons &&
                        Coupons.map((coupon) => (
                          <tr key={coupon.id}>
                            <td className="px-5 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                              <div className="flex items-center gap-x-2">
                                <h2 className="font-medium text-gray-800 dark:text-white ">
                                  {coupon.code}
                                </h2>
                              </div>
                            </td>

                            <td className="px-10 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                              <div class="inline px-3 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                                {coupon.type}
                              </div>
                            </td>
                            <td className="px-10 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                              {coupon.value}
                            </td>
                            <td className="px-10 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                              {coupon.cart_value}
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex">
                                <button
                                  // href="/update"
                                  className="font-medium text-emerald-500 hover:underline"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                    />
                                  </svg>
                                </button>
                                <button
                                  // href="/delete"
                                  onClick={() => { handelOpen(coupon) }}
                                  // onClick={(e) => HandelDeleteCoupon(category)}
                                  className="ml-2 font-medium text-red-600 dark:text-red-500 hover:underline"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {isOpen && (
          <div className="fixed inset-0 z-50  overflow-y-auto">
            <div className="fixed inset-0 bg-slate-900/25 backdrop-blur transition-opacity opacity-100"></div>
            <div className="flex items-center justify-center  min-h-screen p-4">
              <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                <button
                  type="button"
                  className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <svg
                  className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <p className="mb-4 text-gray-500 dark:text-gray-300">
                  Are you sure you want to delete this item?
                </p>
                <div className="flex justify-center items-center space-x-4">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    type="button"
                    className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  >
                    No, cancel
                  </button>
                  <button
                    onClick={HandelDeleteCoupon}
                    type="submit"
                    className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                  >
                    Yes, I'm sure
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

  );
}
export default CouponTable;
