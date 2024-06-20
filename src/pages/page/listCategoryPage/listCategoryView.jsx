import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar";
import {
  fetchCategorySpareParts,
  fetchCategoryMachine,
} from "../../../service/fetchapi";
import { Link } from "react-router-dom";

const ListCategoryView = () => {
  const [sparePartCategories, setSparePartCategories] = useState([]);
  const [machineCategories, setMachineCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPageSpareParts, setCurrentPageSpareParts] = useState(1);
  const [currentPageMachine, setCurrentPageMachine] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const getCategorySpareParts = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchCategorySpareParts();
        setSparePartCategories(data.Data);
      } catch (error) {
        setError("Gagal mengambil data kategori spare part");
        setSparePartCategories([]);
      } finally {
        setLoading(false);
      }
    };

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

    getCategorySpareParts();
    getCategoryMachine();
  }, []);

  const indexOfLastItemSpareParts = currentPageSpareParts * itemsPerPage;
  const indexOfFirstItemSpareParts = indexOfLastItemSpareParts - itemsPerPage;
  const currentSparePartItems = sparePartCategories.slice(
    indexOfFirstItemSpareParts,
    indexOfLastItemSpareParts
  );

  const indexOfLastItemMachine = currentPageMachine * itemsPerPage;
  const indexOfFirstItemMachine = indexOfLastItemMachine - itemsPerPage;
  const currentMachineItems = machineCategories.slice(
    indexOfFirstItemMachine,
    indexOfLastItemMachine
  );

  const paginateSpareParts = (pageNumber) => {
    setCurrentPageSpareParts(pageNumber);
  };

  const paginateMachine = (pageNumber) => {
    setCurrentPageMachine(pageNumber);
  };

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
            {/* Spare Parts Table */}
            <h2 className="mt-8 text-lg">Kategori Spare Parts</h2>
            {sparePartCategories.length === 0 ? (
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
                  {currentSparePartItems.map((category, index) => (
                    <tr key={category.category_spare_part_id}>
                      <td>{indexOfFirstItemSpareParts + index + 1}</td>
                      <td>{category.category_spare_part_name}</td>
                      <td>
                        <button className="btn btn-ghost btn-xs">Edit</button>
                        <button className="btn btn-ghost btn-xs">Hapus</button>
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
                  onClick={() => paginateSpareParts(currentPageSpareParts - 1)}
                  disabled={currentPageSpareParts === 1}
                >
                  «
                </button>
                {Array.from({
                  length: Math.min(
                    5,
                    Math.ceil(sparePartCategories.length / itemsPerPage)
                  ),
                }).map((_, index) => {
                  const pageNumber =
                    Math.max(1, currentPageSpareParts - 2) + index;
                  return (
                    <button
                      key={index}
                      onClick={() => paginateSpareParts(pageNumber)}
                      className={`join-item btn ${
                        pageNumber === currentPageSpareParts ? "active" : ""
                      }`}
                      disabled={
                        pageNumber >
                        Math.ceil(sparePartCategories.length / itemsPerPage)
                      }
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                <button
                  className="join-item btn"
                  onClick={() => paginateSpareParts(currentPageSpareParts + 1)}
                  disabled={
                    currentPageSpareParts ===
                    Math.ceil(sparePartCategories.length / itemsPerPage)
                  }
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

            {/* Machine Table */}
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
                        <button className="btn btn-ghost btn-xs">Edit</button>
                        <button className="btn btn-ghost btn-xs">Hapus</button>
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
                  length: Math.min(
                    5,
                    Math.ceil(machineCategories.length / itemsPerPage)
                  ),
                }).map((_, index) => {
                  const pageNumber =
                    Math.max(1, currentPageMachine - 2) + index;
                  return (
                    <button
                      key={index}
                      onClick={() => paginateMachine(pageNumber)}
                      className={`join-item btn ${
                        pageNumber === currentPageMachine ? "active" : ""
                      }`}
                      disabled={
                        pageNumber >
                        Math.ceil(machineCategories.length / itemsPerPage)
                      }
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                <button
                  className="join-item btn"
                  onClick={() => paginateMachine(currentPageMachine + 1)}
                  disabled={
                    currentPageMachine ===
                    Math.ceil(machineCategories.length / itemsPerPage)
                  }
                >
                  »
                </button>
              </div>
            </div>
          </>
        )}
        <div className="inline-block">
          <Link to="/AddCategory">
            <button className="px-6 py-3 mt-5 bg-gradient-to-r from-purple-500 to-indigo-700 hover:from-indigo-600 hover:to-purple-800 rounded-lg text-white shadow-lg transform transition-transform duration-200 hover:scale-110">
              Tambah Data
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ListCategoryView;
