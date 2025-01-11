import React from "react";
import DataTable from "examples/Tables/DataTable";
import funeralsTableData from "../data/funeralsTableData";

function FuneralsTable() {
  const { columns, rows } = funeralsTableData();

  return <DataTable table={{ columns, rows }} />;
}

export default FuneralsTable;
