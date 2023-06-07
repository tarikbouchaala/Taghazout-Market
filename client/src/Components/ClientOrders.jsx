import React, { useState, useEffect } from "react";
import CLientSideBar from "./CLientSideBar";
import Header from "./Header";
import { GetOrders } from "../Redux/Slices/AdminOrderSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function ClientOrders() {
  const [ClientOrders, setClientOrders] = useState([]);
  const dispatch = useDispatch();
  const { Orders } = useSelector((state) => state.Order);
  const { connected_user } = useSelector((state) => state.Auth);

  useEffect(() => {
    if (Orders) {
      const ClientOrders = Orders.filter(
        (order) => order.user_id == connected_user.id
      );
      setClientOrders(ClientOrders);
      console.log("client order", ClientOrders);
    }
  }, [Orders, connected_user]);

  useEffect(() => {
    if (Orders.length == 0) {
      dispatch(GetOrders());
    }
  }, [dispatch, Orders]);
  return (
    <div className="flex">
      <CLientSideBar />

      <div className="w-full	px-5 mx-auto mt-16">
        <div className="max-w-2xl px-4 mb-12">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Order history
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Check the status of recent orders, manage returns, and discover
            similar products.
          </p>
        </div>
        <section className=" px-4 mx-auto">
          {ClientOrders?.length > 0 ? (
            <div className="flex flex-col mt-6">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 ">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 px-4 text-sm font-semibold text-left rtl:text-right text-gray-900 dark:text-gray-400"
                          >
                            <div className="flex items-center gap-x-3">
                              <span>NAME</span>
                            </div>
                          </th>

                          <th
                            scope="col"
                            className="px-4 py-3.5 text-sm font-semibold text-left rtl:text-right text-gray-900 dark:text-gray-400"
                          >
                            <span>PHONE</span>
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-sm font-semibold text-left rtl:text-right text-gray-900 dark:text-gray-400"
                          >
                            EMAIL
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-sm font-semibold text-left rtl:text-right text-gray-900 dark:text-gray-400"
                          >
                            ADRESS
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-sm font-semibold text-left rtl:text-right text-gray-900 dark:text-gray-400"
                          >
                            PAIMENT MODE
                          </th>

                          <th
                            scope="col"
                            className="px-10 py-3.5 text-sm font-semibold text-left rtl:text-right text-gray-900 dark:text-gray-400"
                          >
                            STATUS
                          </th>

                          <th
                            scope="col"
                            className="px-4 py-3.5 text-sm font-semibold text-left rtl:text-right text-gray-900 dark:text-gray-400"
                          ></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                        {ClientOrders &&
                          ClientOrders.map((order) => (
                            <tr key={order.id}>
                              <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                <div className="inline-flex items-center gap-x-3">
                                  <div className="flex items-center gap-x-2">
                                    <div>
                                      <h2 className="font-medium text-gray-800 dark:text-white ">
                                        {order.full_name}
                                      </h2>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="px-4 py-4 text-sm  text-gray-900 dark:text-gray-300 whitespace-nowrap">
                                {order.phone}
                              </td>
                              <td className="px-4 py-4 text-sm  text-gray-900 dark:text-gray-300 whitespace-nowrap">
                                {order.email}
                              </td>
                              <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">
                                {order.address}
                              </td>
                              <td className="px-4 py-4 text-sm  text-gray-900 dark:text-gray-300 whitespace-nowrap ">
                                {order.payment_mode}
                              </td>

                              <td className="px-4 py-4 text-sm  text-gray-700 whitespace-nowrap">
                                {order.status_message === "delivered" ? (
                                  <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 text-emerald-500 bg-emerald-100/60 dark:bg-gray-800">
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M10 3L4.5 8.5L2 6"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>

                                    <h2 className="text-sm ">delivered</h2>
                                  </div>
                                ) : order.status_message === "shipped" ? (
                                  <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 text-emerald-500 bg-emerald-100/60 dark:bg-gray-800">
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M10 3L4.5 8.5L2 6"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>

                                    <h2 className="text-sm ">Shipped</h2>
                                  </div>
                                ) : order.status_message === "in-route" ? (
                                  <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 text-emerald-500 bg-emerald-100/60 dark:bg-gray-800">
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M10 3L4.5 8.5L2 6"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>

                                    <h2 className="text-sm ">in Route</h2>
                                  </div>
                                ) : order.status_message === "in-progress" ? (
                                  <div className="inline-flex items-center px-3 py-1 text-gray-900 rounded-full gap-x-2 bg-gray-200 dark:bg-gray-800">
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M4.5 7L2 4.5M2 4.5L4.5 2M2 4.5H8C8.53043 4.5 9.03914 4.71071 9.41421 5.08579C9.78929 5.46086 10 5.96957 10 6.5V10"
                                        stroke="#667085"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>

                                    <h2 className="text-sm ">In progress</h2>
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center px-3 py-1 text-red-500 rounded-full gap-x-2 bg-red-100/60 dark:bg-gray-800">
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M9 3L3 9M3 3L9 9"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>

                                    <h2 className="text-sm">Cancelled</h2>
                                  </div>
                                )}
                              </td>

                              <td className="px-6 py-4">
                                <Link
                                  to={`/dashboard/client/orders/${order.id}`}
                                  className=" text-red-600 dark:text-red-500 hover:underline"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                  >
                                    <path d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"></path>
                                  </svg>
                                </Link>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl ">
            No Orders Yet
          </h1>
        
          )}
        </section>
      </div>
    </div>
  );
}
