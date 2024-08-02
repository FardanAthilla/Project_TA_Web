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

  return (
    <div className="h-screen flex bg-white">
      <Sidebar />
    </div>
  );
};

export default ServiceDetailView;
