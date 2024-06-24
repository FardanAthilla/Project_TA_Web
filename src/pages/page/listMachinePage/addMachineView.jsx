import React, { useState } from "react";
import Sidebar from "../../../components/sidebar";
import { addMachine } from "../../../service/fetchapi";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const AddMachineView = () => {
  const [machineData, setMachineData] = useState({
    store_items_name: "",
    quantity: "",
    category_machine_id: "",
    price: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMachineData({
      ...machineData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await addMachine(machineData);
      setMessage(result.success ? "Mesin berhasil ditambahkan!" : result.message);
      if (result.success) {
        navigate(-1);
      }
    } catch (error) {
      setMessage("Gagal menambahkan mesin.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setMachineData({
      store_items_name: "",
      quantity: "",
      category_machine_id: "",
      price: "",
    });
    setMessage("");
  };

  return (
    <div className="container-fluid flex">
      <Sidebar />
      <div className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
        <form onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-base font-semibold leading-7 text-gray-900 flex items-center mb-5"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Kembali
              </button>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Tambah Mesin
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Informasi ini akan digunakan untuk menambah mesin baru.
              </p>

              {message && (
                <div className="mb-4 text-center text-red-500">{message}</div>
              )}

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="store_items_name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Nama Mesin
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="store_items_name"
                      id="store_items_name"
                      value={machineData.store_items_name}
                      onChange={handleChange}
                      autoComplete="store_items_name"
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Jumlah
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      value={machineData.quantity}
                      onChange={handleChange}
                      autoComplete="quantity"
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="category_machine_id"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    ID Kategori Mesin
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="category_machine_id"
                      id="category_machine_id"
                      value={machineData.category_machine_id}
                      onChange={handleChange}
                      autoComplete="category_machine_id"
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Harga
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="price"
                      id="price"
                      value={machineData.price}
                      onChange={handleChange}
                      autoComplete="price"
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 mt-5 bg-red-600 hover:bg-red-700 rounded-lg text-white shadow-lg transform transition-transform duration-200 hover:scale-110"
              >
                Batal
              </button>

              <button
                type="submit"
                className="px-6 py-3 mt-5 bg-gradient-to-r from-purple-500 to-indigo-700 hover:from-indigo-600 hover:to-purple-800 rounded-lg text-white shadow-lg transform transition-transform duration-200 hover:scale-110 glow-button"
              >
                {isLoading ? "Loading..." : "Tambah"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMachineView;
