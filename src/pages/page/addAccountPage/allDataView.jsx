import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar";
import { getAllUsers } from "../../../service/fetchapi";
import { Link } from "react-router-dom";

function AllDataView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = "https://rdo-app-o955y.ondigitalocean.app";

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getAllUsers();
      if (result.success) {
        setUsers(result.data);
      } else {
        setError(result.message);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

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
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
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
                        {user.role || "No Role"}
                      </div>
                    </div>
                  </td>
                  <td> {user.address || "No Address"}</td>
                  <td>{user.no_handphone || "No Phone Number"}</td>
                  <td>
                    <button className="btn btn-ghost btn-xs">Edit</button>
                    <button className="btn btn-ghost btn-xs">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/AddAccount">
            <button className="px-6 py-3 mt-5 bg-gradient-to-r from-purple-500 to-indigo-700 hover:from-indigo-600 hover:to-purple-800 rounded-lg text-white shadow-lg transform transition-transform duration-200 hover:scale-110 glow-button">
              Tambah Akun
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AllDataView;
