import { ColDef, ColGroupDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-balham.css"; // Optional Theme applied to the grid
import { FlowPoolObjectType } from "../../types/chat";
import TableComponent from "../tableComponent";

function RecordsOutputComponent({
  flowPool,
  pagination,
}: {
  flowPool: FlowPoolObjectType;
  pagination: boolean;
}) {
  const tableNodeData = Array.isArray(flowPool?.data?.artifacts)
    ? flowPool?.data?.artifacts
    : [flowPool?.data?.artifacts];
  const columns = Object.keys(tableNodeData[0]);
  const columnDefs = columns.map((col, idx) => ({
    field: col,
    flex: 1,
    resizable: idx !== columns.length - 1,
  })) as (ColDef<any> | ColGroupDef<any>)[];

  return (
    <TableComponent
      overlayNoRowsTemplate="No data available"
      suppressRowClickSelection={true}
      pagination={pagination}
      columnDefs={columnDefs}
      rowData={tableNodeData}
    />
  );
}

export default RecordsOutputComponent;
