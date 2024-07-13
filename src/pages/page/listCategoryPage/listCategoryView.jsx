import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar";
import { fetchCategory, deleteCategory } from "../../../service/fetchapi";
import { Link, useNavigate } from "react-router-dom";
import { TrashIcon, PencilIcon } from "@heroicons/react/20/solid";

const ListCategoryView = () => {
  const [Categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getCategory = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchCategory();
        setCategories(data.Data);
      } catch (error) {
        setError("Gagal mengambil data kategori mesin");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    getCategory();
  }, []);

  const handleDelete = (id) => {
    setSelectedCategoryId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await deleteCategory(selectedCategoryId);
      setCategories(
        Categories.filter(
          (category) => category.category_id !== selectedCategoryId
        )
      );
    } catch (error) {
      setError("Gagal menghapus kategori");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleEdit = (category) => {
    navigate("/EditCategory", { state: { category } });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategoryId(null);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Categories.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(Categories.length / itemsPerPage);

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
            <h2 className="mt-8 text-lg">Kategori</h2>
            {Categories.length === 0 ? (
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
                  {currentItems.map((category, index) => (
                    <tr key={category.category_id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{category.category_name}</td>
                      <td>
                        <button className="btn btn-ghost btn-xs">
                          <PencilIcon
                            className="h-5 w-5 text-blue-600"
                            onClick={() => handleEdit(category)}
                          />
                        </button>
                        <button
                          className="btn btn-ghost btn-xs text-red-600"
                          onClick={() => handleDelete(category.category_id)}
                        >
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
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
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
                      onClick={() => paginate(pageNumber)}
                      className={`join-item btn ${
                        pageNumber === currentPage ? "active" : ""
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                <button
                  className="join-item btn"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
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
            <div className=" p-4 border-t dark:border-gray-600 flex items-center justify-end gap-x-4">
              <button
                onClick={closeModal}
                className="px-6 py-3 mt-5 bg-red-600 hover:bg-red-700 rounded-lg text-white shadow-lg transform transition-transform duration-200 hover:scale-110"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-3 mt-5 bg-gradient-to-r from-purple-500 to-indigo-700 hover:from-indigo-600 hover:to-purple-800 rounded-lg text-white shadow-lg transform transition-transform duration-200 hover:scale-110 glow-button"
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
