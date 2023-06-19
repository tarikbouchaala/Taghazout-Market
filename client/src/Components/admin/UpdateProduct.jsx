import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { GetCategories } from "../../Redux/Slices/CategorySlice";
import {
  DeleteProductImage,
  GetProducts,
  UpdateProduct,
  UpdateProductImage,
  updateProductItem,
} from "../../Redux/Slices/ProductSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";

function UpdateProducts() {
  const [isOpen, SetOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [DeletedImage, SetDeletedImage] = useState(null);
  const [file, setFile] = useState(null);

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Products } = useSelector((state) => state.Product);
  const { Categories } = useSelector((state) => state.Category);

  const [currentProduct, setCurrentProduct] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    originalPrice: "",
    slug: "",
    sellingPrice: "",
    description: "",
    quantity: "",
    trending: 0,
    featured: 0,
    status: 0,
    images: [],
  });
  const [category_id, setcategory_id] = useState("");

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      setFormData((prevData) => ({ ...prevData, [name]: checked ? 1 : 0 }));
    } else if (type === "select-one") {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: e.target.files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = new FormData();
    updatedProduct.append("name", formData.name || currentProduct.name);
    updatedProduct.append("slug", formData.slug || currentProduct.slug);
    updatedProduct.append(
      "original_price",
      formData.originalPrice || currentProduct.originalPrice
    );
    updatedProduct.append(
      "selling_price",
      formData.sellingPrice || currentProduct.sellingPrice
    );
    updatedProduct.append(
      "description",
      formData.description || currentProduct.description
    );

    updatedProduct.append(
      "quantity",
      formData.quantity || currentProduct.quantity
    );
    updatedProduct.append(
      "category_id",
      category_id || currentProduct.category_id
    );
    updatedProduct.append("status", formData.status || currentProduct.status);
    updatedProduct.append(
      "trending",
      formData.trending || currentProduct.trending
    );
    updatedProduct.append(
      "featured",
      formData.featured || currentProduct.featured
    );
    // updatedProduct.append("images", formData.images || currentProduct.images);


    if (formData.images) {
      for (let i = 0; i < formData.images.length; i++) {
        updatedProduct.append(`image[${i}]`, formData.images[i]);
      }

    }

    updatedProduct.append("_method", "PATCH");

    dispatch(updateProductItem({ id, updatedProduct }))
      .unwrap()
      .then((result) => {
        console.log('resault', result)
        if (result.error) {
          const firstError = result.error[Object.keys(result.error)[0]][0];
          toast.error(firstError);
        } else {
          toast.success("Product updated successfully");
          navigate('/dashboard/admin/products')
        }
      })
      .catch((reject) => {
        console.log("reject", reject);
        // toast.error(reject);
      });
  };

  const DeleteImage = (image) => {
    dispatch(DeleteProductImage(image))
      .unwrap()
      .then((result) => {
        toast.success("Image  Deleted successfully!");
      })
      .catch((reject) => {
        toast.error(reject);
      });
  };

  useEffect(() => {
    dispatch(GetProducts());
    dispatch(GetCategories());
  }, [dispatch]);

  useEffect(() => {
    if (Products.length > 0) {
      const product = Products.find((product) => product.id == id);

      setCurrentProduct(product);

      currentProduct &&
        setFormData({
          name: currentProduct.name || "",
          originalPrice: currentProduct.original_price || "",
          slug: currentProduct.slug || "",
          sellingPrice: currentProduct.selling_price || "",
          description: currentProduct.description || "",
          quantity: currentProduct.quantity || "",
          trending: currentProduct.trending || 0,
          featured: currentProduct.featured || 0,
          status: currentProduct.status || 0,
        });
      setcategory_id(currentProduct.category_id);
    }
  }, [currentProduct, Products, id]);


  //  ------------------------------update product image--------------------------------

  const handleProductImageUpdateChange = (event) => {
    const image = event.target.files[0];
    setFile(event.target.files[0]);
    setSelectedImage(URL.createObjectURL(image));
  };
  const handelCose = () => {
    SetOpen(false);
    setSelectedImage(null);
  };
  const handelOpen = (image) => {
    SetOpen(true);
    SetDeletedImage(image);
  };
  const handelUpdateProductImage = () => {
    if (!file) {
      toast.error("Please select an image file");
      return;
    }
    else {

      const formData2 = new FormData();
      formData2.append("image", file);
      formData2.append("_method", "PATCH");

      const id = DeletedImage.id;
      dispatch(UpdateProductImage({ id, formData2 }))
        .unwrap()
        .then((result) => {
          toast.success("image updated   successfully!");
          SetOpen(false);
          setSelectedImage(null);
        })
        .catch((reject) => {
          toast.error(reject);
          SetOpen(false);
          setSelectedImage(null);
        });
    }
  };
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-3/4	px-5 mx-auto mt-24">
        <div className="p-8 rounded border border-gray-200">
          <h1 className="font-sans   center text-3xl font-semibold ">
            {" "}
            Add Product
          </h1>
          <form onSubmit={handleSubmit}>
            {" "}
            <div className="mt-8 grid lg:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name-product"
                  className="text-sm text-gray-700 block mb-1 font-medium"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor="original-price"
                  className="text-sm text-gray-700 block mb-1 font-medium"
                >
                  original price
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  id="originalPrice"
                  className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor="slug-product"
                  className="text-sm text-gray-700 block mb-1 font-medium"
                >
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  id="slug-product"
                  className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                  value={formData.slug}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor="selling-price"
                  className="text-sm text-gray-700 block mb-1 font-medium"
                >
                  selling price
                </label>
                <input
                  type="number"
                  name="sellingPrice"
                  id="selling-price"
                  className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                  value={formData.sellingPrice}
                  onChange={handleInputChange}
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
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  className="text-sm text-gray-700 block mb-1 font-medium"
                >
                  quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                  value={formData.quantity}
                  onChange={handleInputChange}
                />
              </div>
              <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                  <div className="flex items-center pl-3">
                    <input
                      id="vue-checkbox-list"
                      type="checkbox"
                      name="trending"
                      value="1"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      onChange={handleInputChange}
                      checked={formData.trending === 1}
                    />
                    <label
                      htmlFor="vue-checkbox-list"
                      className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      trending
                    </label>
                  </div>
                </li>
                <li className="w-full dark:border-gray-600">
                  <div className="flex items-center pl-3">
                    <input
                      id="laravel-checkbox-list"
                      type="checkbox"
                      value="1"
                      name="featured"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      onChange={handleInputChange}
                      checked={formData.featured === 1}
                    />
                    <label
                      htmlFor="laravel-checkbox-list"
                      className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      featured
                    </label>
                  </div>
                </li>
                <li className="w-full dark:border-gray-600">
                  <div className="flex items-center pl-3">
                    <input
                      id="status"
                      type="checkbox"
                      value="1"
                      name="status"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      onChange={handleInputChange}
                      checked={formData.status === 1}
                    />
                    <label
                      htmlFor="status"
                      className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      status
                    </label>
                  </div>
                </li>
              </ul>
              <div>
                <label
                  name="id-product"
                  className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Category
                </label>

                <select
                  id="categoryId"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => setcategory_id(e.target.value)}
                >
                  {Categories &&
                    Categories.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                        selected={item.id === category_id}
                      >
                        {item.name}
                      </option>
                    ))}
                </select>
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
                  name="image-product"
                  id="image"
                  className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                  onChange={handleImageChange}
                />
              </div>
              <div></div>
            </div>
            <div className="space-x-4 mt-8">
              <button
                type="submit"
                className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50"
              >
                Save
              </button>
              <button onClick={e => navigate('/dashboard/admin/products')} className="py-2 px-4 bg-white border border-gray-200 text-gray-600 rounded hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50">
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="mb-9 mt-4 ">
          <h1 className="mb-8 font-sans   center text-xl font-semibold ">
            Product Images
          </h1>
          <div className="flex flex-wrap gap-4 justify-evenly">
            {currentProduct.images &&
              currentProduct.images.map((image) => (
                <div
                  key={image.id}
                  className="w-1/2 md:w-1/4 lg:w-1/5 xl:w-1/6 bg-white   dark:bg-gray-800 dark:border-gray-700"
                >
                  <img
                    className="rounded-t-lg"
                    src={image.image}
                    alt="product"
                  />
                  <div className="flex justify-end   ml-2 font-medium  hover:underline ">
                    <div className="flex">
                      <button className="text-emerald-500" onClick={() => handelOpen(image)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </button>
                      <button
                        className="text-red-600 dark:text-red-500"
                        onClick={() => {
                          DeleteImage(image);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50  overflow-y-auto ">
          <div className="fixed inset-0 bg-slate-900/25 backdrop-blur transition-opacity opacity-100 "></div>
          <div className="flex items-center justify-center  min-h-screen p-4 ">
            <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5 h-96">
              <button
                type="button"
                className=" mb-2 text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={handelCose}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>

              <div className="flex items-center justify-center w-full mt-5">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Selected "
                    width="200"
                    className="h-64"
                  />
                ) : (
                  <label
                    for="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        aria-hidden="true"
                        className="w-10 h-10 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    {/* <input
                      id="dropzone-file"
                      type="file"
                      className=""
                      onChange={(event) => setFile(event.target.files[0])}
                    /> */}
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={handleProductImageUpdateChange}
                    />
                  </label>
                )}
              </div>

              <div className="flex justify-center items-center space-x-4 absolute  bottom-0 mx-auto">
                <button
                  onClick={handelCose}
                  type="button"
                  className="mb-2 right-0 py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Cancel
                </button>

                <button
                  onClick={handelUpdateProductImage}
                  type="submit"
                  className=" mb-2 py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateProducts;
