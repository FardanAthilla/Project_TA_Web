import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/sidebar";
import { fetchMachines } from "../../../service/fetchapi";
import { Link } from "react-router-dom";

const ListMachine = () => {
  const [machines, setMachines] = useState([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAndSetMachines = async (
    searchName = "",
    searchCategoryId = ""
  ) => {
    setLoading(true);
    setError("");
    try {
      console.log("Searching with categories:", searchCategoryId);
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
                  console.log("Name input changed:", e.target.value);
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
                {allCategories.map((category, index) => (
                  <li key={index}>
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
              {machines.map((machine, index) => (
                <tr key={machine.store_items_id}>
                  <td>{index + 1}</td>
                  <td>{machine.store_items_name}</td>
                  <td>{machine.CategoryMachine.category_machine_name}</td>
                  <td>{machine.price}</td>
                  <td>{machine.quantity}</td>
                  <td>
                    <button className="btn btn-ghost btn-xs">Edit</button>
                    <button className="btn btn-ghost btn-xs">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Link to="/AddAccount">
          <button className="px-6 py-3 mt-5 bg-gradient-to-r from-purple-500 to-indigo-700 hover:from-indigo-600 hover:to-purple-800 rounded-lg text-white shadow-lg transform transition-transform duration-200 hover:scale-110 glow-button">
            Tambah Data
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ListMachine;
