import React, { useState } from 'react'; // Add this import statement

import { Link } from 'react-router-dom';
import { Column } from 'react-table';
import AdminSidebar from '../../components/admin/AdminSidebar';
import TableHOC from '../../components/admin/TableHOC';

const arr = [
  {
    user: 'Charas',
    amount: 4500,
    discount: 400,
    status: <span className="red">Processing</span>,
    quantity: 3,
    action: <Link to="/admin/transaction/sajknaskd">Manage</Link>,
  },
  {
    user: 'Xavirors',
    amount: 6999,
    discount: 400,
    status: <span className="green">Shipped</span>,
    quantity: 6,
    action: <Link to="/admin/transaction/sajknaskd">Manage</Link>,
  },
  {
    user: 'Xavirors',
    amount: 6999,
    discount: 400,
    status: <span className="purple">Delivered</span>,
    quantity: 6,
    action: <Link to="/admin/transaction/sajknaskd">Manage</Link>,
  },
];

const columns = [
  {
    Header: 'Avatar',
    accessor: 'user',
  },
  {
    Header: 'Amount',
    accessor: 'amount',
  },
  {
    Header: 'Discount',
    accessor: 'discount',
  },
  {
    Header: 'Quantity',
    accessor: 'quantity',
  },
  {
    Header: 'Status',
    accessor: 'status',
  },
  {
    Header: 'Action',
    accessor: 'action',
  },
];

const Transaction = () => {
  const [rows, setRows] = useState(arr);

  const Table = TableHOC(columns, rows, 'dashboard-product-box', 'Transactions', rows.length > 6)();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main style={{
          color: "black",
        }}>{Table}</main>
    </div>
  );
};

export default Transaction;
