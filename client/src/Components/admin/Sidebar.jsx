import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BiCategory } from "react-icons/bi";
import { BsBag } from "react-icons/bs";

import {
  BsArrowLeftShort,
  BsChevronDown,
  BsFillCartCheckFill,
  BsSliders2Vertical,
  BsBagFill,
  BsPerson,
} from "react-icons/bs";
import { RiDashboard3Fill, RiCoupon4Line } from "react-icons/ri";
import {
  AiOutlineFileText,
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineOrderedList,
  AiOutlineSearch,
  AiOutlineSetting,
  AiOutlineSliders,
  AiOutlineProfile,
  AiOutlineLogout,
} from "react-icons/ai";
import { NavLink } from "react-router-dom";
// import logo from '../assets/Images/logo.png'
import logo from "../../assets/Images/logo.png";

const SideBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpencateg, setDropdownOpencateg] = useState(false);
  const [dropdownOpenslider, setDropdownOpenslider] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleDropdowncateg = () => {
    setDropdownOpencateg(!dropdownOpencateg);
  };

  const toggleDropdownslider = () => {
    setDropdownOpenslider(!dropdownOpenslider);
  };

  const toggleSidebar = () => {
    console.log("sidebarOpen", sidebarOpen);
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ml-3 mt-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        onClick={toggleSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>
      <div className={`${sidebarOpen ? "" : "hidden"} md:block`}>
        <aside
          className="border-r shadow-lg border-b-0  top-0 left-0 z-10 bg-white min-h-[calc(100vh)]"
          // className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          //   sidebarOpen ? "" : "-translate-x-full sm:translate-x-0"
          // }`}
        >
          <div className="w-56 h-full px-6 pl-4 pt-12 overflow-y-auto  dark:bg-gray-800">
            <div href="#" className="mx-auto">
              <NavLink to="/">
                <img className="w-auto h-6 sm:h-7 mx-auto" src={logo} alt="" />
              </NavLink>
            </div>
            <ul className="space-y-2 font-medium">
              <li>
                <div className="flex items-center p-2 mt-5 text-gray-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="text-2xl block float-left">
                    <RiDashboard3Fill />{" "}
                  </div>
                  <Link to="/dashboard/admin" className="ml-3 mt-2">
                    Dashboard
                  </Link>
                </div>
              </li>{" "}
              <li>
                <div className="flex items-center p-2 text-gary-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="text-2xl block float-left">
                    <AiOutlineOrderedList />{" "}
                  </div>

                  {/* <Link to="/Orders"> </Link>  */}
                  <Link to="/dashboard/admin/orders" className="ml-3 mt-2 ">
                    Orders
                  </Link>
                </div>
              </li>
              <li>
                <button
                  type="button"
                  className="flex items-center w-full p-2 text-gary-600 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  aria-controls="dropdown-example"
                  data-collapse-toggle="dropdown-example"
                  onClick={toggleDropdown}
                >
                  <div className="text-2xl block float-left">
                    <BsBag />{" "}
                  </div>

                  <Link
                    to="/dashboard/admin/products"
                    className="flex-1 ml-3 mt-2 text-left whitespace-nowrap"
                    sidebar-toggle-item="true"
                  >
                    Products
                  </Link>
                  <svg
                    sidebar-toggle-item="true"
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
                {dropdownOpen && (
                  <ul id="dropdown-example" className="py-2 space-y-2">
                    <li>
                      <Link to="/dashboard/admin/products/add">
                        <div className="flex items-center w-full p-2 text-gary-600 text-xs transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                          Add Product
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/dashboard/admin/products">
                        <div className="flex items-center w-full p-2 text-gary-600 text-xs transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                          All products
                        </div>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <button
                  type="button"
                  className="flex items-center w-full p-2 text-gary-600 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  aria-controls="dropdown-example"
                  data-collapse-toggle="dropdown-example"
                  onClick={toggleDropdowncateg}
                >
                  <div className="text-2xl block float-left">
                    <BiCategory />{" "}
                  </div>

                  <Link
                    className="flex-1 ml-3 mt-2 text-left whitespace-nowrap"
                    sidebar-toggle-item="true"
                    to="/dashboard/admin/category"
                  >
                    Category
                  </Link>
                  <svg
                    sidebar-toggle-item="true"
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
                {dropdownOpencateg && (
                  <ul id="dropdown-example" className="py-2 space-y-2">
                    <li>
                      <Link to="/dashboard/admin/category/add">
                        <div className="flex items-center w-full p-2 text-gary-600 transition duration-75 text-xs rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                          Add Category
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/dashboard/admin/category">
                        <div className="flex items-center w-full p-2 text-gary-600 transition duration-75 text-xs rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                          All Category
                        </div>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <div className="flex items-center p-2 text-gary-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="text-2xl block float-left">
                    <RiCoupon4Line />{" "}
                  </div>
                  {/* <Link to="/Coupon"></Link> */}

                  <Link
                    to="/dashboard/admin/coupon"
                    className="flex-1 ml-3 mt-2 whitespace-nowrap"
                  >
                    Coupon
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center p-2 text-gary-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="text-2xl block float-left">
                    <AiOutlineUser />{" "}
                  </div>
                  {/* <Link to="/users"></Link> */}

                  <Link
                    className="flex-1 ml-3 mt-2 whitespace-nowrap"
                    to="/dashboard/admin/users"
                  >
                    Users
                  </Link>
                </div>
              </li>
              <li>
                <button
                  type="button"
                  className="flex items-center w-full p-2 text-gary-600 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  aria-controls="dropdown-example"
                  data-collapse-toggle="dropdown-example"
                  onClick={toggleDropdownslider}
                >
                  <div className="text-2xl block float-left">
                    <AiOutlineSliders />{" "}
                  </div>

                  <Link
                    className="flex-1 ml-3 mt-2 text-left whitespace-nowrap"
                    sidebar-toggle-item="true"
                    to="/dashboard/admin/slider"
                  >
                    Slider
                  </Link>
                  <svg
                    sidebar-toggle-item="true"
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
                {dropdownOpenslider && (
                  <ul id="dropdown-example" className="py-2 space-y-2">
                    <li>
                      <Link to="/dashboard/admin/slider/add">
                        <div className="flex items-center w-full p-2 text-gary-600 text-xs transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                          Add Slider
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/dashboard/admin/slider">
                        <div className="flex items-center w-full p-2 text-gary-600 transition text-xs duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                          All Slider
                        </div>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li></li>
              <li>
                <div className="flex items-center p-2 text-gary-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="text-2xl block float-left">
                    <AiOutlineSetting />
                  </div>
                  <Link
                    to="/dashboard/admin/settings"
                    className="flex-1 ml-3 mt-2 whitespace-nowrap"
                  >
                    Settings
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SideBar;
