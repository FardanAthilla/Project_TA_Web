import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/sidebar";
import { fetchMachines, deleteMachine } from "../../../service/fetchapi";
import { Link } from "react-router-dom";
import { TrashIcon, PencilIcon } from "@heroicons/react/20/solid";

const ListMachine = () => {
  const [machines, setMachines] = useState([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMachineId, setSelectedMachineId] = useState(null);

  const fetchAndSetMachines = async (
    searchName = "",
    searchCategoryId = ""
  ) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchMachines(searchName, searchCategoryId);
      setMachines(data);
    } catch (error) {
      setError("Gagal mengambil data mesin");
      setMachines([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchMachines();
      const categories = data.map((machine) => ({
        id: machine.CategoryMachine.category_machine_id,
        name: machine.CategoryMachine.category_machine_name,
      }));
      const uniqueCategories = Array.from(
        new Map(categories.map((category) => [category.id, category])).values()
      );
      setAllCategories(uniqueCategories);
    } catch (error) {
      setError("Gagal mengambil data kategori");
      setAllCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCategories();
    fetchAndSetMachines();
  }, []);

  useEffect(() => {
    fetchAndSetMachines(name, categoryId);
  }, [name, categoryId]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = machines.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = (machineId) => {
    setSelectedMachineId(machineId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedMachineId) {
      setLoading(true);
      const result = await deleteMachine(selectedMachineId);
      if (result.success) {
        await fetchAndSetMachines(name, categoryId);
      } else {
        setError(result.message);
      }
      setLoading(false);
      setIsModalOpen(false);
      setSelectedMachineId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMachineId(null);
  };

  return (
    <div className="container-fluid flex">
      <Sidebar />
      <div className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
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
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
            <div className="dropdown dropdown-hover">
              <div
                tabIndex={0}
                role="button"
                className="btn ml-5"
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
        ) : machines.length === 0 ? (
          <p className="text-center">Mesin tidak ditemukan</p>
        ) : (
          <table className="table">
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
              {currentItems.map((machine, index) => (
                <tr key={machine.store_items_id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{machine.store_items_name}</td>
                  <td>{machine.CategoryMachine.category_machine_name}</td>
                  <td>{machine.price}</td>
                  <td>{machine.quantity}</td>
                  <td>
                    <button className="btn btn-ghost btn-xs">
                      <PencilIcon className="h-5 w-5 text-blue-600" />
                    </button>
                    <button
                      className="btn btn-ghost btn-xs text-red-600"
                      onClick={() => handleDelete(machine.store_items_id)}
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
              length: Math.min(5, Math.ceil(machines.length / itemsPerPage)),
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
                    pageNumber > Math.ceil(machines.length / itemsPerPage)
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
                currentPage === Math.ceil(machines.length / itemsPerPage)
              }
            >
              »
            </button>
          </div>
        </div>
        <div className="inline-block">
          <Link to="/AddMachine">
            <button className="px-6 py-3 mt-5 bg-gradient-to-r from-purple-500 to-indigo-700 hover:from-indigo-600 hover:to-purple-800 rounded-lg text-white shadow-lg transform transition-transform duration-200 hover:scale-110">
              Tambah Data
            </button>
          </Link>
        </div>
      </div>

      {isModalOpen && (
        <div
          id="static-modal"
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
        >
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Hapus Mesin
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
                Apakah anda yakin ingin menghapus mesin ini?
              </p>
            </div>

            <div className="flex justify-end p-4 border-t dark:border-gray-600">
              <button
                type="button"
                className="py-2 px-4 mr-3 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={closeModal}
              >
                Batal
              </button>
              <button
                type="button"
                className="py-2 px-4 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={confirmDelete}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListMachine;
