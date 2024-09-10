function TextSkeleton () {
  const getRandomWidth = () => {
    const widths = ["w-3/4", "w-2/3", "w-1/2"];
    return widths[Math.floor(Math.random() * widths.length)];
  };

  return (
    <div
      className={`${getRandomWidth()} h-4 bg-zinc-300 dark:bg-zinc-800 rounded-md shadow-sm animate-pulse`}
    >
    </div>
  );
}

export default TextSkeleton;
