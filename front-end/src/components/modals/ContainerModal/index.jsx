import PropTypes from "prop-types";

import ContainerModalRoot from "./Root";
import ContainerModalTitle from "./Title";
import withClickOutside from "@components/hoc/withClickOutside";

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

const ContainerModalRootWithHandled = withClickOutside(ContainerModalRoot);

export default ContainerModalRootWithHandled;