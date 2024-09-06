import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../../components/sidebar";
import { updateSparepart } from "../../../service/fetchapi";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const AdjustSparepartPage = () => {
  const location = useLocation();
  const sparepart = location.state.sparepart;

  const [quantity, setQuantity] = useState(0);  // Set initial quantity to 0
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const [fade, setFade] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quantity < 0 || quantity > sparepart.quantity) {
      setSnackbar({
        visible: true,
        message: "Jumlah stok yang dimasukkan tidak valid",
        type: "error",
      });
      return;
    }

    const newQuantity = sparepart.quantity - quantity;

    const sparepartData = {
      spare_part_id: sparepart.spare_part_id,
      quantity: newQuantity,
    };

    setIsLoading(true);

    const updateResult = await updateSparepart(sparepartData);
    if (!updateResult.success) {
      setSnackbar({
        visible: true,
        message: updateResult.message,
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    setSnackbar({
      visible: true,
      message: "Perbarui berhasil!",
      type: "success",
    });
    setIsLoading(false);
    setTimeout(() => navigate(-1), 1500);
  };

  const handleIncrement = () => {
    if (quantity < sparepart.quantity) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleInputChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0 && value <= sparepart.quantity) {
      setQuantity(value);
    }
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
    <div className="h-auto container-fluid flex">
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
                Penyesuaian Sparepart
              </h2>
              <p className="mt-1 text-sm leading-6">
                Informasi ini akan digunakan untuk memperbarui stok sparepart.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium leading-6"
                  >
                    Stok Yang Tidak Dapat Dijual
                  </label>
                  <div className="mt-2 flex items-center">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      className={`px-3 py-1 rounded-l-md ${
                        quantity > 0
                          ? "bg-red-500 text-white"
                          : "bg-red-200 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={quantity <= 0}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      value={quantity}
                      onChange={handleInputChange}
                      autoComplete="quantity"
                      className="block w-16 text-center rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mx-2"
                    />
                    <button
                      type="button"
                      onClick={handleIncrement}
                      className={`px-3 py-1 rounded-r-md ${
                        quantity < sparepart.quantity
                          ? "bg-blue-500 text-white"
                          : "bg-blue-200 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={quantity >= sparepart.quantity}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-4">
              <button
                type="submit"
                className="px-6 py-3 mt-5 bg-gradient-to-r from-purple-500 to-indigo-700 hover:from-indigo-600 hover:to-purple-800 rounded-lg text-white shadow-lg transform transition-transform duration-200 hover:scale-110 glow-button"
              >
                {isLoading ? "Loading..." : "Simpan"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdjustSparepartPage;
