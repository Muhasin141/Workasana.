import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const token = localStorage.getItem("token");

  const [lastWeekTasks, setLastWeekTasks] = useState([]);
  const [pendingDays, setPendingDays] = useState(0);

  const [closedByTeam, setClosedByTeam] = useState({});
  const [closedByOwner, setClosedByOwner] = useState({});
  const [closedByProject, setClosedByProject] = useState({});

  useEffect(() => {
    fetch(`https://workasana-gamma.vercel.app/report/last-week`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setLastWeekTasks(data.tasks || []));

    fetch(`https://workasana-gamma.vercel.app/report/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPendingDays(data.totalPendingDays || 0));

    fetch(`https://workasana-gamma.vercel.app/report/closed-tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setClosedByTeam(data.byTeam || {});
        setClosedByOwner(data.byOwner || {});
        setClosedByProject(data.byProject || {});
      });
  }, [token]);

  const completedPerDay = {};
  lastWeekTasks.forEach((task) => {
    const day = new Date(task.updatedAt).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    completedPerDay[day] = (completedPerDay[day] || 0) + 1;
  });

  const barData = {
    labels: Object.keys(completedPerDay),
    datasets: [
      {
        label: "Tasks Completed",
        data: Object.values(completedPerDay),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderRadius: 4,
      },
    ],
  };

  const pieColors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#8BC34A",
  ];

  const createPieData = (dataObj) => ({
    labels: Object.keys(dataObj),
    datasets: [
      {
        data: Object.values(dataObj),
        backgroundColor: pieColors,
        hoverOffset: 20,
      },
    ],
  });

  return (
    <div className="container my-4">
      <h3 className="mb-4 fw-bold text-center">Reports Dashboard</h3>

      {/* Bar Chart */}
      <div className="mb-4 p-3 shadow rounded bg-white">
        <h5 className="mb-2">Tasks Completed Last Week</h5>
        <div style={{ height: "250px", maxWidth: "100%" }}>
          <Bar
            data={barData}
            options={{
              maintainAspectRatio: false,
              plugins: { legend: { position: "top" } },
            }}
          />
        </div>
      </div>

      {/* Pending Days */}
      <div className="mb-4 p-3 shadow rounded bg-white text-center">
        <h5>Total Pending Work (days)</h5>
        <p className="display-5 text-primary mb-0">{pendingDays}</p>
      </div>

      {/* Pie Charts */}
      <div className="row gy-3">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="p-3 shadow rounded bg-white">
            <h5 className="text-center mb-2">Tasks Closed by Team</h5>
            <div style={{ height: "200px", maxWidth: "100%" }}>
              <Pie
                data={createPieData(closedByTeam)}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <div className="p-3 shadow rounded bg-white">
            <h5 className="text-center mb-2">Tasks Closed by Owner</h5>
            <div style={{ height: "200px", maxWidth: "100%" }}>
              <Pie
                data={createPieData(closedByOwner)}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <div className="p-3 shadow rounded bg-white">
            <h5 className="text-center mb-2">Tasks Closed by Project</h5>
            <div style={{ height: "200px", maxWidth: "100%" }}>
              <Pie
                data={createPieData(closedByProject)}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
