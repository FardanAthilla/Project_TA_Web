import React from "react";
import { IoPersonAdd } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { GiSewingMachine } from "react-icons/gi";
import { BiSolidComponent } from "react-icons/bi";


const navLink = [
  {
    name: "Dashboard",
    Icon: MdDashboard ,
  },
  {
    name: "Daftar Mesin",
    Icon: GiSewingMachine,
  },
  {
    name: "Sparepart",
    Icon: BiSolidComponent,
  },
  {
    name: "Akun",
    Icon: IoPersonAdd,
  },
];

function sidebar() {
  return (
    <div className="px-10 py-12 flex flex-col border border-r-1 w-1/5 h-screen">
      <div className="logo-div flex space-x-3 items-center">
        <img src="src\assets\image\logo2.png" width={75} />
        <span class="font-bold">UD.Mojopahit</span>
      </div>

      <div className="mt-9 flex flex-col space-y-8">
        {navLink.map((item, index) => (
          <div key={index} className="flex items-center space-x-3 py-2">
            <item.Icon className="text-xl" />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default sidebar;
