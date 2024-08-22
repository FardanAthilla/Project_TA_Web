import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../../components/sidebar";
import { updateUser, updateUserPhoto } from "../../../service/fetchapi";
import { PhotoIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function EditAccount() {
  const location = useLocation();
  const user = location.state.user;
  
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState(user.address);
  const [noHandphone, setNoHandphone] = useState(user.no_handphone);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(`https://rdo-app-o955y.ondigitalocean.app/${user.image}`);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const [fade, setFade] = useState(false);
  
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasNumber;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !address || !noHandphone) {
      setSnackbar({
        visible: true,
        message: "Semua Field harus diisi kecuali password",
        type: "error",
      });
      return;
    }

    if (password && !validatePassword(password)) {
      setSnackbar({
        visible: true,
        message: "Password harus memiliki minimal 8 karakter, satu huruf besar, satu angka",
        type: "error",
      });
      return;
    }
    
    setIsLoading(true);
    
    const userData = { 
      id: user.user_id,
      username,
      address,
      no_handphone: noHandphone,
    };

    if (password) {
      userData.password = password;
    }

    const updateResult = await updateUser(userData);
    if (!updateResult.success) {
      setSnackbar({
        visible: true,
        message: updateResult.message,
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    if (image) {
      const photoResult = await updateUserPhoto(user.user_id, image);
      if (!photoResult.success) {
        setSnackbar({
          visible: true,
          message: photoResult.message,
          type: "error",
        });
        setIsLoading(false);
        return;
      }
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.user_id === user.user_id) {
      localStorage.removeItem("user");
    }
    
    setSnackbar({
      visible: true,
      message: "Perbarui berhasil!",
      type: "success",
    });
    setIsLoading(false);
    setTimeout(() => navigate(-1), 1500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    setUsername(user.username);
    setPassword("");
    setAddress(user.address);
    setNoHandphone(user.no_handphone);
    setImage(null);
    setPreview(`https://rdo-app-o955y.ondigitalocean.app/${user.image}`);
  };

  useEffect(() => {
    if (snackbar.visible) {
      setFade(true);
      const timer = setTimeout(() => {
        setFade(false);
        setTimeout(() => {
          setSnackbar({ visible: false, message: "", type: "" });
        }, 500);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar]);

  return (
    <div className="h-auto container-fluid flex">
      <Sidebar />
      <div className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
        {snackbar.visible && (
          <div
            role="alert"
            className={`alert ${
              snackbar.type === "success" ? "alert-success" : "alert-error"
            } fixed top-4 w-96 mx-auto z-20 transition-opacity duration-500 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              {snackbar.type === "success" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
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
              <h2 className="text-base font-semibold leading-7">
                Edit Akun
              </h2>
              <p className="mt-1 text-sm leading-6">
                Informasi ini akan digunakan untuk memperbarui akun Anda.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6"
                  >
                    Foto Sampul
                  </label>
                  <div className="mt-2 flex items-center">
                    <div className="text-center">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Preview"
                          className="mx-auto h-24 w-24 object-cover rounded-full"
                        />
                      ) : (
                        <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full border border-dashed border-gray-900/25">
                          <PhotoIcon
                            className="h-12 w-12"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                      <div className="mt-4 flex text-sm leading-6 justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md  font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Unggah file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className="text-xs leading-5">
                        PNG, JPG, GIF hingga 10MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6"
                  >
                    Nama Pengguna
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                      className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6"
                  >
                    Kata Sandi (Tidak perlu jika tidak lupa password)
                  </label>
                  <div className="mt-2">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium leading-6"
                  >
                    Alamat
                  </label>
                  <div className="mt-2">
                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      autoComplete="street-address"
                      className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="no_handphone"
                    className="block text-sm font-medium leading-6"
                  >
                    No Handphone
                  </label>
                  <div className="mt-2">
                    <input
                      id="no_handphone"
                      name="no_handphone"
                      type="text"
                      value={noHandphone}
                      onChange={(e) => setNoHandphone(e.target.value)}
                      autoComplete="tel"
                      className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              className="px-6 py-3 mt-5 bg-gradient-to-r from-purple-500 to-indigo-700 hover:from-indigo-600 hover:to-purple-800 rounded-lg text-white shadow-lg transform transition-transform duration-200 hover:scale-110 glow-button"
            >
              {isLoading ? "Loading..." : "Perbarui"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
