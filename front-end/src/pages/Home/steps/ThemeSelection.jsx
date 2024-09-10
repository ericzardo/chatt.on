import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import useNotification from "@hooks/useNotification";

import { ArrowRight } from "react-feather";
import TextSkeleton from "@components/skeleton/TextSkeleton";

import getThemes from "@services/themes/getThemes";

ThemeSelection.propTypes = {
  handleSelectTheme: PropTypes.func.isRequired,
};

function ThemeSelection ({ handleSelectTheme }) {
  const { handleNotification } = useNotification();

  const { data: themes, isLoading: isThemesLoading } = useQuery({
    queryKey: ["get-themes"],
    queryFn: () => getThemes(1, 10),
    retry: 2,
    onError: (error) => {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred."
      });
    }
  });

  return (
    <span className="flex flex-col lg:px-20 px-5 md:items-start">
      <h1 className="uppercase font-bold font-alternates text-3xl leading-relaxed text-zinc-900 dark:text-zinc-300">Themes</h1>

      <ul className="flex flex-col gap-6 py-16 w-full">
        {isThemesLoading && (
          [1, 2, 3, 4, 5].map((_, index) => (
            <li key={index} className="flex gap-2 items-center w-full h-6">
              <TextSkeleton />
            </li>
          ))
        )}
        {themes?.map((theme, index) => (
          <li
            key={theme?.name || `${index + 1} chat`}
            onClick={() => handleSelectTheme(theme)}
            className="flex gap-2 items-center cursor-pointer h-fit w-fit transition-transform hover:scale-110"
          >
            <p className="font-medium font-alternates text-xl leading-6 tracking-wide text-zinc-700 dark:text-zinc-400">
              {theme?.name || `${index + 1} chat`}
            </p>
            <ArrowRight className="dark:text-zinc-400 text-zinc-700" />
          </li>
        ))}
      </ul>

      

    </span>
  );
}

export default ThemeSelection;