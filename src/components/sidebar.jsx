import React from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/image/logo.png';
import {
  HomeModernIcon, ChartPieIcon, BellAlertIcon, ChatBubbleLeftIcon, ClipboardDocumentIcon,
  UsersIcon,
  EnvelopeIcon,
  PowerIcon,
  CursorArrowRippleIcon,
  FaceFrownIcon, CogIcon,
} from '@heroicons/react/20/solid';

function Sidebar() {
  const navigate = useNavigate();
  
  const menu1 = [
    {
      name: 'Dashboard',
      icon: HomeModernIcon,
      isActive: false,
      path: '/',
    },
    {
      name: 'Analytics',
      icon: ChartPieIcon,
      isActive: false,
      path: '/*', // Update as per your routing setup
    },
    {
      name: 'Notification',
      icon: BellAlertIcon,
      isActive: false,
      path: '/notification', // Update as per your routing setup
    },
  ];

  const menu2 = [
    {
      name: 'Chat',
      icon: ChatBubbleLeftIcon,
      isActive: false,
      path: '/chat', // Update as per your routing setup
    },
    {
      name: 'Notes',
      icon: ClipboardDocumentIcon,
      isActive: false,
      path: '/notes', // Update as per your routing setup
    },
    {
      name: 'Customers',
      icon: UsersIcon,
      isActive: false,
      path: '/customers', // Update as per your routing setup
    },
    {
      name: 'Mail',
      icon: EnvelopeIcon,
      isActive: false,
      path: '/mail', // Update as per your routing setup
    },
  ];

  const menu3 = [
    {
      name: 'Login',
      icon: PowerIcon,
      isActive: false,
      path: '/login', // Update as per your routing setup
    },
    {
      name: 'Register',
      icon: CursorArrowRippleIcon,
      isActive: false,
      path: '/register', // Update as per your routing setup
    },
    {
      name: 'Error',
      icon: FaceFrownIcon,
      isActive: false,
      path: '/error', // Update as per your routing setup
    },
  ];

  return (
    <div className="App">
      <section className="w-20 sm:w-64 bg-slate-100 h-screen">
        <div className="border-b p-5 text-center sm:text-left">
          <img src={logo} alt="Logo" className="w-full h-auto" />
        </div>
        <div className="border-b text-sm">
          <Menus menu={menu1} title={{ sm: 'Home', xs: 'BUSINESS' }} navigate={navigate} />
        </div>
        <div className="border-b text-sm">
          <Menus menu={menu2} title={{ sm: 'Tambah Data', xs: 'APP' }} navigate={navigate} />
        </div>
        <div className="border-b text-sm">
          <Menus menu={menu3} title={{ sm: 'Autentikasi', xs: 'AUTH' }} navigate={navigate} />
        </div>
        <div className="flex mx-5 mt-8 bg-blue-300 bg-opacity-10 border border-blue-100 rounded-md p-1 sm:p-2">
          <img
            src="https://images.pexels.com/photos/3778966/pexels-photo-3778966.jpeg?auto=compress&cs=tinysrgb&w=640&h=458&dpr=1"
            alt="img-profile"
            className="object-cover w-8 h-8 sm:w-10 sm:h-10 rounded-full"
          />
          <div className="flex-1 ml-3 items-center text-gray-700 hidden sm:block">
            <div className="text-md">Hari Irawan</div>
            <div className="text-xs">Administrator</div>
          </div>
          <CogIcon width={18} />
        </div>
      </section>
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
            ? 'bg-blue-300 bg-opacity-10 px-3 border border-blue-100 py-2 rounded-md text-blue-400 flex'
            : 'px-3 py-2 flex group hover:bg-blue-300 hover:bg-opacity-10 hover:border hover:border-blue-100 hover:rounded-md';

          const textActive = val.isActive ? 'text-blue-500' : 'text-gray-700 group-hover:text-blue-500';
          const iconActive = val.isActive ? 'text-blue-500' : 'text-gray-600 group-hover:text-blue-500';

          return (
            <li
              key={index}
              className={`${menuActive} cursor-pointer mx-5`}
              onClick={() => navigate(val.path)}
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
