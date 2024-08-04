import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/sidebar';

const ServiceDetail = () => {
  const location = useLocation();
  const { service } = location.state;
  const navigate = useNavigate();

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />
      <main className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-black">Detail Service</h1>
          <button
            onClick={() => navigate(-1)}
            className="btn-primary px-4 py-2 rounded-md"
          >
            Kembali
          </button>
        </header>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex mb-6">
            {/* <img
              src={service.worker_image}
              alt="Worker"
              className="w-20 h-20 rounded-full mr-4 object-cover"
            /> */}
            <div>
              <h2 className="text-xl font-bold text-black">{service.worker_name}</h2>
              <p className="text-gray-600">{service.date}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="detail-item">
              <h3 className="text-lg font-semibold text-gray-700">
                Nama Pelanggan:
              </h3>
              <p>{service.customer_name}</p>
            </div>
            <div className="detail-item">
              <h3 className="text-lg font-semibold text-gray-700">
                Nama Mesin:
              </h3>
              <p>{service.machine_name}</p>
            </div>
            <div className="detail-item">
              <h3 className="text-lg font-semibold text-gray-700">
                Nomor Mesin:
              </h3>
              <p>{service.machine_number}</p>
            </div>
            <div className="detail-item">
              <h3 className="text-lg font-semibold text-gray-700">Keluhan:</h3>
              <p className="text-wrap">{service.complaints}</p>
            </div>
            <div className="detail-item">
              <h3 className="text-lg font-semibold text-gray-700">Status:</h3>
              <p>{service.status}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ServiceDetail;
