import { useCallback } from "react";
import PropTypes from "prop-types";

import DroppableTable from "./DragAndDrop/DroppableTable";

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    header: PropTypes.string.isRequired,
    render: PropTypes.func.isRequired,
  })).isRequired,
  data: PropTypes.array,
  onReorder: PropTypes.func,
  draggable: PropTypes.bool,
};

function Table ({ columns, data, onReorder, draggable = false }) {

  const handleReorder = useCallback((reorderedData) => {
    if (onReorder) {
      onReorder(reorderedData);
    }
  }, [onReorder]);

  if (data.length === 0) return <div>No data found</div>;

  return draggable ? (
    <DroppableTable
      columns={columns}
      data={data}
      onReorder={handleReorder}
    />
  ) : (
    <table className="min-w-full overflow-x-auto bg-white dark:bg-zinc-950/60">
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index} className="py-5 px-4 text-left border-b text-zinc-600 dark:text-zinc-400 border-zinc-400 dark:border-zinc-800">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={index}
            className="hover:bg-zinc-200 dark:hover:bg-zinc-950 cursor-pointer"
          >
            {columns.map((col, subIndex) => (
              <td key={subIndex} className="py-2 px-4 h-12 border-b border-zinc-400 dark:border-zinc-800">
                {col.render(item)}
              </td>
            ))}
          </tr>

        ))}
      </tbody>
    </table>
  );
}


export default Table;
