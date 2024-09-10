import PropTypes from "prop-types";

import ContainerModalRoot from "./Root";
import ContainerModalTitle from "./Title";

ContainerModal.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

function ContainerModal ({ title, children }) {
  return (
    <ContainerModalRoot >
      <ContainerModalTitle title={title} />
      
      <div>
        {children}
      </div>
    </ContainerModalRoot>
  );
}

export default ContainerModal;