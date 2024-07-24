import TableAdvancedToggleCellRender from "@/components/tableComponent/components/tableAdvancedToggleCellRender";
import { ColDef, ValueGetterParams } from "ag-grid-community";
import { useMemo } from "react";
import TableNodeCellRender from "../../../components/tableComponent/components/tableNodeCellRender";
import { APIClassType } from "../../../types/api";

const useColumnDefs = (
  nodeClass: APIClassType,
  nodeId: string,
  open: boolean,
  isTweaks?: boolean,
  hideVisibility?: boolean,
) => {
  const columnDefs: ColDef[] = useMemo(() => {
    const colDefs: ColDef[] = [
      {
        headerName: "Field Name",
        field: "display_name",
        valueGetter: (params) => {
          const templateParam = params.data;
          return (
            (templateParam.display_name
              ? templateParam.display_name
              : templateParam.name) ?? params.data.key
          );
        },
        wrapText: true,
        autoHeight: true,
        flex: 1,
        resizable: false,
        cellClass: "no-border",
      },
      {
        headerName: "Description",
        field: "info",
        tooltipField: "info",
        wrapText: true,
        autoHeight: true,
        flex: 2,
        resizable: false,
        cellClass: "no-border",
      },
      {
        headerName: "Value",
        field: "value",
        cellRenderer: TableNodeCellRender,
        valueGetter: (params: ValueGetterParams) => {
          return {
            nodeId: nodeId,
            isTweaks,
          };
        },
        minWidth: 340,
        autoHeight: true,
        flex: 1,
        resizable: false,
        cellClass: "no-border",
      },
    ];
    if (!hideVisibility) {
      colDefs.push({
        headerName: "Show",
        field: "advanced",
        cellRenderer: TableAdvancedToggleCellRender,
        valueGetter: (params: ValueGetterParams) => {
          return {
            nodeId,
          };
        },
        editable: false,
        maxWidth: 80,
        resizable: false,
        cellClass: "no-border",
      });
    }
    return colDefs;
  }, [open, nodeClass]);

  return columnDefs;
};

export default useColumnDefs;
