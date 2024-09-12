import { useDrag } from "react-dnd";
import PropTypes from "prop-types";
import { Move } from "react-feather";

DraggableRow.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function DraggableRow ({ item, index, columns }) {
  const [{ isDragging }, drag] = useDrag({
    type: "ROW",
    item: { id: item.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <tr ref={drag} className="cursor-pointer" style={{ opacity: isDragging ? 0.5 : 1 }}>

      <td className="py-2 px-4 h-12 border-b border-zinc-400 dark:border-zinc-800">
        <Move className="dark:text-zinc-800 hover:dark:text-zinc-600 text-zinc-300 hover:text-zinc-400 w-4 h-4 hover:scale-110" />
      </td>

      {columns.map((col, colIndex) => (
        <td key={colIndex} className="py-2 px-4 h-12 border-b border-zinc-400 dark:border-zinc-800">
          {col.render(item)}
        </td>
      ))}
    </tr>
  );
}

export default DraggableRow;
