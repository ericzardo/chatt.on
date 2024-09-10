import PropTypes from "prop-types";
import { Users, Calendar } from "react-feather";

ChatCardInfos.propTypes = {
  onlineUsers: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
};

function ChatCardInfos ({ onlineUsers, createdAt }) {
  return (
    <div className="flex justify-between items-center">
      <span className="flex gap-1 text-zinc-500 dark:text-zinc-400 items-center">
        <Users className="w-4 h-4" />
        <p className="font-medium text-sm">{onlineUsers}</p>
      </span>

      <span className="flex gap-1 text-zinc-500 dark:text-zinc-400 items-center">
        <Calendar className="w-4 h-4" />
        <p className="font-medium text-sm">{createdAt}</p>
      </span>
            
    </div>
  );
}

export default ChatCardInfos;