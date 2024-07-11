import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar";
import { fetchCategoryMachine, deleteCategoryMachine } from "../../../service/fetchapi";
import { Link } from "react-router-dom";
import { TrashIcon, PencilIcon } from "@heroicons/react/20/solid";

const ListCategoryView = () => {
  const [machineCategories, setMachineCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPageMachine, setCurrentPageMachine] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    const getCategoryMachine = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchCategoryMachine();
        setMachineCategories(data.Data);
      } catch (error) {
        setError("Gagal mengambil data kategori mesin");
        setMachineCategories([]);
      } finally {
        setLoading(false);
      }
    };

    getCategoryMachine();
  }, []);

  const handleDelete = (id) => {
    setSelectedCategoryId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await deleteCategoryMachine(selectedCategoryId);
      setMachineCategories(machineCategories.filter((category) => category.category_machine_id !== selectedCategoryId));
    } catch (error) {
      setError("Gagal menghapus kategori");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategoryId(null);
  };

  const paginateMachine = (pageNumber) => {
    setCurrentPageMachine(pageNumber);
  };

  const indexOfLastItemMachine = currentPageMachine * itemsPerPage;
  const indexOfFirstItemMachine = indexOfLastItemMachine - itemsPerPage;
  const currentMachineItems = machineCategories.slice(
    indexOfFirstItemMachine,
    indexOfLastItemMachine
  );

  const totalPages = Math.ceil(machineCategories.length / itemsPerPage);

  return (
    <div className="container-fluid flex">
      <Sidebar />
      <div className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
        {loading ? (
          <div className="text-center">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        ) : error ? (
          <p className="text-center">{error}</p>
        ) : (
          <>
            <h2 className="mt-8 text-lg">Kategori Mesin</h2>
            {machineCategories.length === 0 ? (
              <p className="text-center">Kategori tidak ditemukan</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Kategori</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMachineItems.map((category, index) => (
                    <tr key={category.category_machine_id}>
                      <td>{indexOfFirstItemMachine + index + 1}</td>
                      <td>{category.category_machine_name}</td>
                      <td>
                        <button className="btn btn-ghost btn-xs">
                          <PencilIcon className="h-5 w-5 text-blue-500" />
                        </button>
                        <button className="btn btn-ghost btn-xs text-red-600" onClick={() => handleDelete(category.category_machine_id)}>
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="flex justify-center mt-4">
              <div className="join pt-5">
                <button
                  className="join-item btn"
                  onClick={() => paginateMachine(currentPageMachine - 1)}
                  disabled={currentPageMachine === 1}
                >
                  «
                </button>
                {Array.from({
                  length: totalPages,
                }).map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={index}
                      onClick={() => paginateMachine(pageNumber)}
                      className={`join-item btn ${
                        pageNumber === currentPageMachine ? "active" : ""
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                <button
                  className="join-item btn"
                  onClick={() => paginateMachine(currentPageMachine + 1)}
                  disabled={currentPageMachine === totalPages}
                >
                  »
                </button>
              </div>
            </div>
            <div className="inline-block">
              <Link to="/AddCategory">
                <button className="px-6 py-3 mt-5 bg-gradient-to-r from-purple-500 to-indigo-700 hover:from-indigo-600 hover:to-purple-800 rounded-lg text-white shadow-lg transform transition-transform duration-200 hover:scale-110">
                  Tambah Data
                </button>
              </Link>
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div
          id="static-modal"
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
        >
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Konfirmasi Penghapusan
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 p-1 rounded-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400">
                Apa kamu yakin menghapus data ini? Setelah dihapus, tidak dapat
                dikembalikan.
              </p>
            </div>
            <div className="flex justify-end p-4 border-t dark:border-gray-600">
              <button
                onClick={closeModal}
                className="py-2 px-4 mr-3 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="py-2 px-4 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListCategoryView;
