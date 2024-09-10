import PropTypes from "prop-types";

ContainerModalTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

function ContainerModalTitle ({ title }) {
  return (
    <p className="font-semibold font-alternates text-xl leading-snug text-zinc-900 dark:text-zinc-50">
      {title}
    </p>
  );
}

export default ContainerModalTitle;