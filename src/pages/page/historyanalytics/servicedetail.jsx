import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/sidebar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const ServiceDetail = () => {
  const location = useLocation();
  const { service } = location.state;
  const navigate = useNavigate();
  console.log(service.serviceItems);

  // Function to format date range
  const formatDateRange = (startDate, endDate) => {
    const formattedStartDate = format(new Date(startDate), 'eeee, dd MMMM yyyy', { locale: id });
    const formattedEndDate = format(new Date(endDate), 'eeee, dd MMMM yyyy', { locale: id });
    return `${formattedStartDate} - ${formattedEndDate}`;
  };

  // Determine the display duration or date range
  const duration = service.date_end
    ? formatDateRange(service.rawDate, service.date_end)
    : "N/A";

  return (
    <div className="h-screen flex bg-white">
      <Sidebar />
      <main className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-black">Detail Service</h1>
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
              <div className="flex mb-4 items-center">
                <img
                  src={service.worker_image}
                  alt="Worker"
                  className="w-20 h-20 rounded-full mr-4 object-cover"
                />
                <div>
                  <h2 className="text-xl font-bold text-black">{service.worker_name}</h2>
                  <p className="text-lg text-gray-600">{service.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 mb-4">
                  <label
                    htmlFor="customer_name"
                    className="block text-md font-medium leading-6"
                  >
                    Nama Pelanggan
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="customer_name"
                      id="customer_name"
                      value={service.customer_name}
                      readOnly
                      className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 mb-4">
                  <label
                    htmlFor="machine_name"
                    className="block text-md font-medium leading-6"
                  >
                    Nama Mesin
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="machine_name"
                      id="machine_name"
                      value={service.machine_name}
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
                    Keluhan
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="complaints"
                      id="complaints"
                      value={service.complaints}
                      readOnly
                      className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 mb-4">
                  <label
                    htmlFor="status"
                    className="block text-md font-medium leading-6"
                  >
                    Status
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="status"
                      id="status"
                      value={service.status}
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
                    Durasi Pengerjaan
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="duration"
                      id="duration"
                      value={duration}
                      readOnly
                      className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 mb-4">
                  <label htmlFor="spare_parts" className="block text-md font-medium leading-6">
                    Spare Parts Tambahan
                  </label>
                  <div className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6">
                    {service.serviceItems && service.serviceItems.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {service.serviceItems.map((item, index) => (
                          <li key={index} className="text-gray-800">
                            <span className="font-semibold">{item.itemName}</span> - {item.quantity} pcs (Harga: Rp {item.price.toLocaleString()})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-800">Tidak ada tambahan spare part</p>
                    )}
                  </div>
                </div>


              </div>
            </div>

            <div className="w-1/3 flex justify-center items-start self-start mt-20 sm:mt-32">
              <div className="border border-blue-800 rounded-lg shadow-lg p-2">
                {service.laporan_image ? (
                  <img
                    src={service.laporan_image}
                    alt="laporan image"
                    className="img-fluid rounded-lg shadow-lg"
                    style={{ width: "300px", height: "420px", objectFit: "cover" }}
                  />
                ) : (
                  <p className="text-center text-gray-500">Gambar tidak tersedia</p>
                )}
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};

export default ServiceDetail;
