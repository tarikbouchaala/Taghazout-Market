import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetSettings, Savesetting } from "../../Redux/Slices/SettingSlice";
import Sidebar from "./Sidebar";

function Settings() {
  const [websiteName, setWebsiteName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.Setting);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("website_name", websiteName);
    formData.append("website_url", websiteUrl);
    formData.append("adress", address);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("facebook", facebook);
    formData.append("instagram", instagram);
    formData.append("twitter", twitter);
    dispatch(Savesetting(formData))
      .unwrap()
      .then((result) => {
        if (result.error) {
          toast.error("somthing went wrong");
        } else {
          toast.success("settings Saved successfully!");
        }
      })
      .catch((reject) => {
        toast.error(reject);
      })

  };




  useEffect(() => {
    if (settings) {
      setWebsiteName(settings.website_name || "");
      setWebsiteUrl(settings.website_url || "");
      setAddress(settings.adress || "");
      setPhone(settings.phone || "");
      setEmail(settings.email || "");
      setFacebook(settings.facebook || "");
      setInstagram(settings.instagram || "");
      setTwitter(settings.twitter || "");
    }
  }, [settings]);

  useEffect(() => {
    dispatch(GetSettings())
  }, [dispatch])
  // console.log('settings',settings)

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full	px-5 mx-auto mt-14 ">

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-3 pb-4 ">
          <div className=" bg-gray-100 p-4">
            <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
            <p className="text-gray-600 mt-1">
              {" "}
              Manage your website settings
            </p>
          </div>

            <div className="p-8 rounded border  shadow-xl ">
              <h1 className="  font-medium text-3xl  bg-gradient-to-r from-red-500 to-yellow-400  text-white ps-4 rounded-lg py-1 ">
                Website-informations
              </h1>
              <div className="mt-8 grid lg:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm text-gray-700 block mb-1 font-medium"
                  >
                    website Name
                  </label>
                  <input
                    type="text"
                    name="name-web"
                    id="name"
                    className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                    value={websiteName}
                    onChange={(e) => setWebsiteName(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="web-url"
                    className="text-sm text-gray-700 block mb-1 font-medium"
                  >
                    web-url
                  </label>
                  <input
                    type="text"
                    name="web-url"
                    id="web-url"
                    className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-8 grid lg:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="adresse"
                    className="text-sm text-gray-700 block mb-1 font-medium"
                  >
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="adresse"
                    id="adresse"
                    className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="text-sm text-gray-700 block mb-1 font-medium"
                  >
                    phone
                  </label>
                  <input
                    type="number"
                    name="phone"
                    id="phone"
                    className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm text-gray-700 block mb-1 font-medium"
                  >
                    email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {/* border  divide-orange-500 */}
            <div className="   p-8 border  shadow-xl w-50  ">
              <h1 className="font-medium text-3xl  bg-gradient-to-r from-red-500 to-yellow-400   text-white ps-4 rounded-lg py-1 ">
                Website social media
              </h1>

              <div className="mt-8 grid lg:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="facebook"
                    className="text-sm text-gray-700 block mb-1 font-medium"
                  >
                    Facebook
                  </label>
                  <input
                    type="text"
                    name="facebook"
                    id="facebook"
                    className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="instagram"
                    className="text-sm text-gray-700 block mb-1 font-medium"
                  >
                    Instagram
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    id="instagram"
                    className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="twitter"
                    className="text-sm text-gray-700 block mb-1 font-medium"
                  >
                    Twitter
                  </label>
                  <input
                    type="text"
                    name="twitter"
                    id="twitter"
                    className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                  />
                </div>

              </div>
              <button
                type="submit"
                className="mt-8 bg-gradient-to-r from-red-500 to-yellow-400  py-2 px-4 text-white rounded hover:bg-orange-600"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

  );
}

export default Settings;
