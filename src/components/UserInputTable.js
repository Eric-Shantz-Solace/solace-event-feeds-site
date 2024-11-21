import React, {
  useState,
  useMemo,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TryItColumns, TryItRows } from '../util/TryItTableData.js';
import '../css/UserInputTable.css';
import { DetermineWhichCellsToHighlight } from '../util/DetermineWhichCellsToHighlight.js';
import { SessionContext } from '../util/helpers/solaceSession.js';

const UserInputTable = ({ generatedData }) => {
  const STORAGE_KEY = 'TryItData';
  const { subscribedTopicString, setColumnData } = useContext(SessionContext);


  // ============ Quatantine Zone ===============
  const [data, setData] = useState(() => {
    if (generatedData && Object.keys(generatedData).length !== 0) {
      console.log("generated data")
      return { columns: generatedData.columns, rows: generatedData.rows };
    } else {
      const savedData = localStorage.getItem(STORAGE_KEY);
      
      if (!savedData) {
        console.log("try it columns")
        return { columns: TryItColumns, rows: TryItRows };
      }
      
      try {
        console.log("parsed data")
        const parsedData = JSON.parse(savedData);
        return parsedData || { columns: TryItColumns, rows: TryItRows };
      } 
      catch (error) {
        console.error("Error parsing saved data:", error);
        return { columns: TryItColumns, rows: TryItRows };
      }
    }
  });
  //================================================

  const [gridKey, setGridKey] = useState('0');
  const { columns, rows } = data; // problem is data isnt being set properly when generatedData is empty object
  console.log("columns", columns)

  useEffect(() => {
    if (generatedData && Object.keys(generatedData).length !== 0) {
      if (JSON.stringify(generatedData) !== JSON.stringify(data)) {
        setData({ columns: generatedData.columns, rows: generatedData.rows });
      }
    }
  }, [generatedData, data]);

  const updateLocalStorage = (updatedData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  };

  const tableUpdated = (updatedRow) => {
    if (!updatedRow?.id) {
      console.error('Invalid updated row: Missing ID');
      return;
    }

    const updatedRows = rows.map((row) =>
      row.id === updatedRow.id ? { ...row, ...updatedRow } : row
    );

    const updatedData = { columns, rows: updatedRows };
    setData(updatedData);
    updateLocalStorage(updatedData);
    setGridKey((prevKey) => prevKey + 1);
  };

  const getRowId = (row) => row?.id ?? null;

  const memoizedColumnData = useMemo(() => {
    return columns.map((column) => {
      const columnKey = column.field;
      const availableItems = rows
        .map((row) => row[columnKey])
        .filter((item) => item !== undefined && item !== '');

      return { columnKey, columnData: availableItems };
    });
  }, [columns, rows]);

  useEffect(() => {
    setColumnData(memoizedColumnData);
  }, [memoizedColumnData, setColumnData]);

  const getCellClassName = useCallback(
    (params) => {
      if (!params.value) return '';

      const highlightedCell = DetermineWhichCellsToHighlight(
        subscribedTopicString,
        memoizedColumnData,
        params
      );
      return highlightedCell;
    },
    [subscribedTopicString, memoizedColumnData]
  );

  const customColumns = useMemo(() => {
    return columns.map((column, index) => ({
      ...column,
      cellClassName: (params) => {
        return getCellClassName({ ...params, columnIndex: index });
      },
    }));
  }, [columns, getCellClassName]);

  return (
    <div>
      <div className="try-it-table-container">
        <DataGrid
          key={gridKey}
          rows={rows}
          columns={customColumns}
          getRowId={getRowId}
          processRowUpdate={(row) => {
            tableUpdated(row);
            return row;
          }}
          onProcessRowUpdateError={(params) =>
            console.error('Error updating row:', params)
          }
        />
      </div>
    </div>
  );
};

export default UserInputTable;
