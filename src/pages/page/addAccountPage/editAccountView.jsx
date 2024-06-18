import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../../components/sidebar";
import { getUserById, updateUser } from "../../../service/fetchapi";

function EditProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    address: "",
    no_handphone: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getUserById(userId);
      if (result.success) {
        setUser(result.data);
        setFormData({
          username: result.data.username || "",
          address: result.data.address || "",
          no_handphone: result.data.no_handphone || "",
        });
      } else {
        setError(result.message);
      }
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateUser(userId, formData);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

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
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="no_handphone">
                No Handphone
              </label>
              <input
                type="text"
                id="no_handphone"
                name="no_handphone"
                value={formData.no_handphone}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-700 hover:from-indigo-600 hover:to-purple-800 rounded-lg text-white shadow-lg transform transition-transform duration-200 hover:scale-110 glow-button"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
