import React from "react";

function UpdateSlider() {
  return (
    <div className="flex justify-center">
      <div className="p-8  rounded border divide-orange-500 border-orange-500  mt-20 mx-20 w-1/2">
        <h1 className="font-medium bg-orange-500 text-3xl text-white text-center py-4">
          {" "}
          Update Slider
        </h1>
        <form>
          {" "}
          <div className="mt-8 grid lg:grid-cols-2 gap-4">
            <div>
              <label
                for="name"
                className="text-sm text-gray-700 block mb-1 font-medium"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="name"
                className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
              />
            </div>
            <div>
              <label
                for="description"
                className="text-sm text-gray-700 block mb-1 font-medium"
              >
                description
              </label>
              <input
                type="text"
                name="description-slider"
                id="description"
                className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
              />
            </div>

            <div>
              <label
                for="image"
                className="text-sm text-gray-700 block mb-1 font-medium"
              >
                image
              </label>
              <input
                type="file"
                name="images[]"
                multiple
                id="image"
                className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
              />
            </div>
            <div>
              <div className="flex items-center pl-3">
                <input
                  id="vue-checkbox-list"
                  type="checkbox"
                  value=""
                  name="status-slider"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                />
                <label
                  for="vue-checkbox-list"
                  className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  status
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="submit"
              className="py-2 px-4 bg-orange-500 text-white rounded hover:bg-orange-700 active:bg-orange-700  disabled:opacity-50"
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
  );
}

export default UpdateSlider;
