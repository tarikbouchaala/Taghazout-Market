import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GetCategories } from "../../Redux/Slices/CategorySlice";
import { useDispatch } from "react-redux";
import { GetProducts, SaveProduct } from "../../Redux/Slices/ProductSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";


function Product() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Categories } = useSelector((state) => state.Category);
  const [Category_id, setcategory_id] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    originalPrice: "",
    slug: "",
    sellingPrice: 0,
    description: "",
    quantity: 0,
    trending: 0,
    featured: 0,
    status: 0,
    images: [],
  });

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

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setFormData((prevData) => ({ ...prevData, images: [...prevData.images, ...files] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const Product = new FormData();
    Product.append("name", formData.name);
    Product.append("slug", formData.slug);
    Product.append("original_price", formData.originalPrice);
    Product.append("selling_price", formData.sellingPrice);
    Product.append("description", formData.description);

    Product.append("quantity", formData.quantity);
    Product.append("category_id", Category_id);
    Product.append("images", formData.images);
    Product.append("status", formData.status);
    Product.append("trending", formData.trending);
    Product.append("featured", formData.featured);
    Product.append("image", formData.images);

    for (let i = 0; i < formData.images.length; i++) {
      Product.append(`image[${i}]`, formData.images[i]);
    }

    dispatch(SaveProduct(Product))
      .unwrap()
      .then((result) => {
        if (result.error) {
          const firstError = result.error[Object.keys(result.error)[0]][0];
          toast.error(firstError);
        } else {
          toast.success("Product added successfully!");

          setFormData({
            name: "",
            originalPrice: "",
            slug: "",
            sellingPrice: "",
            description: 0,
            quantity: 0,
            trending: 0,
            featured: 0,
            status: 0,
            images: [],
          });
          setcategory_id('');
          navigate('/dashboard/admin/products')
        }
      })
      .catch((reject) => {
        toast.error(reject);
      })
  };

  useEffect(() => {
    dispatch(GetCategories())
    dispatch(GetProducts())
  }, [dispatch])

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-3/4	px-5 mx-auto mt-24">
        <div className="p-8 rounded border border-gray-200">
          <h1 className="font-medium   center text-3xl">Product</h1>
          <form onSubmit={handleSubmit}>
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
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor="original-price"
                  className="text-sm text-gray-700 block mb-1 font-medium"
                >
                  Original price
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
                  Selling price
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
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  id="description"
                  className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                  value={formData.description}
                  onChange={handleInputChange} />
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  className="text-sm text-gray-700 block mb-1 font-medium"
                >
                  Quantity
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
                      Trending
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
                      Featured
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
                      Hidden
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
                  <option value="" selected >
                    Choose a category
                  </option>
                  {
                    Categories && Categories.map(item => (
                      <option key={item.id} value={item.id} selected={formData.categoryId === item.id} >
                        {item.name}
                      </option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="text-sm text-gray-700 block mb-1 font-medium"
                >
                  Image
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
      </div>
    </div>

  );
}

export default Product;
