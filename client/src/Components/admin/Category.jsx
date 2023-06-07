import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { GetCategories, SaveCategory } from "../../Redux/Slices/CategorySlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";


function Category() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState("0");
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("slug", slug);
    formData.append("image", image);
    formData.append("status", status);


    dispatch(SaveCategory(formData))
      .unwrap()
      .then((result) => {
        if (result.error) {
          toast.error(result.error[Object.keys(result.error)[0]][0]);
          // toast.error(result.error[Object.keys(error)[0]][0]);
        } else {
          toast.success("Category added successfully!");
          setName('');
          setDescription('');
          setSlug('');
          setImage('');
          setStatus("0");
          navigate('/dashboard/admin/category')
        }
      })
      .catch((reject) => {
        console.log('regicted', reject)
        toast.error(reject);
      })
  };

  useEffect(() => {
    dispatch(GetCategories())
  }, [dispatch])
  console.log('image', image)
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-3/4	px-5 mx-auto mt-24">
        <div className="p-8 rounded border border-gray-200">
          <h1 className="font-medium text-3xl">Category</h1>
          {/* <p className="text-gray-600 mt-6">here we have the categories.</p> */}
          <form onSubmit={handleSubmit}>
            <div className="mt-8 grid lg:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="text-sm text-gray-700 block mb-1 font-medium"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="text-sm text-gray-700 block mb-1 font-medium"
                >
                  description
                </label>
                <input
                  type="text"
                  name="description"
                  id="description"
                  className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="slug"
                  className="text-sm text-gray-700 block mb-1 font-medium"
                >
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="image"
                  className="text-sm text-gray-700 block mb-1 font-medium"
                >
                  image
                </label>
                <input
                  type="file"
                  multiple
                  name="image"
                  id="image"
                  className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                  onChange={(event) => setImage(event.target.files[0])}
                />
              </div>
              <div>
                <div className="flex items-center pl-3">
                  <input
                    id="vue-checkbox-list"
                    type="checkbox"
                    value="1"
                    name="status"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"

                    checked={status === 1}
                    onChange={(event) => setStatus(event.target.checked ? 1 : 0)}
                  />
                  <label
                    htmlFor="vue-checkbox-list"
                    className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Hidden
                  </label>
                </div>
              </div>
            </div>
            <div className="space-x-4 mt-8">
              <button
                type="submit"
                className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50"
              >
                Save
              </button>
              <button className="py-2 px-4 bg-white border border-gray-200 text-gray-600 rounded hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  );
}

export default Category;