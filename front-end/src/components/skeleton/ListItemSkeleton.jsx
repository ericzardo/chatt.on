function ListItemSkeleton () {
  return (
    <div className="flex items-center gap-2 p-1 w-full rounded-lg animate-pulse dark:bg-zinc-800 bg-zinc-300">
      <div className="w-10 h-10 min-w-10 rounded-md dark:bg-zinc-700 bg-zinc-400"></div>
      
      <div className="flex flex-col gap-2 w-full">
        <div className="h-2 rounded-md w-1/2 dark:bg-zinc-700 bg-zinc-400"></div>
        <div className="h-2 rounded-md w-3/4 dark:bg-zinc-700 bg-zinc-400"></div>
      </div>
    </div>
  );
}

export default ListItemSkeleton;
