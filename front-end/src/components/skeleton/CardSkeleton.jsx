function CardSkeleton () {
  return (
    <div className="w-80 h-56 gap-3 p-3 rounded-xl shadow-sm animate-pulse dark:bg-zinc-800 bg-zinc-300">
      <span className="flex h-32 dark:bg-zinc-700 rounded-lg"></span>
      <span className="flex h-max flex-1 flex-col justify-between py-5 gap-5">
        <span className="flex w-4/5 h-2 gap-3 items-center dark:bg-zinc-700 bg-zinc-400"></span>
        <div className="flex justify-between items-center gap-5">
          <span className="flex h-2 flex-1 gap-1 items-center dark:bg-zinc-700 bg-zinc-400"></span>
          <span className="flex h-2 flex-1 gap-1 items-center dark:bg-zinc-700 bg-zinc-400"></span> 
        </div>
      </span>
    </div>
  );
}

export default CardSkeleton;