import React, { useState, useEffect } from "react";
import { GetCoupons, Savecoupon } from "../../Redux/Slices/CouponSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
function Coupon() {
  const dispatch = useDispatch();

  const [code, setCode] = useState("");
  const [type, setType] = useState("fixed");
  const [value, setValue] = useState("");
  const [cartValue, setCartValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("code", code);
    formData.append("type", type);
    formData.append("value", value);
    formData.append("cart_value", cartValue);
    dispatch(Savecoupon(formData))
      .unwrap()
      .then((result) => {
        if (result.error) {
          toast.error(result.error[Object.keys(result.error)[0]][0]);
        } else {
          toast.success("Coupon saved successfully");
          setCode("");
          setType("fixed");
          setValue("");
          setCartValue("");
        }
      })
      .catch((reject) => {
        toast.error(reject);
      });
  };
  useEffect(() => {
    dispatch(GetCoupons());
  }, [dispatch]);
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full	px-5 mx-auto mt-14 ">
        <div class="bg-gray-100 p-4">
          <h2 class="text-2xl font-bold text-gray-800">Add New Coupon</h2>
          <p class="text-gray-600">
            Add a new coupon to offer discounts          </p>
        </div>
        <div className=" rounded  divide-orange-500 border-gray-500 mt-8 w-3/4 mx-auto ">
          <form onSubmit={handleSubmit}>
            <div className="mt-8 grid lg:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="code"
                  className="text-sm text-gray-700 block mb-1 font-medium"
                >
                  Code
                </label>
                <input
                  type="text"
                  name="code"
                  id="code"
                  className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="type"
                  className="text-sm text-gray-700 block mb-1 font-medium"
                >
                  Type
                </label>
                <div className="relative">
                  <select
                    name="type"
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-state"
                    value={type}
                    onChange={(event) => setType(event.target.value)}
                  >
                    <option value="fixed">fixed</option>
                    <option value="percent">percent</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="value"
                  className="text-sm text-gray-700 block mb-1 font-medium"
                >
                  Value
                </label>
                <input
                  type="number"
                  name="value-coupon"
                  id="value"
                  className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="cart-value"
                  className="text-sm text-gray-700 block mb-1 font-medium"
                >
                  Cart Value
                </label>
                <input
                  type="text"
                  name="cart-value"
                  id="cart-value"
                  className="bg-gray-100 border border-gray-200 rounded py-1 px-4 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                  value={cartValue}
                  onChange={(event) => setCartValue(event.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-start space-x-4 mt-8">
              <button
                type="submit"
                name="save"
                className="py-2 px-7 bg-orange-500 text-white rounded hover:bg-orange-700 active:bg-orange-700 disabled:opacity-50"
              >
                Save
              </button>
              <button
                name="cancel"
                className="py-2 px-4 bg-white border border-gray-200 text-gray-600 rounded hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>{" "}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Coupon;
