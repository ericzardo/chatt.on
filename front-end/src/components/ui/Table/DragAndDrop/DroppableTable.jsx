import { useState, useRef, useCallback, useEffect } from "react";
import { useDrop } from "react-dnd";
import PropTypes from "prop-types";

import { Lock } from "react-feather";
import DraggableRow from "./DraggableRow";

DroppableTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onReorder: PropTypes.func.isRequired,
};

function DroppableTable ({ columns, data, onReorder }) {
  const [tableData, setTableData] = useState([]);
  const tableRef = useRef(null);
  const dragbleRowsBlockeds = [
    "admin",
  ];

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const [, drop] = useDrop({
    accept: "ROW",
    hover: (draggedItem, monitor) => {
      const dragIndex = draggedItem.index;
      const hoverBoundingRect = tableRef.current?.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      if (!hoverBoundingRect || !clientOffset) {
        return;
      }

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      const rowHeight = hoverBoundingRect.height / tableData.length;
      const hoverIndex = Math.floor(hoverClientY / rowHeight);

      if (
        dragIndex === hoverIndex ||
        hoverIndex < 0 ||
        hoverIndex >= tableData.length ||
        dragbleRowsBlockeds.includes(tableData[hoverIndex]?.name) ||
        dragbleRowsBlockeds.includes(tableData[dragIndex]?.name)
      ) {
        return;
      }

      moveRow(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  const moveRow = useCallback((dragIndex, hoverIndex) => {
    const updatedData = [...tableData];

    const [draggedItem] = updatedData.splice(dragIndex, 1);
    updatedData.splice(hoverIndex, 0, draggedItem);

    setTableData(updatedData);

    onReorder(updatedData);
  }, [onReorder, tableData]);

  return (
    <table className="min-w-full overflow-x-auto bg-white dark:bg-zinc-950/60" ref={(node) => {
      drop(node); 
      tableRef.current = node;
    }}>
      <thead>
        <tr>
          <th
            className="py-5 px-4 text-left border-b text-zinc-600 dark:text-zinc-400 border-zinc-400 dark:border-zinc-800"
          >
          </th>
          {columns.map((col, index) => (
            <th
              key={index}
              className="py-5 px-4 text-left border-b text-zinc-600 dark:text-zinc-400 border-zinc-400 dark:border-zinc-800"
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.map((item, index) => (
          dragbleRowsBlockeds.includes(item?.name) ? (
            <tr key={index} className="py-5 px-4 text-left border-b text-zinc-600 dark:text-zinc-400 border-zinc-400 dark:border-zinc-800">
              <td className="py-2 px-4 h-12 border-b border-zinc-400 dark:border-zinc-800">
                <Lock className="dark:text-zinc-800 text-zinc-300 w-4 h-4 hover:scale-110" />
              </td>
              {columns.map((col, subIndex) => (
                <td key={subIndex} className="py-2 px-4 h-12 border-b border-zinc-400 dark:border-zinc-800">
                  {col.render(item)}
                </td>
              ))}
            </tr>
            
          ) : (
            <DraggableRow
              key={item.id}
              item={item}
              index={index}
              columns={columns}
            />
          )
          
        ))}
      </tbody>
    </table>
  );
}

export default DroppableTable;
