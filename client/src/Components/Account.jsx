import React,{ useEffect, useState } from "react";
import CLientSideBar from "./CLientSideBar";
import Header from "../Components/Header";
import { useDispatch, useSelector } from "react-redux";
import {UpdateUser} from '../Redux/Slices/AuthSlice';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Account() {
  const [full_name, setfull_name] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setphone] = useState("");
  const [Adress, setAdress] = useState("");
  const dispatch = useDispatch();

  const { connected_user } = useSelector(state => state.Auth)
  useEffect(() => {
    if (connected_user) {
      setfull_name(connected_user.full_name || "");
      setEmail(connected_user.email || "");
      setphone(connected_user.phone || "");
      setAdress(connected_user.address || "");
    }
  }, [connected_user]);



  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("full_name", full_name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", Adress);
    formData.append("_method", "PATCH");


    dispatch(UpdateUser({ id: connected_user.id, UserData: formData })).unwrap()
    .then(result=>{
      if(result.error){
        toast.error(result.error[Object.keys(result.error)[0]][0]);
      }else{
        toast.success('Account Info Updated !', {
          position: toast.POSITION.TOP_CENTER
      });

      }
      console.log('result',result)
    }).catch(error=>{
      console.log('error',error)
    })
  };
  return (
  
      <div className="flex">
        <CLientSideBar />
        <div className="flex-1 mt-16">
          <section className="max-w-3xl p-6 mx-auto mt-auto bg-white rounded-md shadow-md dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-700 capitalize dark:text-white">
              Account settings
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                <div>
                  <label
                    className="text-gray-700 dark:text-gray-200"
                    htmlFor="full-name"
                
               >
                    full name
                  </label>
                  <input
                    id="full-name"
                    type="text"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                    value={full_name}
                    onChange={(e) => {
                      setfull_name(e.target.value);
                    }}
                  />
                </div>

                <div>
                  <label
                    className="text-gray-700 dark:text-gray-200"
                    htmlFor="emailAddress"
                  >
                    Email
                  </label>
                  <input
                    id="emailAddress"
                    type="email"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                    value={email}
                    readOnly
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>

                <div>
                  <label
                    className="text-gray-700 dark:text-gray-200"
                    htmlFor="password"
                  >
                    Address
                  </label>
                  <input
                    id="Aresse"
                    name="adresse"
                    type="text"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                    value={Adress}
                    onChange={(e) => {
                      setAdress(e.target.value);
                    }}
                 />
                </div>

                <div>
                  <label
                    className="text-gray-700 dark:text-gray-200"
                    htmlFor="phone"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="number"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                    value={phone}
                    onChange={(e) => {
                      setphone(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
                  Save
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>

  );
}
