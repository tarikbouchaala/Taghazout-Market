import { Fragment, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import logo from "../assets/Images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { Forget } from "../Redux/Slices/UserSlice";
import Mail from "../assets/Images/Mail.png";
import { Link, useNavigate } from "react-router-dom";
export default function ForgetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [Show, setShow] = useState(false);

  const emailErrorRef = useRef();
  const emailRef = useRef();

  const HandelSubmit = (e) => {
    e.preventDefault();
    const email = emailRef.current.value.trim();

    if (email === "") {
      showError(emailErrorRef, "Email is required.");
      return;
    }
    if (!isValidEmail(email)) {
      showError(emailErrorRef, "Invalid email format.");
      return;
    }
    console.log("submited form with email", email);

    const body = new FormData();
    body.append("email", email);
    dispatch(Forget(body))
      .unwrap()
      .then((res) => {
        console.log("res", res)
        if (res.error) {
          showError(emailErrorRef, "No user exists with this email");
        } else {

          setOpen(false)
          setShow(true)
        }
      })
      .catch((err) => { });
  };

  const showError = (errorRef, errorMessage = null) => {
    errorRef.current.classList.remove("hidden");
    if (errorMessage) {
      errorRef.current.textContent = errorMessage;
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  return (

    <>
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
                    <div className="flex min-h-full flex-col justify-center px-4 md:px-6 lg:px-8">
                      <div className="sm:mx-auto sm:w-full sm:max-w-sm py-2">
                        <img
                          className="mx-auto h-10 w-auto "
                          src={logo}
                          alt="Your Company"
                        />
                        <h2 className=" text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mt-3">
                          Forget Password
                        </h2>
                      </div>

                      <div className="py-4 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" onSubmit={HandelSubmit}>
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Email
                            </label>
                            <div className="">
                              <input
                                ref={emailRef}
                                id="email"
                                name="email"
                                type="text"
                                autoComplete="email"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset pl-2 outline-none sm:text-sm sm:leading-6"
                              // onChange={e=>handleEmailChange(e)}
                              />
                              <p
                                className="text-red-500 text-xs italic hidden"
                                ref={emailErrorRef}
                              >
                                Email is required
                              </p>
                            </div>
                          </div>

                          <div>
                            <button
                              type="submit"
                              className="flex w-full justify-center rounded-md bg-gradient-to-r from-red-500 to-yellow-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 pl-2 outline-none"
                            >
                              Send
                            </button>
                            <button
                              onClick={e => navigate('/')}
                              className="flex w-full justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-orange-500 border mt-2 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 pl-2 outline-none"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>









      {
        Show &&
        <div className="flex justify-center items-center h-screen bg-gray-900 bg-opacity-50">
          <Link className="hidden md:flex items-center text-tertiary ml-2 lg:hover:text-octonary absolute top-0 left-0 mt-0 " to="/">
            <div className="bg-octonary shadow-small lg:hover:bg-tertiary transition active:scale-95 flex items-center px-2 py-1 rounded-full font-semibold text-white">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" className="h-5 w-5 mr-2 lg:hover:fill-octonary fill-white transition" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"></path>
              </svg>
              <span>Retour</span>
            </div>
          </Link>
          <div className="py-8 rounded-xl bg-white shadow-lg flex flex-col justify-center items-center w-2/5 xl:w-2/6	px-4">
            <div className="flex items-center">
              <img src={Mail} alt="" className="w-full" />
            </div>
            <p className="mt-2 text-sky-700 font-medium text-lg">
              Please check your mailbox for a recovery email.
            </p>
          </div>
        </div>}




    </>


  );
}
