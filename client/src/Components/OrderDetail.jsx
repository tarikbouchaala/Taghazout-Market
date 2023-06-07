import React, { useEffect, useState } from "react";
// import Stepper from './Stepper'
import cod from "../assets/Images/cod.jpg";
import Progressbar from "./Progressbar";
import CLientSideBar from "./CLientSideBar";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetOrders } from "../Redux/Slices/AdminOrderSlice";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../Components/admin/Sidebar";
import { UpdateOrderStatus } from "../Redux/Slices/AdminOrderSlice";

function OrderDetail() {
  const [Subtotal, setSubtotal] = useState(0);
  const [Total, setTotal] = useState(0);
  const [activeStep, setActiveStep] = useState(3);
  const [status, SetStatus] = useState("");
  const [Order, SetOrder] = useState();
  const [ClientTotalOrders, SetClientTotalOrders] = useState(0);

  const dispatch = useDispatch();
  const { id } = useParams();

  console.log("status state", status);

  const HandelupdateStatus = (e) => {
    e.preventDefault();

    console.log("update status", status);
    if (status) {
      const StatusFormdata = new FormData();
      StatusFormdata.append("_method", "PUT");
      StatusFormdata.append("status_message", status);

      dispatch(UpdateOrderStatus({ id: Order.id, StatusFormdata }))
        .unwrap()
        .then((result) => {
          const { status_message } = result.order;
          console.log("order status from then", status_message);
          switch (status_message) {
            case "in-progress":
              setActiveStep(0);
              break;
            case "shipped":
              setActiveStep(1);
              break;
            case "in-route":
              setActiveStep(2);
              break;
            case "delivered":
              setActiveStep(3);
              break;
            case "cancelled":
              setActiveStep(4);
              break;
            default:
              setActiveStep(0);
              break;
          }
          toast.success("status  updated  successfully");
        })
        .catch((reject) => {
          console.log("reject", reject);
        });
    } else {
      toast.warn("Please select a status before updating");
    }
  };

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        dispatch(GetOrders())
          .unwrap()
          .then((res) => {
            const order = res.data.find((order) => order.id == id);
            if (order) {
              const CountOrders = res.data.filter(
                (order) => order.user_id == order.user_id
              ).length;
              SetClientTotalOrders(CountOrders);
              SetOrder(order);
              const calculatedSubtotal = order.order_items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
              );
              setSubtotal(calculatedSubtotal);
              setTotal(calculatedSubtotal - order?.coupon_discount);

              const { status_message } = order;

              switch (status_message) {
                case "in-progress":
                  setActiveStep(0);
                  break;
                case "shipped":
                  setActiveStep(1);
                  break;
                case "in-route":
                  setActiveStep(2);
                  break;
                case "delivered":
                  setActiveStep(3);
                  break;
                case "cancelled":
                  setActiveStep(4);
                  break;
                default:
                  setActiveStep(0);
                  break;
              }
            }
          });
      } catch (error) {
        console.log("error", error);
      }
    };

    getOrderDetails();
  }, [dispatch, id, activeStep]);

  console.log("ClientTotalOrders", ClientTotalOrders);

  return (
    <div className="flex">
      <Sidebar />

      <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto flex-1">
        <div className="flex justify-start item-start space-y-2 flex-col ">
          <h1 className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9  text-orange-500">
            Order ID {Order?.id}
          </h1>
          <p className="text-base font-medium leading-6 text-gray-800">
            {moment(Order?.created_at).format("Do MMMM YYYY [at] h:mm A")}
          </p>
        </div>
        {activeStep == 4 ? (
          <div className="rounded-md bg-red-50 p-4 mt-4">
            <div className="ml-3">
              <h1 className="text-2xl font-medium text-red-800 justify-center">
                Order Cancelled{" "}
              </h1>
            </div>
          </div>
        ) : (
          <Progressbar activeStep={activeStep} />
        )}
        <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch  w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
          <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
            <div className="  flex flex-col justify-start items-start bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
              {Order?.order_items.map((item, index) => (
                <div
                  key={item.id}
                  className="py-2 border-b border-gray-200 flex space-x-6"
                >
                  <img
                    src={item.product.images[0]?.image}
                    alt={"alt"}
                    className="flex-none w-20 h-20 object-center object-cover bg-gray-100 rounded-lg sm:w-40 sm:h-40"
                  />
                  <div className="flex-auto flex flex-col">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        <a href={"/"}>{item.product.name}</a>
                      </h4>
                      <p className="mt-2 text-sm text-gray-600">
                        {item.product.description}
                      </p>
                    </div>
                    <div className="mt-6 flex-1 flex items-end">
                      <dl className="flex text-sm divide-x divide-gray-200 space-x-4 sm:space-x-6">
                        <div className="flex">
                          <dt className="font-medium text-gray-900">
                            Quantity
                          </dt>
                          <dd className="ml-2 text-gray-700">
                            {item.quantity}
                          </dd>
                        </div>
                        <div className="pl-4 flex sm:pl-6">
                          <dt className="font-medium text-gray-900">Price</dt>
                          <dd className="ml-2 text-gray-700">
                            ${item.price * item.quantity}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
              <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   ">
                <h3 className="text-xl font-semibold leading-5 text-orange-500">
                  Update Status
                </h3>
                <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                  <form onSubmit={HandelupdateStatus} className="w-full">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center flex-1">
                        <select
                          id="status"
                          className=" flex-1 w-full py-2 px-3 mx-4 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          onChange={(e) => SetStatus(e.target.value)}
                        >
                          <option
                            value="in-progress"
                            selected={Order?.status_message === "in-progress"}
                          >
                            In progress
                          </option>
                          <option
                            value="shipped"
                            selected={Order?.status_message === "shipped"}
                          >
                            Shipped
                          </option>
                          <option
                            value="in-route"
                            selected={Order?.status_message === "in-route"}
                          >
                            In Route
                          </option>
                          <option
                            value="delivered"
                            selected={Order?.status_message === "delivered"}
                          >
                            Delivered
                          </option>
                          <option
                            value="cancelled"
                            selected={Order?.status_message === "cancelled"}
                          >
                            Cancelled
                          </option>
                        </select>
                        <button className="py-2 px-6 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm ml-2 focus:ring-2 focus:ring-orange-500">
                          Update
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              {/*  payment mode  */}

              <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6     ">
                <h3 className="text-xl font-semibold leading-5 text-orange-500">
                  Paiment mode
                </h3>
                <div className="flex justify-between items-start w-full">
                  {/* payment with cart */}
                  {Order?.payment_mode == "cash on delivery" ? (
                    <div className="flex justify-center items-center space-x-4">
                      <div className="w-8 h-8">
                        <img src={cod} alt="" />
                      </div>
                      <div className="flex flex-col justify-start items-center">
                        Cash on delivery
                      </div>
                    </div>
                  ) : Order?.payment_mode == "payment mode 2" ? (
                    <div className="flex justify-center items-center space-x-4">
                      <div className="w-8 h-8">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="32"
                          height="32"
                        >
                          <path
                            d="M1 4H23V6H1V4ZM1 18H23V20H1V18ZM19.6217 
                       14.9136L19.448 14.0436L17.4994 14.0435L17.1899 14.907L15.6275 14.9105C16.6316 12.5036 17.3767 10.7206 17.8628 9.56169C17.9898 9.25902 18.2156 
                       9.10462 18.5482 9.10699C18.802 9.10888 19.2168 9.10912 19.7927 9.10771L21 14.9108L19.6217 14.9136ZM17.9376 12.8518H19.1936L18.7248 10.6715L17.9376 
                       12.8518ZM7.87203 9.10561L9.44245 9.10764L7.01511 14.9136L5.42535 14.9129C4.88785 12.8424 4.49315 11.3073 4.24125 10.3076C4.16402 10.001 4.01042 9.787 
                       3.71519 9.68577C3.45195 9.59551 3.01355 9.45594 2.4 9.26707V9.10771C3.54718 9.10757 4.38339 9.10757 4.90863 9.10771C5.34299 9.10784 5.59619 9.31703 5.67765
                        9.74655C5.75942 10.1779 5.96599 11.2743 6.29735 13.0359L7.87203 9.10561ZM11.5994 9.10765L10.3588 14.913L8.86434 14.9108C8.89383 14.7698 9.30682 12.8347 10.1033
                         9.10561L11.5994 9.10765ZM14.6307 9C15.0773 9 15.6405 9.13846 15.9652 9.26707L15.703 10.4706C15.41 10.3532 14.9284 10.1944 14.5228 10.2006C13.933 10.2097 13.569
                          10.4566 13.569 10.6936C13.569 11.0783 14.2015 11.272 14.8528 11.6929C15.5956 12.1729 15.6937 12.603 15.6845 13.0713C15.6739 14.0422 14.8528 15 13.12 15C12.3286
                           14.9882 12.0444 14.9219 11.3995 14.6936L11.6718 13.4376C12.3282 13.712 12.6066 13.7991 13.1675 13.7991C13.6816 13.7991 14.1229 13.5918 14.1267 13.2308C14.1294 
                           12.974 13.972 12.847 13.395 12.5293C12.8181 12.2117 12.0095
                        11.7726 12.0199 10.8889C12.0332 9.75821 13.1066 9 14.6307 9Z"
                            fill="rgba(234,113,46,1)"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex flex-col justify-start items-center">
                        with cart
                      </div>
                    </div>
                  ) : (
                    "payment mode 3"
                  )}

                  <p className="text-lg font-semibold leading-6 text-gray-800"></p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="bg-gray-50 w-auto xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col border border-gray-300 p-4 mb-8">
              <h3 className="text-xl font-semibold leading-5 text-orange-500">
                Customer Informations
              </h3>
              <div className="flex  flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0 ">
                <div className="flex flex-col justify-start items-start flex-shrink-0">
                  <div className="flex justify-center  w-full  md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
                    <div className=" flex justify-start items-start flex-col space-y-2">
                      <p className="text-base font-semibold leading-4 text-left text-gray-800">
                        {Order?.full_name}
                      </p>
                      <p className="text-sm leading-5 text-gray-600">
                        <span className="font-semibold text-lg"> {ClientTotalOrders - 1}</span>
                        <span className="ml-2">Previous Orders</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center  md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path
                        d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM20 7.23792L12.0718 14.338L4 7.21594V19H20V7.23792ZM4.51146 5L12.0619 11.662L19.501 5H4.51146Z"
                        fill="rgba(234,113,46,1)"
                      ></path>
                    </svg>
                    <p className="cursor-pointer font-semibold  leading-5 text-gray-800">
                      {Order?.email}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center  md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path
                      d="M9.36556 10.6821C10.302 12.3288 11.6712 13.698 13.3179 14.6344L14.2024 13.3961C14.4965 12.9845 15.0516 12.8573 15.4956 13.0998C16.9024 13.8683 18.4571 14.3353 20.0789 14.4637C20.599 14.5049 21 14.9389 21 15.4606V19.9234C21 20.4361 20.6122 20.8657 20.1022 20.9181C19.5723 20.9726 19.0377 21 18.5 21C9.93959 21 3 14.0604 3 5.5C3 4.96227 3.02742 4.42771 3.08189 3.89776C3.1343 3.38775 3.56394 3 4.07665 3H8.53942C9.0611 3 9.49513 3.40104 9.5363 3.92109C9.66467 5.54288 10.1317 7.09764 10.9002 8.50444C11.1427 8.9484 11.0155 9.50354 10.6039 9.79757L9.36556 10.6821ZM6.84425 10.0252L8.7442 8.66809C8.20547 7.50514 7.83628 6.27183 7.64727 5H5.00907C5.00303 5.16632 5 5.333 5 5.5C5 12.9558 11.0442 19 18.5 19C18.667 19 18.8337 18.997 19 18.9909V16.3527C17.7282 16.1637 16.4949 15.7945 15.3319 15.2558L13.9748 17.1558C13.4258 16.9425 12.8956 16.6915 12.3874 16.4061L12.3293 16.373C10.3697 15.2587 8.74134 13.6303 7.627 11.6707L7.59394 11.6126C7.30849 11.1044 7.05754 10.5742 6.84425 10.0252Z"
                      fill="rgba(234,113,46,1)"
                    ></path>
                  </svg>
                  <p className="cursor-pointer text-sm  font-semibold leading-5 text-gray-800">
                    {Order?.phone}
                  </p>
                </div>
                <div className="flex justify-center  md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path
                      d="M12 20.8995L16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995ZM12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13ZM12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15Z"
                      fill="rgba(234,113,46,1)"
                    ></path>
                  </svg>
                  <p className="cursor-pointer text-sm leading-5 font-semibold text-gray-800">
                    {Order?.address}
                  </p>
                </div>
              </div>
            </div>
            {/*  sam */}

            <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6 border border-gray-300   ">
              <h3 className="text-xl font-semibold leading-5 text-orange-500">
                Summary
              </h3>
              <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                <div className="flex justify-between  w-full">
                  <p className="text-base leading-4 text-gray-800">Subtotal</p>
                  <p className="text-base leading-4 text-gray-600">
                    ${Subtotal}
                  </p>
                </div>
                <div className="flex justify-between items-center w-full">
                  <p className="text-base leading-4 text-gray-800">Tax</p>
                  <p className="text-base leading-4 text-gray-600">
                    ${Order?.tax}
                  </p>
                </div>
                <div className="flex justify-between items-center w-full">
                  <p className="text-base leading-4 text-gray-800">
                    Shipping Cost
                  </p>
                  <p className="text-base leading-4 text-gray-600">
                    ${Order?.shipping_cost}
                  </p>
                </div>

                {Order?.coupon_discount ? (
                  <span className="flex justify-between mb-4  items-center w-full">
                    <span>Coupon </span>
                    <span className="font-medium text-md font-sans">
                      -$ {Order?.coupon_discount}
                    </span>
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="text-base font-semibold leading-4 text-gray-800">
                  Total
                </p>
                <p className="text-base font-semibold leading-4 text-gray-600">
                  ${Total}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
