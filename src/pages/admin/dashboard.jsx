import React from 'react';
import { BsSearch } from 'react-icons/bs';
import { FaRegBell } from 'react-icons/fa';
import { BiMaleFemale } from 'react-icons/bi';
import { HiTrendingDown, HiTrendingUp } from 'react-icons/hi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { BarChart, DoughnutChart } from '../../components/admin/Charts';
import Table from '../../components/admin/DashboardTable';
import Loader from '../../components/admin/Loader';

const userImg =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJxA5cTf-5dh5Eusm0puHbvAhOrCRPtckzjA&usqp';

const Dashboard = () => {
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard">
        <div className="bar">
          <BsSearch />
          <input type="text" placeholder="Search for data, users, docs" />
          <FaRegBell />
          <img src={userImg} alt="User" />
        </div>

        <section className="widget-container">
          {/* WidgetItem components here */}
        </section>

        <section className="graph-container">
          {/* BarChart and CategoryItem components here */}
        </section>

        <section className="transaction-container">
          {/* DoughnutChart and Table components here */}
        </section>
      </main>
    </div>
  );
};

const WidgetItem = ({ heading, value, percent, color, amount = false }) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{amount ? `₹${value}` : value}</h4>
      {percent > 0 ? (
        <span className="green">
          <HiTrendingUp /> +{percent}%{' '}
        </span>
      ) : (
        <span className="red">
          <HiTrendingDown /> {percent}%{' '}
        </span>
      )}
    </div>

    <div
      className="widget-circle"
      style={{
        background: `conic-gradient(
        ${color} ${(Math.abs(percent) / 100) * 360}deg,
        rgb(255, 255, 255) 0
      )`,
      }}
    >
      <span
        style={{
          color,
        }}
      >
        {percent}%
      </span>
    </div>
  </article>
);

const CategoryItem = ({ color, value, heading }) => (
  <div className="category-item">
    <h5>{heading}</h5>
    <div>
      <div
        style={{
          backgroundColor: color,
          width: `${value}%`,
        }}
      ></div>
    </div>
    <span>{value}%</span>
  </div>
);

export default Dashboard;
