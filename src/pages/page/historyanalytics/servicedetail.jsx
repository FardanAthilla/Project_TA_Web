import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../../components/sidebar';
import ClipLoader from 'react-spinners/ClipLoader';

const ServiceDetailView = () => {
  const { id } = useParams();
  const [serviceDetail, setServiceDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const response = await axios.get(`https://rdo-app-o955y.ondigitalocean.app/service/${id}`);
        setServiceDetail(response.data);
      } catch (error) {
        console.error('Error fetching service detail: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
        {serviceDetail ? (
          <>
            <h1 className="text-3xl font-bold mb-4">Detail Service</h1>
            <div className="mb-4">
              <strong>Tanggal:</strong> {serviceDetail.date}
            </div>
            <div className="mb-4">
              <strong>Nomor Mesin:</strong> {serviceDetail.machine_number}
            </div>
            <div className="mb-4">
              <strong>Keluhan:</strong> {serviceDetail.complaints}
            </div>
          </>
        ) : (
          <p>Service detail not found.</p>
        )}
      </div>
    </div>
  );
};

export default ServiceDetailView;
