import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { contactMail } from './../Redux/Slices/EmailSlice';
import { useDispatch } from "react-redux";

function ContactUs({ setLoading }) {
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const emailRef = useRef()
  const textAreaRef = useRef()
  const dispatch = useDispatch()

  const handleMail = (e) => {
    e.preventDefault();
    let form = {
      firstName: firstNameRef.current.value.trim(),
      lastName: lastNameRef.current.value.trim(),
      email: emailRef.current.value.trim(),
      message: textAreaRef.current.value.trim(),
    }
    let err = []
    if (form.firstName.trim() === "" && form.lastName.trim() !== "" && form.email.trim() !== "" && form.message.trim() !== "") {
      err.push("All fields are required")
    } else {
      if (form.firstName.trim() === "") {
        err.push("First name is required")
      }
      if (form.lastName.trim() === "") {
        err.push("Last name is required")
      }
      if (form.email.trim() === "") {
        err.push("Email is required")
      }
      if (form.message.trim() === "") {
        err.push("Message is required")
      }
      if (!/^[A-Za-z]+$/.test(form.firstName)) {
        err.push("First name must be only letters")
      }
      if (!/^[A-Za-z]+$/.test(form.lastName)) {
        err.push("Last name must be only letters")
      }
      if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email)) {
        err.push("Invalid email address")
      }
      if (form.message.length < 10) {
        err.push("Message must be at least 10 characters")
      }
    }
    if (err.length > 0) {
      toast.error(
        <div>
          {err.map((e, i) => <p key={i}>{e}</p>)}
        </div>)
    } else {
      setLoading(true)
      const body = new FormData()
      body.append("first_name", form.firstName)
      body.append("last_name", form.lastName)
      body.append("email", form.email)
      body.append("message", form.message)
      dispatch(contactMail(body)).unwrap().then(data => {
        if (data.status == 401) {
          setLoading(false)
          let validationErrors = []
          for (let i in data.errors) {
            validationErrors.push(data.errors[i][0])
          }
          toast.error(
            <div>
              {validationErrors.map((e, i) => <p key={i}>{e}</p>)}
            </div>)
        }
        else {
          setLoading(false)
          toast.success(data.message)
          firstNameRef.current.value = ""
          lastNameRef.current.value = ""
          emailRef.current.value = ""
          textAreaRef.current.value = ""
        }
      }).catch((rejectedValueOrSerializedError) => {
        setLoading(false)
        toast.error(rejectedValueOrSerializedError)
        console.log("Error", rejectedValueOrSerializedError)
      })
    }

  }

  return (

    <div id="contactUs" className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 ">
      <section className="bg-white dark:bg-gray-900">
        <div className="container mx-auto ">
          <div className="relative inline-block mb-9">
            <h2 className=" font-sans text-2xl font-bold text-black inline-block mb-3">
              Contact Us
            </h2>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-yellow-400"></div>
          </div>

          <div className="flex w-full justify-center">
            <div className="p-4 py-6 xl:w-1/2 lg:w-3/4 rounded-lg bg-gray-50 dark:bg-gray-800 md:p-8">
              <form onSubmit={e => handleMail(e)}>
                <div className="-mx-2 md:items-center md:flex">
                  <div className="flex-1 px-2">
                    <label className="block mb-2 text-sm text-black dark:text-gray-200">
                      First Name
                    </label>
                    <input
                      ref={firstNameRef}
                      type="text"
                      placeholder="John"
                      className="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700  focus:outline-none focus:placeholder:opacity-0 focus:transition-opacity "
                    />
                  </div>

                  <div className="flex-1 px-2 mt-4 md:mt-0">
                    <label className="block mb-2 text-sm text-black dark:text-gray-200">
                      Last Name
                    </label>
                    <input
                      ref={lastNameRef}
                      type="text"
                      placeholder="Doe"
                      className="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700  focus:outline-none focus:placeholder:opacity-0 focus:transition-opacity "
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block mb-2 text-sm text-black dark:text-gray-200">
                    Email address
                  </label>
                  <input
                    ref={emailRef}
                    type="text"
                    placeholder="johndoe@example.com"
                    className="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700  focus:outline-none focus:placeholder:opacity-0 focus:transition-opacity "
                  />
                </div>

                <div className="w-full mt-4">
                  <label className="block mb-2 text-sm text-black dark:text-gray-200">
                    Message
                  </label>
                  <textarea
                    ref={textAreaRef}
                    className="block w-full min-h-[calc(55px)] h-32 px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg md:h-56 dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700  focus:outline-none focus:placeholder:opacity-0 focus:transition-opacity "
                    placeholder="Message"
                  ></textarea>
                </div>

                <button type="submit" className=" font-sans text-base w-full px-6 py-3 mt-4 font-semibold tracking-wide text-white capitalize transition-colors duration-300 transform rounded-lg bg-gradient-to-r from-red-500 to-yellow-400 focus:outline-none focus:placeholder:opacity-0 focus:transition-opacity ">
                  Send message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactUs;
