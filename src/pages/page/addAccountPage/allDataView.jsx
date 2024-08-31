import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/sidebar";
import { getAllUsers, deleteUser, getUser } from "../../../service/fetchapi";
import { Link } from "react-router-dom";
import { TrashIcon, PencilIcon } from "@heroicons/react/20/solid";

function AllDataView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const baseUrl = "https://rdo-app-o955y.ondigitalocean.app";
  const activeUserId = user.user_id;

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("Token");
      if (token) {
        const result = await getUser(token);
        if (result.success) {
          setUser(result.data);
          localStorage.setItem("user", JSON.stringify(result.data));
        }
      }
    };
  
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); 
    } else {
      fetchUserData();
    }
  }, []);
  
  useEffect(() => {
    if (user.user_id) {
      fetchUsers();
    }
  }, [user]);
  
  const fetchUsers = async () => {
    setLoading(true);
    const result = await getAllUsers();
    if (result.success) {
      console.log("Fetched users:", result.data);
      const filteredUsers = result.data.filter(
        (user) => user.user_id !== activeUserId
      );
      setUsers(filteredUsers);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };


  const handleDelete = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await deleteUser(selectedUserId);
      const updatedUsers = users.filter(
        (user) => user.user_id !== selectedUserId
      );
      const totalPages = Math.ceil(updatedUsers.length / itemsPerPage);
      setUsers(updatedUsers);
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }
    } catch (error) {
      setError("Failed to delete user");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const handleEdit = (user) => {
    navigate("/EditAccount", { state: { user } });
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  if (loading)
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="text-center">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
          <div className="flex-1 flex flex-col justify-center items-center">
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="container-fluid">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
          <table className="table">
            <thead>
              <tr>
                <th>Profil</th>
                <th>Username</th>
                <th>Alamat</th>
                <th>No Handphone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user) => (
                <tr key={user.user_id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src={`${baseUrl}/${user.image}`}
                            alt="img-profile"
                            className="img-fluid rounded-circle"
                            style={{ width: "50px", height: "50px" }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="font-bold">
                        {user.username || "No Username"}
                      </div>
                      <div className="text-sm opacity-50">
                        {user.Role.role_name || "No Role"}
                      </div>
                    </div>
                  </td>
                  <td>{user.address || "No Address"}</td>
                  <td>{user.no_handphone || "No Phone Number"}</td>
                  <td>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => handleEdit(user)}
                    >
                      <PencilIcon className="h-5 w-5 text-blue-600" />
                    </button>
                    <button
                      className="btn btn-ghost btn-xs text-red-600"
                      onClick={() => handleDelete(user.user_id)}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
                length: Math.min(5, Math.ceil(users.length / itemsPerPage)),
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
                      pageNumber > Math.ceil(users.length / itemsPerPage)
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
                  currentPage === Math.ceil(users.length / itemsPerPage)
                }
              >
                »
              </button>
            </div>
          </div>

          <div className="inline-block">
            <Link to="/AddAccount">
              <button className="px-6 py-3 mt-5 bg-gradient-to-r from-purple-500 to-indigo-700 hover:from-indigo-600 hover:to-purple-800 rounded-lg text-white shadow-lg transform transition-transform duration-200 hover:scale-110 glow-button">
                Tambah Akun
              </button>
            </Link>
          </div>
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
                Apa kamu yakin menghapus data ini? setelah dihapus tidak dapat
                di kembalikan
              </p>
            </div>
            <div className=" p-4 border-t dark:border-gray-600 flex items-center justify-end gap-x-4">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white hover:bg-gray-600 px-4 py-2 rounded"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllDataView;
