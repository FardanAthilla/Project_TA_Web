import React from "react";
import { LineChart } from '@mui/x-charts/LineChart';
import Sidebar from "../../../components/sidebar";

const DashboardPage = () => {
  return (
    <div className="h-screen  container-fluid flex bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
        <div className="text-black">istri jaehyun</div>
        <div>
          <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
              {
                data: [2, 5.5, 2, 8.5, 1.5, 5],
              },
            ]}
            height={500}
            margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
            grid={{ vertical: true, horizontal: true }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
