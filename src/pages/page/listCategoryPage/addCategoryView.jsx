import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/sidebar';
import { addCategory } from '../../../service/fetchapi';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const AddCategoryView = () => {
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success',
  });
  const [errors, setErrors] = useState([]);
  const [fade, setFade] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setSnackbar({
        visible: true,
        message: 'Nama kategori kosong.',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);
    setErrors([]);
    console.log('Inputan:', categoryName);

    try {
      const CategoryData = { category_name: categoryName };
      const CategoryResult = await addCategory(CategoryData);

      const isSuccess = CategoryResult.Succes === "Succes Create Category";

      setSnackbar({
        visible: true,
        message: isSuccess ? 'Kategori berhasil ditambahkan!' : 'Gagal menambahkan kategori.',
        type: isSuccess ? 'success' : 'error',
      });

      if (isSuccess) {
        setTimeout(() => navigate(-1), 1500);
      } else {
        setErrors(CategoryResult.errors || []);
        console.log('Errors:', machineCategoryResult.errors || []);
      }
    } catch (error) {
      setSnackbar({
        visible: true,
        message: 'Gagal menambahkan kategori.',
        type: 'error',
      });
      setErrors([error.message, ...(error.response?.data?.errors || [])]);
      console.log('Catch Error:', error);
      console.log('Error response data:', error.response?.data?.errors || []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCategoryName('');
  };

  useEffect(() => {
    if (snackbar.visible) {
      setFade(true);
      const timer = setTimeout(() => {
        setFade(false);
        setTimeout(() => {
          setSnackbar({ visible: false, message: '', type: '' });
        }, 500);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar]);

  return (
    <div className="container-fluid flex">
      <Sidebar />
      <div className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
        {snackbar.visible && (
          <div
            role="alert"
            className={`alert ${snackbar.type === 'success' ? 'alert-success' : 'alert-error'} fixed top-4 w-96 mx-auto z-20 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              {snackbar.type === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            <span>{snackbar.message}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-base font-semibold leading-7 flex items-center mb-5"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Kembali
              </button>
              <h2 className="text-base font-semibold leading-7">Tambah Kategori</h2>
              <p className="mt-1 text-sm leading-6">Informasi ini akan digunakan untuk menambah kategori baru.</p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="category_name" className="block text-sm font-medium leading-6">
                    Nama Kategori
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="category_name"
                      id="category_name"
                      value={categoryName}
                      onChange={handleChange}
                      autoComplete="category_name"
                      className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>

            {errors.length > 0 && (
              <div className="alert alert-error mt-6">
                <ul>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 mt-5 bg-red-600 hover:bg-red-700 rounded-lg text-white shadow-lg transform transition-transform duration-200 hover:scale-110"
              >
                Hapus
              </button>

              <button
                type="submit"
                className="px-6 py-3 mt-5 bg-gradient-to-r from-purple-500 to-indigo-700 hover:from-indigo-600 hover:to-purple-800 rounded-lg text-white shadow-lg transform transition-transform duration-200 hover:scale-110 glow-button"
              >
                {isLoading ? 'Loading...' : 'Tambah'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryView;
