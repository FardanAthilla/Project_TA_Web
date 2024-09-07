import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/sidebar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const PenjualanDetailView = () => {
  const location = useLocation();
  const { penjualan } = location.state;
  const navigate = useNavigate();

  return (
    <div className="h-screen flex bg-white">
      <Sidebar />
      <main className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
        <header className="flex justify-between items-center mb-4">
          <h1 onClick={() => {
            console.log(penjualan)
          }} className="text-3xl font-bold text-black">Detail Penjualan</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Kembali
          </button>
        </header>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex">
            <div className="flex-1">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="sm:col-span-2 mb-4">
                  <label
                    htmlFor="complaints"
                    className="block text-md font-medium leading-6"
                  >
                    ID Penjualan
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="complaints"
                      id="complaints"
                      value={penjualan.id}
                      readOnly
                      className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
                    />
                  </div>
                </div>

                
                <div className="sm:col-span-2 mb-4">
                  <label
                    htmlFor="complaints"
                    className="block text-md font-medium leading-6"
                  >
                    Total Price
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="complaints"
                      id="complaints"
                      value={penjualan.total_price}
                      readOnly
                      className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 mb-4">
                  <label
                    htmlFor="duration"
                    className="block text-md font-medium leading-6"
                  >
                    Tanggal Pengerjaan
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="duration"
                      id="duration"
                      value={`${penjualan.date}`}
                      readOnly
                      className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 mb-4">
                  <label htmlFor="spare_parts" className="block text-md font-medium leading-6">
                    Barang Yang dibeli
                  </label>
                  <div className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6">
                      <ul className="list-disc pl-5">
                        {penjualan.items.map((item, index) => (
                          <li key={index} className="text-gray-800">
                            <span className="font-semibold">{item.name}</span> - {item.quantity} pcs (Harga: Rp {item.price.toLocaleString()}) - {item.category === "mesin" ? "Mesin" : "Spare Part"}
                          </li>
                        ))}
                      </ul>
                  </div>
                </div>


              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};

export default PenjualanDetailView;
