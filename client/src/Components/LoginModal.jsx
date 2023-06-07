import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import logo from '../assets/Images/logo.png'
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Login } from "../Redux/Slices/AuthSlice";
import { fetchFavorites } from "../Redux/Slices/WishlistSlice";
import { fetchCartItems, storeCart, updateCart } from "../Redux/Slices/CartSlice";
import { Link } from "react-router-dom";

export default function LoginModal({ loginModal, setLoginModal, cancelButtonRef, setRegisterModal }) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const emailErrorRef = useRef();
  const passwordErrorRef = useRef();

  const dispatch = useDispatch()
  const { cart } = useSelector(state => state.Cart)

  const handleSubmit = (event) => {
    event.preventDefault();
    hideErrorMessages();

    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;

    if (email === '' && password === '') {
      showError(emailErrorRef, 'Email is required.');
      showError(passwordErrorRef, 'Password is required.');
      return;
    }

    if (email === '') {
      showError(emailErrorRef, 'Email is required.');
      return;
    }

    if (password === '') {
      showError(passwordErrorRef, 'Password is required.');
      return;
    }

    if (!isValidEmail(email) && password.length < 8) {
      showError(emailErrorRef, 'Invalid email format.');
      showError(passwordErrorRef, 'Password should be at least 8 characters long.');
      return;
    }
    if (!isValidEmail(email)) {
      showError(emailErrorRef, 'Invalid email format.');
      return;
    }

    if (password.length < 8) {
      showError(passwordErrorRef, 'Password should be at least 8 characters long.');
      return;
    }
    const body = new FormData()
    body.append("email", email)
    body.append("password", password)
    dispatch(Login(body)).unwrap()
      .then(data => {
        if (data.status == 200) {
          toast.success(data.message)
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          if (cart.length == 0) {
            dispatch(fetchCartItems()).unwrap()
              .then(data => {
                if (data.data.length != 0) {
                  dispatch(updateCart(JSON.stringify(data.data)))
                }
              })
              .catch((rejectedValueOrSerializedError) => {
                toast.error(rejectedValueOrSerializedError)
                console.log("Error Occured :", rejectedValueOrSerializedError)
              })
          } else {
            dispatch(storeCart(cart)).unwrap()
              .then(data => {
                dispatch(fetchCartItems()).unwrap()
                  .then(data => {
                    dispatch(updateCart(JSON.stringify(data.data)))
                  })
                  .catch((rejectedValueOrSerializedError) => {
                    toast.error(rejectedValueOrSerializedError)
                    console.log("Error Occured :", rejectedValueOrSerializedError)
                  })
              })
              .catch((rejectedValueOrSerializedError) => {
                toast.error(rejectedValueOrSerializedError)
                console.log("Error Occured :", rejectedValueOrSerializedError)
              })
          }
          setLoginModal(false)
        } else if (data.status == 401) {
          toast.info(data.message)
        } else if (data.status == 404) {
          toast.error(data.message)
        } else {
          let validationErrors = []
          for (let i in data.errors) {
            validationErrors.push(data.errors[i][0])
          }
          toast.error(
            <div>
              {validationErrors.map((e, i) => <p key={i}>{e}</p>)}
            </div>)
        }
      })
      .catch((rejectedValueOrSerializedError) => {
        toast.error(rejectedValueOrSerializedError)
        console.log("Error Occured :", rejectedValueOrSerializedError)
      })
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showError = (errorRef, errorMessage = null) => {
    errorRef.current.classList.remove('hidden');
    if (errorMessage) {
      errorRef.current.textContent = errorMessage;
    }
  };

  const hideErrorMessages = () => {
    const errorRefs = [emailErrorRef, passwordErrorRef];

    errorRefs.forEach((errorRef) => {
      errorRef.current.classList.add('hidden');
    });
  };
  return (
    <Transition.Root show={loginModal} as={Fragment}>
      <Dialog as="div" className="relative z-20" initialFocus={cancelButtonRef} onClose={setLoginModal}>
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
                  <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                      <img className="mx-auto h-10 w-auto" src={logo} alt="Your Company" />
                      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Login to your account</h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                      <form onSubmit={e => handleSubmit(e)} className="space-y-6" >
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                          <div className="mt-2">
                            <input id="email" name="email" type="text" autoComplete="email" ref={emailRef} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset pl-2 outline-none sm:text-sm sm:leading-6" />
                          </div>
                          <p className="text-red-500 text-xs italic hidden" ref={emailErrorRef}>Email is required</p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                            <div className="text-sm">
                              <Link to="/forget" className="font-semibold border-0 outline-none text-transparent bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text">Forgot password?</Link>
                            </div>
                          </div>
                          <div className="mt-2">
                            <input id="password" name="password" type="password" ref={passwordRef} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset pl-2 outline-none sm:text-sm sm:leading-6" />
                          </div>
                          <p className="text-red-500 text-xs italic hidden" ref={passwordErrorRef}>Password is required</p>
                        </div>

                        <div>
                          <button type="submit" className="flex w-full justify-center rounded-md bg-gradient-to-r from-red-500 to-yellow-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 pl-2 outline-none">Login</button>
                        </div>
                      </form>

                      <p className="mt-10 text-center text-sm text-gray-500">
                        Not a member?
                        <a onClick={e => {
                          setLoginModal(false)
                          setRegisterModal(true)
                        }} className="font-semibold cursor-pointer leading-6 bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent"> Register</a>
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
  )
}
