import PropTypes from "prop-types";
import TextSkeleton from "./TextSkeleton";

TableSkeleton.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    header: PropTypes.string.isRequired,
  })),
};

function TableSkeleton ({ columns = [1, 2, 3] }) {
  const data = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="overflow-x-auto my-10 rounded-lg flex w-full">
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
          {data.map((col, index) => (
            <tr key={index} className="hover:bg-zinc-200 dark:hover:bg-zinc-950 cursor-pointer">
              {columns.map((col, index) => (
                <td key={index} className="py-2 px-4 h-12 border-b border-zinc-400 dark:border-zinc-800">
                  <TextSkeleton />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableSkeleton;