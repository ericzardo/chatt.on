function MessageSkeleton () {
  const getRandomWidth = () => {
    const widths = ["w-3/4", "w-2/3", "w-1/2", "w-1/3"];
    return widths[Math.floor(Math.random() * widths.length)];
  };

  return (
    <div className="flex gap-2 items-start animate-pulse">

      <span className="w-8 h-8 bg-zinc-400 dark:bg-zinc-700 rounded-full flex-shrink-0"></span>


      <div className="flex flex-col gap-1 w-full">
        <span className="flex gap-3 items-center">

          <div className="w-24 h-4 bg-zinc-400 dark:bg-zinc-700 rounded-lg"></div>

          <div className="w-16 h-3 bg-zinc-400 dark:bg-zinc-700 rounded-lg"></div>
        </span>


        <div className={`h-5 bg-zinc-400 dark:bg-zinc-700 rounded ${getRandomWidth()}`}></div>

        <div className={`h-5 bg-zinc-400 dark:bg-zinc-700 rounded ${getRandomWidth()}`}></div>
        
      </div>
    </div>
  );
}

export default MessageSkeleton;
