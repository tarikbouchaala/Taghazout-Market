import { Fragment, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import logo from "../assets/Images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { Reset } from "../Redux/Slices/UserSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  useNavigate } from "react-router-dom";

function ResetPassword() {
  const [open, setOpen] = useState(true);
  const [errors, setErrors] = useState({});
  const emailRef = useRef();
  const tokenRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = emailRef.current.value.trim();
    const token = tokenRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    const passwordConfirmation = passwordConfirmationRef.current.value.trim();
    let isValid = true;
    const errors = {};

    if (!email) {
      isValid = false;
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      isValid = false;
      errors.email = "Email is invalid";
    }

    if (!token) {
      isValid = false;
      errors.token = "Token is required";
    }

    if (!password) {
      isValid = false;
      errors.password = "Password is required";
    } else if (password.length < 8) {
      isValid = false;
      errors.password = "Password must be at least 8 characters long";
    }

    if (!passwordConfirmation) {
      isValid = false;
      errors.passwordConfirmation = "Password confirmation is required";
    } else if (passwordConfirmation !== password) {
      isValid = false;
      errors.passwordConfirmation = "Passwords do not match";
    }

    if (!isValid) {
      setErrors(errors);
      return;
    }

    const data = new FormData();
    data.append("email", emailRef.current.value);
    data.append("token", tokenRef.current.value);
    data.append("password", passwordRef.current.value);
    // data.append("passwordConfirmation", passwordConfirmationRef.current.value);
    dispatch(Reset(data))
      .unwrap()
      .then((res) => {
        if(res.error){
          toast.error(res.error);
        }else{
            toast.success("Password Updated seccessfuly");
            navigate("/");
        }
      })
      .catch((error) => {});
  };
  return (
    <div>
      <Transition.Root show={open} as={Fragment} onClose={() => setOpen(true)}>
        <Dialog as="div" className="relative z-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div>
                    <div className="flex min-h-full flex-col justify-center  lg:px-8">
                      <div className="sm:mx-auto sm:w-full sm:max-w-sm py-2">
                        <img
                          className="mx-auto h-10 w-auto "
                          src={logo}
                          alt="Your Company"
                        />
                        <h2 className=" text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mt-3">
                          Reset Your Password
                        </h2>
                      </div>

                      <div className="py-4 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Email
                            </label>
                            <div className="">
                              <input
                                id="email"
                                name="email"
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset pl-2 outline-none sm:text-sm sm:leading-6"
                                ref={emailRef}
                              />
                              {errors.email && (
                                <div className="text-red-500">
                                  {errors.email}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Token
                            </label>
                            <div className="">
                              <input
                                id="email"
                                name="token"
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset pl-2 outline-none sm:text-sm sm:leading-6"
                                ref={tokenRef}
                              />
                              {errors.token && (
                                <div className="error text-red-500">
                                  {errors.token}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              New Password
                            </label>
                            <div className="">
                              <input
                                id="email"
                                name="password"
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset pl-2 outline-none sm:text-sm sm:leading-6"
                                ref={passwordRef}
                              />
                              {errors.password && (
                                <div className="error text-red-500 ">
                                  {errors.password}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Password Confirmation
                            </label>
                            <div className="">
                              <input
                                id="email"
                                name="password"
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset pl-2 outline-none sm:text-sm sm:leading-6"
                                ref={passwordConfirmationRef}
                              />
                              {errors.passwordConfirmation && (
                                <div className="error text-red-500">
                                  {errors.passwordConfirmation}
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <button
                              type="submit"
                              className="flex w-full justify-center rounded-md bg-gradient-to-r from-red-500 to-yellow-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 pl-2 outline-none"
                            >
                              Send
                            </button>
                          </div>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-500">
                          Not a member?
                          <button className="font-semibold cursor-pointer leading-6 bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                            Login
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}

export default ResetPassword;
