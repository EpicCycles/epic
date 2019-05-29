import { connect } from 'react-redux';
import {
  deletePart,
  deleteSupplierProduct,
  savePart,
  saveSupplierProduct,
} from '../../state/actions/part';
import SupplierProductReview from '../../components/supplierProduct/SupplierProductReview';
import { addMessage } from '../../state/actions/application';

const mapStateToProps = ({ core, framework, part }) => {
  return {
    brands: core.brands,
    suppliers: core.suppliers,
    sections: framework.sections,
    isLoading: framework.isLoading || core.isLoading || part.isLoading,
    parts: part.parts,
    supplierProducts: part.supplierProducts,
  };
};
const mapDispatchToProps = {
  savePart,
  deletePart,
  saveSupplierProduct,
  deleteSupplierProduct,
  addMessage,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SupplierProductReview);
