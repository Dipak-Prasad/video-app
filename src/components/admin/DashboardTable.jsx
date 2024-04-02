import React from "react";
import TableHOC from "./TableHOC";

const DashboardTable = ({ data = [] }) => {
  const columns = [
    {
      Header: "Id",
      accessor: "_id",
    },
    {
      Header: "Quantity",
      accessor: "quantity",
    },
    {
      Header: "Discount",
      accessor: "discount",
    },
    {
      Header: "Amount",
      accessor: "amount",
    },
    {
      Header: "Status",
      accessor: "status",
    },
  ];

  return (
    <TableHOC
      columns={columns}
      data={data}
      containerClassname="transaction-box"
      heading="Top Transaction"
    />
  );
};

export default DashboardTable;
