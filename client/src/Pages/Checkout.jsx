import { Fragment, useEffect, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SaveOrder } from "../Redux/Slices/AdminOrderSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Profile } from "../Redux/Slices/AuthSlice";
import { ApplayCoupon, DestroyCoupon } from "../Redux/Slices/CouponSlice";
import Header from "../Components/Header";
import { destroyUserCart } from "../Redux/Slices/CartSlice";

export default function Checkout() {
  const [full_name, setfull_name] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setphone] = useState("");
  const [Adress, setAdress] = useState("");
  const [paymentMode, setpaymentMode] = useState("");
  const [code, setCode] = useState("");
  const [shipping_cost, setShipping_cost] = useState();
  const [tax, setTax] = useState();
  const [cart_value, setcart_value] = useState(0);
  const [SubTotal, setSubTotal] = useState(0);
  const [CouponError, setCouponError] = useState("");
  const [NewOrder, setNewOrder] = useState({});
  const [DeletedCoupon, setDeletedCoupon] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupons, setAppliedCoupons] = useState([]);

  const { connected_user } = useSelector((state) => state.Auth);
  const { cart } = useSelector(state => state.Cart)
  const { Products } = useSelector(state => state.Product)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = localStorage.getItem('token')
    if (auth == null) {
      navigate('/404')
    }
  }, [])
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    const validatedCartSubTotal = cart
      .filter(
        (cartItem) =>
          cartItem.quantity <=
          Products?.find((product) => product.id == cartItem.product.id)
            ?.quantity &&
          Products?.find((product) => product.id == cartItem.product.id)
            ?.quantity != 0
      )
      .reduce(
        (total, product) =>
          total +
          parseFloat(product.product.selling_price) *
          parseFloat(product.quantity),
        0
      );
    setSubTotal(validatedCartSubTotal);
    setcart_value(validatedCartSubTotal);
  }, [cart, Products]);

  const handelsubmit = (e) => {
    e.preventDefault();

    if (!full_name) {
      toast.error("Please Enter Your Name");
      return;
    }
    if (!email) {
      toast.error("Please Enter Your Email");
      return;
    }
    if (!phone) {
      toast.error("Please Enter Your Phone");
      return;
    }
    if (!Adress) {
      toast.error("Please Enter Your Address");
      return;
    }
    if (!paymentMode) {
      toast.error("Please Select Payment Mode");
      return;
    }

    const formData = new FormData();
    formData.append("full_name", full_name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", Adress);
    formData.append("payment_mode", paymentMode);

    const validatedCartItems = cart.filter(
      (cartItem) =>
        cartItem.quantity <=
        Products?.find((product) => product.id == cartItem.product.id)
          ?.quantity &&
        Products?.find((product) => product.id == cartItem.product.id)
          ?.quantity != 0
    );

    for (let i = 0; i < validatedCartItems.length; i++) {
      formData.append(
        `cart[${i}][product_id]`,
        validatedCartItems[i].product_id
      );
      formData.append(`cart[${i}][quantity]`, validatedCartItems[i].quantity);
    }
    // add the applyed coupon to the order formdata
    let couponDiscount = 0;
    for (let i = 0; i < appliedCoupons.length; i++) {
      couponDiscount += parseFloat(appliedCoupons[i].discount);
    }
    formData.append("coupon_discount", couponDiscount);

    if (validatedCartItems.length != 0) {
      dispatch(SaveOrder(formData))
        .unwrap()
        .then((result) => {
          if (result.error) {
            toast.error(result.error[Object.keys(result.error)[0]][0]);
          } else {
            setNewOrder(result)
            if (appliedCoupons.length >= 1) {
              appliedCoupons.forEach((coupon) => {
                dispatch(DestroyCoupon(coupon.id))
                  .unwrap()
                  .catch((rejectedValueOrSerializedError) => {
                    toast.error(rejectedValueOrSerializedError);
                    console.log(
                      "Error Occured Coupon :",
                      rejectedValueOrSerializedError
                    );
                  });
              });
              setAppliedCoupons([]);
              setCode("")
            }
            dispatch(destroyUserCart())
              .unwrap()
              .catch((rejectedValueOrSerializedError) => {
                toast.error(rejectedValueOrSerializedError);
                console.log(
                  "Error Occured Cart :",
                  rejectedValueOrSerializedError
                );
              });
            // navigate("/store");
            setOpen(true)
          }
        })
        .catch((rejectedValueOrSerializedError) => {
          toast.error(rejectedValueOrSerializedError);
          console.log("Error Occured Order :", rejectedValueOrSerializedError);
        });
    } else {
      toast.info("Please add products to your cart");
    }
  };
  useEffect(() => {
    dispatch(Profile())
      .unwrap()
      .catch((error) => {
        console.log("error", error);
      });
    if (connected_user) {
      setfull_name(connected_user.full_name || "");
      setEmail(connected_user.email || "");
      setphone(connected_user.phone || "");
      setAdress(connected_user.address || "");
    }
  }, [connected_user]);

  // ---------------------Coupon------------------------------
  const ApplayCouponSubmit = (e) => {
    e.preventDefault();
    if (!isApplyingCoupon && code) {
      if (appliedCoupons.some((appliedCoupon) => appliedCoupon.code === code)) {
        toast.warning("Coupon already applied");
        return;
      }
      setIsApplyingCoupon(true);
      const formDataCoupon = new FormData();
      formDataCoupon.append("code", code);
      formDataCoupon.append("cart_value", cart_value);
      dispatch(ApplayCoupon(formDataCoupon))
        .unwrap()
        .then((result) => {
          setIsApplyingCoupon(false);

          if (result.status === 404) {
            setCouponError(result.error);
            setTimeout(() => {
              setCouponError("");
            }, 5000);
          } else {
            if (result.discount) {
              setcart_value((value) => value - result.discount);

              setDeletedCoupon(result.coupon);
              setAppliedCoupons([
                ...appliedCoupons,
                { ...result.coupon, discount: result.discount },
              ]);
              setCode("");
            }
            toast.success("Coupon applied  successfully");
          }
        })
        .catch((reject) => {
          console.log("reject", reject);
        });
    } else {
      toast.error("Please enter a valid coupon code");
    }
  };

  useEffect(() => {
    setpaymentMode("cash on delivery");
  }, []);
  return (
    <>
      <Header />
      <div className="overflow-y-hidden">
        <div className="flex justify-center items-center 2xl:container 2xl:mx-auto lg:py-16 md:py-12 py-9 px-4 md:px-6 lg:px-20 xl:px-44 ">
          <div className="flex w-full sm:w-9/12 lg:w-full flex-col lg:flex-row lg:space-x-10 2xl:space-x-36 space-y-12 lg:space-y-0">
            <div className="flex w-full  flex-col justify-start items-start">
              <form onSubmit={handelsubmit} className="w-full">
                <div className="mt-12">
                  <p className="text-xl font-semibold leading-5 text-gray-800">
                    Shipping Details
                  </p>
                </div>
                <div className="mt-8 flex flex-col justify-start items-start w-full space-y-2 ">
                  <div className="w-full">
                    <label
                      htmlFor="fullname"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Full Name
                    </label>
                    <div className="relative mt-2 rounded-md">
                      <input
                        type="text"
                        name="fullname"
                        id="fullname"
                        className="block w-full outline-none rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        value={full_name}
                        onChange={(e) => {
                          setfull_name(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="email_checkout"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="relative mt-2 rounded-md">
                      <input
                        type="text"
                        name="email_checkout"
                        id="email_checkout"
                        className="block w-full outline-none rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Phone Number
                    </label>
                    <div className="relative mt-2 rounded-md">
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        className="block w-full outline-none  rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        value={phone}
                        onChange={(e) => {
                          setphone(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="adress"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Adress
                    </label>
                    <div className="relative mt-2 rounded-md">
                      <input
                        type="text"
                        name="adress"
                        id="adress"
                        className="block w-full outline-none rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        value={Adress}
                        onChange={(e) => {
                          setAdress(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <fieldset className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-gray-300">
                    <legend className="text-2xl text-gray-700 mr-4">
                      Payment Mode
                    </legend>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-6 mx-auto">
                    <label
                      htmlFor="plan-hobby"
                      className="relative flex flex-col bg-white p-5 rounded-lg shadow-md cursor-pointer"
                    >
                      <span className="font-bold text-lg text-gray-500 leading-tight uppercase mb-2">
                        cash{" "}
                      </span>
                      <span className="font-bold text-lg text-gray-500 leading-tight uppercase mb-2">
                        On
                      </span>
                      <span className="font-bold text-lg text-gray-500 leading-tight uppercase mb-2">
                        delivery
                      </span>

                      <input
                        type="radio"
                        name="pay"
                        id="plan-hobby"
                        value="cash on delivery"
                        className="absolute h-0 w-0 appearance-none"
                        checked={paymentMode === "cash on delivery"}
                        onChange={(event) => setpaymentMode(event.target.value)}
                      />
                      <span
                        aria-hidden="true"
                        className="hidden absolute inset-0 border-2 border-green-500 bg-green-200 bg-opacity-10 rounded-lg"
                      >
                        <span className="absolute top-4 right-4 h-6 w-6 inline-flex items-center justify-center rounded-full bg-green-200">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-5 w-5 text-green-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      </span>
                    </label>
                  </div>
                </fieldset>

                <button className="focus:outline-none mt-8 px-4 py-2 text-base font-medium text-white bg-gradient-to-r from-red-500 to-yellow-400 w-full md:w-4/12 lg:w-full rounded-md">
                  Proceed to payment
                </button>
                <div className="mt-4 flex justify-start items-center w-full">
                  <NavLink
                    to="/store"
                    className="text-base cursor-pointer leading-4 focus:outline-none mt-2 focus:text-gray-500 hover:text-gray-800 text-gray-600"
                  >
                    Back to store
                  </NavLink>
                </div>
              </form>
            </div>
            <div className="flex flex-col justify-start items-start bg-gray-50 w-full p-6 md:p-7">
              <div className="flex flex-col space-y-8 w-full">
                <div className="flex flex-col max-h-[calc(31rem)] w-full overflow-y-auto space-y-8">
                  {cart
                    ?.filter(
                      (cartItem) =>
                        cartItem.quantity <=
                        Products?.find(
                          (product) => product.id == cartItem.product.id
                        )?.quantity &&
                        Products?.find(
                          (product) => product.id == cartItem.product.id
                        )?.quantity != 0
                    )
                    .map((cartItem) => (
                      <div
                        key={cartItem.id}
                        className="flex items-center space-x-4 w-full"
                      >
                        <img
                          src={cartItem.product.images[0].image}
                          alt={cartItem.product.images[0].id}
                          className="w-36 h-36 rounded-md"
                        />
                        <div className="flex flex-col w-full justify-between h-32">
                          <div className="flex justify-between w-full">
                            <div className="flex flex-col">
                              <h3 className="text-lg">
                                {cartItem.product.name}
                              </h3>
                            </div>
                            <h3 className="text-lg">
                              $
                              {parseFloat(cartItem.product.selling_price) *
                                parseFloat(cartItem.quantity)}
                            </h3>
                          </div>
                          <div className="flex space-x-2 pb-2">
                            <p className="text-md font-sans font-medium">
                              Qty :{cartItem.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <form onSubmit={ApplayCouponSubmit}>
                  {CouponError && (
                    <div
                      className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                      role="alert"
                    >
                      <span className="font-medium">{CouponError}</span>
                    </div>
                  )}
                  <div className="flex space-x-4 w-full">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      className="w-full px-4 py-2 rounded-md border-gray-300 outline-none border"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                      }}
                    />
                    <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-yellow-400 rounded-md">
                      Apply
                    </button>
                  </div>
                </form>
                <div>
                  <p className="text-gray-700">
                    <span className="flex justify-between mb-4">
                      <span>Subtotal:</span>
                      <span className="font-medium text-md font-sans">
                        ${SubTotal.toFixed(2)}
                      </span>
                    </span>
                  </p>
                  <p className="text-gray-700">
                    {appliedCoupons &&
                      appliedCoupons.map((coupon, index) => (
                        <span className="flex justify-between mb-4" key={index}>
                          <span>
                            Coupon {index + 1}{" "}
                            <span className="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                              {coupon.code}
                            </span>
                          </span>
                          <span className="font-medium text-md font-sans">
                            -${coupon.discount}
                          </span>
                        </span>
                      ))}
                  </p>
                  <p className="text-gray-700">
                    <span className="flex justify-between mb-4">
                      <span>Taxes:</span>
                      <span className="font-medium text-md font-sans">$0</span>
                    </span>
                  </p>
                  <p className="text-gray-700">
                    <span className="flex justify-between mb-4">
                      <span>Shipping:</span>
                      <span className="font-medium text-md font-sans">$0</span>
                    </span>
                  </p>
                  <hr className="border-gray-300 my-6" />
                  <p className="text-lg font-medium text-gray-900">
                    <span className="flex justify-between mb-4">
                      <span>Total:</span>
                      <span className="font-medium text-md font-sans">
                        ${cart_value.toFixed(2)}
                      </span>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-40 inset-0 overflow-y-auto,"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="h-5 w-5 text-green-600"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Order Created successfully
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Thank you for your order! We appreciate your trust in
                        us. Our team is working diligently to process and
                        fulfill your purchase promptly. Your items will be
                        prepared and shipped with care.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-400 text-base font-medium text-white hover:bg-green-600 focus:outline-none sm:col-start-2 sm:text-sm"
                    onClick={() => navigate(`/dashboard/client/orders/${NewOrder.id}`)}
                  >
                    View Order
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
