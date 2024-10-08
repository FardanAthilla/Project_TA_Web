import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/sidebar";
import { addMachine, fetchCategory } from "../../../service/fetchapi";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const AddMachineView = () => {
  const [machineData, setMachineData] = useState({
    store_items_name: "",
    quantity: "",
    category_id: "",
    price: "",
  });

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const [fade, setFade] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchCategory();
        setCategories(data.Data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const formatPrice = (value) => {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      setMachineData({
        ...machineData,
        [name]: formatPrice(value),
      });
    } else {
      setMachineData({
        ...machineData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !machineData.store_items_name ||
      !machineData.quantity ||
      !machineData.category_id ||
      !machineData.price
    ) {
      setSnackbar({
        visible: true,
        message: "Semua field harus diisi.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const dataToSend = {
        ...machineData,
        quantity: parseInt(machineData.quantity, 10),
        category_id: parseInt(machineData.category_id, 10),
        price: parseInt(machineData.price.replace(/\./g, ""), 10),
      };
      console.log("Sending data:", dataToSend);
      const result = await addMachine(dataToSend);
      console.log("Result from API:", result);
      const isSuccess = result.Succes === "Succes Create Store Items";
      setSnackbar({
        visible: true,
        message: isSuccess
          ? "Mesin berhasil ditambahkan!"
          : result.message || "Gagal menambahkan mesin.",
        type: isSuccess ? "success" : "error",
      });
      if (isSuccess) {
        setTimeout(() => navigate(-1), 1500);
      }
    } catch (error) {
      setSnackbar({
        visible: true,
        message: "Gagal menambahkan mesin.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setMachineData({
      store_items_name: "",
      quantity: "",
      category_id: "",
      price: "",
    });
  };

  useEffect(() => {
    if (snackbar.visible) {
      setFade(true);
      const timer = setTimeout(() => {
        setFade(false);
        setTimeout(() => {
          setSnackbar({ visible: false, message: "", type: "" });
        }, 500);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar]);

  return (
    <div className="container-fluid flex">
      <Sidebar />
      <div className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
        {snackbar.visible && (
          <div
            role="alert"
            className={`alert ${
              snackbar.type === "success" ? "alert-success" : "alert-error"
            } fixed top-4 w-96 mx-auto z-20 transition-opacity duration-500 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              {snackbar.type === "success" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>
            <span>{snackbar.message}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-base font-semibold leading-7 flex items-center mb-5"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Kembali
              </button>
              <h2 className="text-base font-semibold leading-7">
                Tambah Mesin
              </h2>
              <p className="mt-1 text-sm leading-6">
                Informasi ini akan digunakan untuk menambah mesin baru.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="store_items_name"
                    className="block text-sm font-medium leading-6"
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
                      className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium leading-6"
                  >
                    Jumlah Stok
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      value={machineData.quantity}
                      onChange={handleChange}
                      autoComplete="quantity"
                      className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="category_id"
                    className="block text-sm font-medium leading-6"
                  >
                    Kategori Mesin
                  </label>
                  <div className="mt-2">
                    <div className="dropdown dropdown-hover w-full">
                      <div
                        tabIndex={0}
                        role="button"
                        className="btn w-full"
                        style={{ minWidth: "200px" }}
                      >
                        {machineData.category_id !== ""
                          ? categories.find(
                              (c) =>
                                c.category_id ===
                                parseInt(machineData.category_id)
                            )?.category_name
                          : "Pilih Kategori"}
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full"
                      >
                        <li key="all"></li>
                        {categories.map((category) => (
                          <li key={category.category_id}>
                            <a
                              onClick={() =>
                                handleChange({
                                  target: {
                                    name: "category_id",
                                    value: category.category_id,
                                  },
                                })
                              }
                            >
                              {category.category_name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium leading-6"
                  >
                    Harga
                  </label>
                  <div className="mt-2 flex items-center">
                    <span className="mr-2 text-sm text-gray-500">Rp</span>
                    <input
                      type="text"
                      name="price"
                      id="price"
                      value={machineData.price}
                      onChange={handleChange}
                      autoComplete="price"
                      className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                Bersihkan
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
