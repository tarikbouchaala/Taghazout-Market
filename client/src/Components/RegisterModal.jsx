import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import logo from '../assets/Images/logo.png'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Register } from "../Redux/Slices/AuthSlice";
import { useDispatch } from 'react-redux';

export default function RegisterModal({ registerModal, cancelButtonRef, setRegisterModal, setLoginModal }) {
    const fullNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();

    const fullNameErrorRef = useRef();
    const emailErrorRef = useRef();
    const passwordErrorRef = useRef();
    const passwordConfirmationErrorRef = useRef();

    const dispatch = useDispatch()

    const handleSubmit = (event) => {
        event.preventDefault();
        hideErrorMessages();

        const isRequiredValid = performRequiredValidation();

        if (!isRequiredValid) {
            return;
        }

        const fullName = fullNameRef.current.value.trim();
        if (fullName === '') {
            showError(fullNameErrorRef, 'Please enter your full name.');
        }
        if (!isValidFullName(fullName)) {
            showError(fullNameErrorRef, 'Full name should contain only alphabetic characters.');
        }


        if (!isValidEmail(emailRef.current.value)) {
            showError(emailErrorRef, 'Invalid email format.');
        }


        const password = passwordRef.current.value;
        if (password === '') {
            showError(passwordErrorRef);
        }
        if (password.length < 8) {
            showError(passwordErrorRef, 'Password should be at least 8 characters long.');
        }


        if (passwordConfirmationRef.current.value !== passwordRef.current.value) {
            showError(passwordConfirmationErrorRef);
        }

        if (isRequiredValid && fullName && isValidFullName(fullName) && isValidEmail(emailRef.current.value) && password && password.length >= 8 && passwordConfirmationRef.current.value === passwordRef.current.value) {
            const body = new FormData()
            body.append("full_name", fullName)
            body.append("email", emailRef.current.value)
            body.append("password", password)
            dispatch(Register(body)).unwrap().then(data => {
                if (data.status != null) {
                    if (data.status) {
                        toast.success(data.message)
                        setRegisterModal(false)
                        setLoginModal(true)
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
                } else {
                    toast.error(data.error)
                }
            }).catch((rejectedValueOrSerializedError) => {
                toast.error(rejectedValueOrSerializedError)
                console.log("Error", rejectedValueOrSerializedError)
            })
        }

    };

    const performRequiredValidation = () => {
        const inputs = [
            { ref: fullNameRef, errorRef: fullNameErrorRef, fieldName: 'Full Name' },
            { ref: emailRef, errorRef: emailErrorRef, fieldName: 'Email' },
            { ref: passwordRef, errorRef: passwordErrorRef, fieldName: 'Password' },
            { ref: passwordConfirmationRef, errorRef: passwordConfirmationErrorRef, fieldName: 'Password Confirmation' }
        ];

        let hasEmptyInput = false;

        inputs.forEach(({ ref, errorRef, fieldName }) => {
            const value = ref.current.value.trim();
            if (value === '') {
                showError(errorRef, `${fieldName} is required.`);
                hasEmptyInput = true;
            }
        });

        return !hasEmptyInput;
    };
    const isValidFullName = (fullName) => {
        const fullNameRegex = /^[A-Za-z\s]+$/;
        return fullNameRegex.test(fullName);
    };


    const isValidEmail = (email) => {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return emailRegex.test(email);
    };

    const showError = (errorRef, errorMessage = null) => {
        errorRef.current.classList.remove('hidden');
        if (errorMessage) {
            errorRef.current.textContent = errorMessage;
        }
    };


    const hideErrorMessages = () => {
        const errorRefs = [
            fullNameErrorRef,
            emailErrorRef,
            passwordErrorRef,
            passwordConfirmationErrorRef
        ];

        errorRefs.forEach((errorRef) => {
            errorRef.current.classList.add('hidden');
        });
    };

    return (
        <Transition.Root show={registerModal} as={Fragment}>
            <Dialog as="div" className="relative z-20" initialFocus={cancelButtonRef} onClose={setRegisterModal}>
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
                    <div className="flex min-h-full py-10 items-center justify-center p-4 text-center sm:items-center sm:p-0">
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
                                            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create an Account</h2>
                                        </div>

                                        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                                            <form onSubmit={e => handleSubmit(e)} className="space-y-6">
                                                <div>
                                                    <label htmlFor="fullName" className="block text-sm font-medium leading-6 text-gray-900">Full Name</label>
                                                    <div className="mt-2">
                                                        <input id="fullName" name="fullName" type="text" ref={fullNameRef} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset pl-2 outline-none sm:text-sm sm:leading-6" />
                                                    </div>
                                                    <p className="text-red-500 text-xs italic hidden" ref={fullNameErrorRef}>Please enter your full name.</p>
                                                </div>

                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                                                    <div className="mt-2">
                                                        <input ref={emailRef} id="email" name="email" type="text" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset pl-2 outline-none sm:text-sm sm:leading-6" />
                                                    </div>
                                                    <p className="text-red-500 text-xs italic hidden" ref={emailErrorRef}>Please enter a valid email address.</p>
                                                </div>

                                                <div>
                                                    <div className="flex items-center justify-between">
                                                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                                                    </div>
                                                    <div className="mt-2">
                                                        <input ref={passwordRef} id="password" name="password" type="password" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset pl-2 outline-none sm:text-sm sm:leading-6" />
                                                    </div>
                                                    <p className="text-red-500 text-xs italic hidden" ref={passwordErrorRef}>Please enter a password.</p>
                                                </div>

                                                <div>
                                                    <div className="flex items-center justify-between">
                                                        <label htmlFor="passwordConfirmation" className="block text-sm font-medium leading-6 text-gray-900">Password Confirmation</label>
                                                    </div>
                                                    <div className="mt-2">
                                                        <input ref={passwordConfirmationRef} id="passwordConfirmation" name="passwordConfirmation" type="password" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset pl-2 outline-none sm:text-sm sm:leading-6" />
                                                    </div>
                                                    <p className="text-red-500 text-xs italic hidden" ref={passwordConfirmationErrorRef}>Passwords do not match.</p>
                                                </div>

                                                <div>
                                                    <button type="submit" className="flex w-full justify-center rounded-md bg-gradient-to-r from-red-500 to-yellow-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 pl-2 outline-none">Register</button>
                                                </div>
                                            </form>


                                            <p className="mt-10 text-center text-sm text-gray-500">
                                                Already have an account?
                                                <a onClick={e => {
                                                    setRegisterModal(false)
                                                    setLoginModal(true)
                                                }} className="font-semibold cursor-pointer leading-6 bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent"> Login</a>
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
