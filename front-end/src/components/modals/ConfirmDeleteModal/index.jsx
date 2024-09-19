
import PropTypes from "prop-types";

import { AlertTriangle } from "react-feather";
import Button from "@components/ui/Button";
import withClickOutside from "@components/hoc/withClickOutside";

ConfirmDeleteModal.propTypes = {
  item: PropTypes.object.isRequired,
  onConfirm: PropTypes.func.isRequired,
  handleConfirmDeleteModal: PropTypes.func.isRequired,
};

function ConfirmDeleteModal ({ item, onConfirm, handleConfirmDeleteModal }) {

  return (

        
    <div className="bg-zinc-100 dark:bg-zinc-900 rounded-xl mx-2 md:m-0 p-5 flex flex-col gap-3 max-w-96">
      <span className="flex items-center justify-between gap-4">
        <AlertTriangle className="w-12 h-12 text-red-700 dark:text-red-500" />
        <p className="dark:text-zinc-200 text-zinc-700 font-alternates font-semibold text-xl">
          Are you sure you want to delete &quot;{item.name || item.username}&quot;
        </p>
      </span>

      <p className="dark:text-zinc-400 text-zinc-500 text-sm">This item will be deleted immediately. You can&apos;t undo this action.</p>

      <span className="flex gap-4 items-center justify-end">
        <Button type="button" size="sm" onClick={handleConfirmDeleteModal} >
            Cancel
        </Button>
        <Button type="button" size="sm" color="transparent" onClick={() => onConfirm(item)} >
            Delete
        </Button>
      </span>
    </div>
  );
}

const ConfirmDeleteModalWithHandled = withClickOutside(ConfirmDeleteModal);

export default ConfirmDeleteModalWithHandled;