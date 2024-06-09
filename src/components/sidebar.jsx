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
} from '@heroicons/react/20/solid';
import { getUser } from "../service/fetchapi";

function Sidebar() {
  const baseUrl = "https://rdo-app-o955y.ondigitalocean.app";
  const navigate = useNavigate();
  const [user, setUser] = useState({});

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
      path: "/allData",
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
  ];

  const menu3 = [
    {
      name: "Logout",
      icon: PowerIcon,
      isActive: false,
      path: "/login",
      action: handleLogout,
    },
  ];

  return (
    <div className="sidebar fixed h-screen overflow-y-auto bg-slate-100 w-20 sm:w-64">
      <div className="border-b p-5 text-center sm:text-left">
        <img src={logo} alt="Logo" className="w-full h-auto" />
      </div>
      <div className="border-b text-sm">
        <Menus
          menu={menu1}
          title={{ sm: "Home", xs: "BUSINESS" }}
          navigate={navigate}
        />
      </div>
      <div className="border-b text-sm">
        <Menus
          menu={menu2}
          title={{ sm: "Tambah Data", xs: "APP" }}
          navigate={navigate}
        />
      </div>
      <div className="border-b text-sm">
        <Menus
          menu={menu3}
          title={{ sm: "Autentikasi", xs: "AUTH" }}
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
