import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Saveslider } from "../../Redux/Slices/SliderSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";

function Slider() {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    formData.append("status", status);
    dispatch(Saveslider(formData))
      .unwrap()
      .then((result) => {
        if (result.error) {
          toast.error(result.error[Object.keys(result.error)[0]][0]);
        } else {
          toast.success("Slider saved successfully.");
        }
        setTitle("");
        setDescription("");
        setImage(null);
        setStatus(false);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full	px-5 mx-auto mt-14 ">
        <div class="bg-gray-100 p-4">
          <h2 class="text-2xl font-bold text-gray-800">Add New Slider</h2>
          <p class="text-gray-600">
          Add a new slider to showcase content
  
            </p>
        </div>
        <div className=" rounded  divide-orange-500 border-gray-500 mt-8 w-3/4 mx-auto ">
          <form onSubmit={handleSubmit}>
            <div className="mt-8 grid lg:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="title"
                  className="text-sm text-gray-700 block mb-1 font-medium"
                >
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="text-sm text-gray-700 block mb-1 font-medium"
                >
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="images"
                  className="text-sm text-gray-700 block mb-1 font-medium"
                >
                  Images
                </label>
                <input
                  type="file"
                  name="images"
                  id="image"
                  onChange={(event) => setImage(event.target.files[0])}

                  className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                  multiple
                />
              </div>
              <div>
                <div className="flex items-center pl-3">
                  <input
                    id="status"
                    type="checkbox"
                    value={status}
                    name="status"
                    onChange={(event) => setStatus(event.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    htmlFor="status"
                    className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Status
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-start space-x-4 mt-8">
              <button
                type="submit"
                className="py-2 px-4 bg-orange-500 text-white rounded hover:bg-orange-700 active:bg-orange-700 disabled:opacity-50"
              >
                Save
              </button>
              <button
                type="reset"
                onClick={() => {
                  setTitle("");
                  setDescription("");
                  setImage(null);
                  setStatus(false);
                }}
                className="py-2 px-4 bg-white border border-gray-200 text-gray-600 rounded hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  );
}

export default Slider;