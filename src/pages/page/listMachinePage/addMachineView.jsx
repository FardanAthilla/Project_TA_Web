import React, { useState } from "react";
import Sidebar from "../../../components/sidebar";
import { addMachine } from "../../../service/fetchapi";

const AddMachineView = () => {
  const [machineData, setMachineData] = useState({
    store_items_name: "",
    quantity: "",
    category_machine_id: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMachineData({
      ...machineData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await addMachine(machineData);
      console.log("Machine added successfully:", result);
    } catch (error) {
      console.error("Failed to add machine:", error);
    }
  };

  return (
    <div className="container-fluid flex">
      <Sidebar />
      <div className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
        <h1 className="text-black">Tambah Mesin</h1>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-700">Nama Mesin</label>
            <input
              type="text"
              name="store_items_name"
              value={machineData.store_items_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Jumlah</label>
            <input
              type="number"
              name="quantity"
              value={machineData.quantity}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">ID Kategori Mesin</label>
            <input
              type="number"
              name="category_machine_id"
              value={machineData.category_machine_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Harga</label>
            <input
              type="number"
              name="price"
              value={machineData.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMachineView;
