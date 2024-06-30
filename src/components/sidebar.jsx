import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import logo from "../assets/image/logo.png";
import {
  HomeModernIcon,
  ChartPieIcon,
  CogIcon,
  UsersIcon,
  WrenchIcon,
  PowerIcon,
  CubeIcon,
} from '@heroicons/react/20/solid';
import { getUser } from "../service/fetchapi";

function Sidebar() {
  const baseUrl = "https://rdo-app-o955y.ondigitalocean.app";
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("Token");
      if (token) {
        const result = await getUser(token);
        if (result.success) {
          setUser(result.data);
          localStorage.setItem("user", JSON.stringify(result.data));
        }
      }
    };

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); 
    } else {
      fetchUserData();
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("Token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menu1 = [
    {
      name: "Dashboard",
      icon: HomeModernIcon,
      isActive: false,
      path: "/",
    },
    {
      name: "Analytics",
      icon: ChartPieIcon,
      isActive: false,
      path: "/history",
    },
  ];

  const menu2 = [
    {
      name: "Mesin",
      icon: WrenchIcon,
      isActive: false,
      path: "/listMachine",
    },
    {
      name: "Sparepart",
      icon: CogIcon,
      isActive: false,
      path: "/listSparepart",
    },
    {
      name: "Akun",
      icon: UsersIcon,
      isActive: false,
      path: "/allData",
    },
    {
      name: "Kategori",
      icon: CubeIcon,
      isActive: false,
      path: "/listCategory",
    },
  ];

  const menu3 = [
    {
      name: "Logout",
      icon: PowerIcon,
      isActive: false,
      path: "/login",
      action: () => setIsModalOpen(true),
    },
  ];

  return (
    <>
      <div className="sidebar fixed h-screen overflow-y-auto bg-slate-100 w-20 sm:w-64 z-20">
        <div className="border-b p-5 text-center sm:text-left">
          <img src={logo} alt="Logo" className="w-full h-auto" />
        </div>
        <div className="border-b text-sm">
          <Menus
            menu={menu1}
            title={{ sm: "Home", xs: "Home" }}
            navigate={navigate}
          />
        </div>
        <div className="border-b text-sm">
          <Menus
            menu={menu2}
            title={{ sm: "Tambah Data", xs: "Tambah Data" }}
            navigate={navigate}
          />
        </div>
        <div className="border-b text-sm">
          <Menus
            menu={menu3}
            title={{ sm: "Autentikasi", xs: "Autentikasi" }}
            navigate={navigate}
          />
        </div>
        <div className="flex mx-5 mt-8 bg-opacity-10 border border-blue-100 rounded-md p-1 sm:p-2">
          <img
            src={`${baseUrl}/${user.image}`}
            alt="img-profile"
            className="object-cover w-8 h-8 sm:w-10 sm:h-10 rounded-full"
          />
          <div className="flex-1 ml-3 items-center text-gray-700 hidden sm:block">
            <div className="text-md">{user.username}</div>
            <div className="text-xs">{user.role || 'Admin'}</div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          id="static-modal"
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          style={{ pointerEvents: "auto" }}
        >
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Konfirmasi Logout
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 p-1 rounded-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400">
                Apakah kamu yakin ingin logout? Semua sesi akan diakhiri.
              </p>
            </div>
            <div className="flex justify-end p-4 border-t dark:border-gray-600">
              <button
                onClick={() => setIsModalOpen(false)}
                className="py-2 px-4 mr-3 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="py-2 px-4 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Menus({ menu, title, navigate }) {
  return (
    <div className="py-5">
      <h6 className="mb-4 text-[10px] sm:text-sm text-center sm:text-left sm:px-5">
        <span className="sm:hidden">{title.xs}</span>
        <span className="hidden sm:block">{title.sm}</span>
      </h6>
      <ul>
        {menu.map((val, index) => {
          const Icon = val.icon;
          const menuActive = val.isActive
            ? "bg-blue-300 bg-opacity-10 px-3 border border-blue-100 py-2 rounded-md text-blue-400 flex"
            : "px-3 py-2 flex group hover:bg-blue-300 hover:bg-opacity-10 hover:border hover:border-blue-100 hover:rounded-md";

          const textActive = val.isActive
            ? "text-blue-500"
            : "text-gray-700 group-hover:text-blue-500";
          const iconActive = val.isActive
            ? "text-blue-500"
            : "text-gray-600 group-hover:text-blue-500";

          return (
            <li
              key={index}
              className={`${menuActive} cursor-pointer mx-5`}
              onClick={() => {
                if (val.action) {
                  val.action();
                } else {
                  navigate(val.path);
                }
              }}
            >
              <Icon width={18} className={`${iconActive}`} />
              <div className={`ml-2 ${textActive} hidden sm:block`}>
                {val.name}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;
