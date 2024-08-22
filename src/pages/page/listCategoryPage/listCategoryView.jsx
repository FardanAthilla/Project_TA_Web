import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar";
import { fetchCategory, deleteCategory } from "../../../service/fetchapi";
import { Link, useNavigate } from "react-router-dom";
import {
  TrashIcon,
  PencilIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";

const ListCategoryView = () => {
  const [Categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [isDeletable, setIsDeletable] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);

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

  const handleDelete = (id, category) => {
    if (category.SparePart.length > 0 || category.StoreItems.length > 0) {
      setIsDeletable(false);
      setModalMessage(
        "Kategori ini tidak dapat dihapus karena ada barang yang menggunakan kategori ini"
      );
    } else {
      setIsDeletable(true);
      setSelectedCategoryId(id);
      setModalMessage(
        "Apa kamu yakin menghapus data ini? Setelah dihapus, tidak dapat dikembalikan."
      );
    }
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await deleteCategory(selectedCategoryId);
      const updatedCategories = Categories.filter(
        (category) => category.category_id !== selectedCategoryId
      );
      const totalPages = Math.ceil(updatedCategories.length / itemsPerPage);
      setCategories(updatedCategories);
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }
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

  const toggleExpandCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
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
                    <React.Fragment key={category.category_id}>
                      <tr>
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
                            onClick={() =>
                              handleDelete(category.category_id, category)
                            }
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                          <button
                            className="btn btn-ghost btn-xs"
                            onClick={() =>
                              toggleExpandCategory(category.category_id)
                            }
                          >
                            {expandedCategory === category.category_id ? (
                              <ChevronUpIcon className="h-5 w-5 text-green-600" />
                            ) : (
                              <ChevronDownIcon className="h-5 w-5 text-green-600" />
                            )}
                          </button>
                        </td>
                      </tr>
                      {expandedCategory === category.category_id && (
                        <tr>
                          <td colSpan="3">
                            <div className="p-4 bg-gray-100 rounded-md">
                              <h4 className="font-semibold">Mesin:</h4>
                              {category.StoreItems.length > 0 ? (
                                <ul className="list-disc list-inside">
                                  {category.StoreItems.map((item) => (
                                    <li key={item.store_items_id}>
                                      {item.store_items_name} - Jumlah:{" "}
                                      {item.quantity}, Harga: {item.price}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p>Tidak ada mesin yang tersedia.</p>
                              )}
                              <h4 className="font-semibold mt-4">Sparepart:</h4>
                              {category.SparePart.length > 0 ? (
                                <ul className="list-disc list-inside">
                                  {category.SparePart.map((part) => (
                                    <li key={part.spare_part_id}>
                                      {part.spare_part_name} - Jumlah:{" "}
                                      {part.quantity}, Harga: {part.price}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p>Tidak ada sparepart yang tersedia.</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
              <p className="text-base text-gray-500 dark:text-gray-300">
                {modalMessage}
              </p>
            </div>
            <div className="flex justify-end p-4 space-x-2 border-t dark:border-gray-600">
              <button
                onClick={closeModal}
                className="px-6 py-3 mt-5 bg-red-600 hover:bg-red-700 rounded-lg text-white shadow-lg transform transition-transform duration-200 hover:scale-110"
              >
                Batalkan
              </button>
              {isDeletable && (
                <button
                  onClick={confirmDelete}
                  className="px-6 py-3 mt-5 bg-gradient-to-r from-purple-500 to-indigo-700 hover:from-indigo-600 hover:to-purple-800 rounded-lg text-white shadow-lg transform transition-transform duration-200 hover:scale-110"
                >
                  Hapus
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListCategoryView;
