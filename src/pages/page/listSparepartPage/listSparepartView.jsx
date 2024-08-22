import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/sidebar";
import { fetchSparepart, deleteSparepart } from "../../../service/fetchapi";
import { Link } from "react-router-dom";
import { TrashIcon, PencilIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

const ListSparepart = () => {
  const [spareparts, setSpareparts] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSparepartId, setSelectedSparepartId] = useState(null);
  const [showZeroQuantity, setShowZeroQuantity] = useState(false);

  const fetchAndSetSpareparts = async (
    searchName = "",
    searchCategoryId = ""
  ) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchSparepart(searchName, searchCategoryId);
      setSpareparts(data);
    } catch (error) {
      setError("Gagal mengambil data sparepart");
      setSpareparts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCategories = async () => {
    setError("");
    try {
      const data = await fetchSparepart();
      const categories = data.map((sparepart) => ({
        id: sparepart.Category.category_id,
        name: sparepart.Category.category_name,
      }));
      const uniqueCategories = Array.from(
        new Map(categories.map((category) => [category.id, category])).values()
      );
      setAllCategories(uniqueCategories);
    } catch (error) {
      setError("Gagal mengambil data kategori");
      setAllCategories([]);
    } finally {
    }
  };

  useEffect(() => {
    fetchAllCategories();
    fetchAndSetSpareparts();
  }, []);

  useEffect(() => {
    fetchAndSetSpareparts(name, categoryId);
  }, [categoryId]);

  const handleSearchClick = () => {
    setCurrentPage(1);
    fetchAndSetSpareparts(name, categoryId);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = spareparts.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = (sparepartId) => {
    setSelectedSparepartId(sparepartId);
    setIsModalOpen(true);
  };

  const handleEdit = (sparepart) => {
    navigate("/editSparepart", { state: { sparepart } });
  };

  const confirmDelete = async () => {
    if (selectedSparepartId) {
      setLoading(true);
      const result = await deleteSparepart(selectedSparepartId);
      if (result.success) {
        await fetchAndSetSpareparts(name, categoryId);
      } else {
        setError(result.message);
      }
      setLoading(false);
      setIsModalOpen(false);
      handleSearchClick();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSparepartId(null);
  };

  const zeroQuantityItems = spareparts.filter(
    (sparepart) => sparepart.quantity === 0
  );

  const handleShowAllItems = () => {
    setShowZeroQuantity(false);
    setCurrentPage(1);
  };

  const handleShowZeroQuantityItems = () => {
    setShowZeroQuantity(true);
    setCurrentPage(1);
  };

  return (
    <div className="container-fluid flex">
      <Sidebar />
      <div className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
        <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
          <div
            className={`relative flex flex-col bg-clip-border rounded-xl text-gray-700 shadow-md cursor-pointer ${
              !showZeroQuantity
                ? "bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40"
                : "bg-white"
            }`}
            onClick={handleShowAllItems}
          >
            <div
              className={`bg-clip-border mx-4 rounded-xl overflow-hidden ${
                !showZeroQuantity
                  ? "bg-gradient-to-tr from-blue-600 to-blue-400 text-white"
                  : "bg-gradient-to-tr from-red-600 to-red-400 text-white"
              } shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="w-6 h-6 text-white"
              >
                <path d="M2 12V8h2v4H2zm16 0V8h-2v4h2zm2-5.5a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-1.5v4.5h-1.5v-3H7v3H5.5v-4.5H4a1.5 1.5 0 01-1.5-1.5v-3A1.5 1.5 0 014 6.5h16zM20 10h-1v1h1v-1zM5 8h14V6H5v2zm8 3.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
            </div>
            <div className="p-4 text-right">
              <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
                Jumlah Semua Barang
              </p>
              <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
                {spareparts.length}
              </h4>
            </div>
          </div>
          <div
            className={`relative flex flex-col bg-clip-border rounded-xl text-gray-700 shadow-md cursor-pointer ${
              showZeroQuantity
                ? "bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40"
                : "bg-white"
            }`}
            onClick={handleShowZeroQuantityItems}
          >
            <div
              className={`bg-clip-border mx-4 rounded-xl overflow-hidden ${
                showZeroQuantity
                  ? "bg-gradient-to-tr from-blue-600 to-blue-400 text-white"
                  : "bg-gradient-to-tr from-red-600 to-red-400 text-white"
              } shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="w-6 h-6 text-white"
              >
                <path d="M2 12V8h2v4H2zm16 0V8h-2v4h2zm2-5.5a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-1.5v4.5h-1.5v-3H7v3H5.5v-4.5H4a1.5 1.5 0 01-1.5-1.5v-3A1.5 1.5 0 014 6.5h16zM20 10h-1v1h1v-1zM5 8h14V6H5v2zm8 3.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
            </div>
            <div className="p-4 text-right">
              <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
                Jumlah Barang Kosong
              </p>
              <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
                {zeroQuantityItems.length}
              </h4>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="mb-4 flex justify-between items-center">
            <label className="input input-bordered flex items-center gap-2 grow">
              <input
                type="text"
                className="grow"
                placeholder="Cari"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70 cursor-pointer"
                onClick={handleSearchClick}
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
            <div className="dropdown dropdown-hover ml-5">
              <div
                tabIndex={0}
                role="button"
                className="btn"
                style={{ minWidth: "200px" }}
              >
                {categoryId !== ""
                  ? allCategories.find((c) => c.id === categoryId)?.name
                  : "SEMUA KATEGORI"}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li key="all">
                  <a onClick={() => setCategoryId("")}>SEMUA KATEGORI</a>
                </li>
                {allCategories.map((category) => (
                  <li key={category.id}>
                    <a onClick={() => setCategoryId(category.id)}>
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="text-center">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        ) : error ? (
          <p className="text-center">{error}</p>
        ) : showZeroQuantity && zeroQuantityItems.length === 0 ? (
          <p className="text-center">Sparepart tidak ditemukan</p>
        ) : spareparts.length === 0 ? (
          <p className="text-center">Sparepart tidak ditemukan</p>
        ) : (
          <>
            <table className="table mt-4">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Jumlah</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {(showZeroQuantity ? zeroQuantityItems : currentItems).map(
                  (sparepart, index) => (
                    <tr key={sparepart.spare_part_id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{sparepart.spare_part_name}</td>
                      <td>{sparepart.Category.category_name}</td>
                      <td>Rp {sparepart.price.toLocaleString("id-ID")}</td>
                      <td>{sparepart.quantity}</td>
                      <td>
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={() => handleEdit(sparepart)}
                        >
                          <PencilIcon className="h-5 w-5 text-blue-600" />
                        </button>
                        <button
                          className="btn btn-ghost btn-xs text-red-600"
                          onClick={() => handleDelete(sparepart.spare_part_id)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            {!showZeroQuantity && (
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
                    length: Math.min(
                      5,
                      Math.ceil(spareparts.length / itemsPerPage)
                    ),
                  }).map((_, index) => {
                    const pageNumber = Math.max(1, currentPage - 2) + index;
                    return (
                      <button
                        key={index}
                        onClick={() => paginate(pageNumber)}
                        className={`join-item btn ${
                          pageNumber === currentPage ? "active" : ""
                        }`}
                        disabled={
                          pageNumber >
                          Math.ceil(spareparts.length / itemsPerPage)
                        }
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    className="join-item btn"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={
                      currentPage ===
                      Math.ceil(spareparts.length / itemsPerPage)
                    }
                  >
                    »
                  </button>
                </div>
              </div>
            )}

            <div className="inline-block">
              <Link to="/AddSparepart">
                <button className="px-6 py-3 mt-5 bg-gradient-to-r from-purple-500 to-indigo-700 hover:from-indigo-600 hover:to-purple-800 rounded-lg text-white shadow-lg transform transition-transform duration-200 hover:scale-110">
                  Tambah Data
                </button>
              </Link>
            </div>
          </>
        )}
        {isModalOpen && (
          <div
            id="static-modal"
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 max-w-md w-full">
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Hapus Sparepart
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={closeModal}
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
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  Apakah anda yakin ingin menghapus sparepart ini?
                </p>
              </div>

              <div className=" p-4 border-t dark:border-gray-600 flex items-center justify-end gap-x-4">
                <button
                  type="button"
                  className="px-6 py-3 mt-5 bg-red-600 hover:bg-red-700 rounded-lg text-white shadow-lg transform transition-transform duration-200 hover:scale-110"
                  onClick={closeModal}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="px-6 py-3 mt-5 bg-gradient-to-r from-purple-500 to-indigo-700 hover:from-indigo-600 hover:to-purple-800 rounded-lg text-white shadow-lg transform transition-transform duration-200 hover:scale-110 glow-button"
                  onClick={confirmDelete}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListSparepart;
