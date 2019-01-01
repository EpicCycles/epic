import {connect} from 'react-redux'
import {getBrands} from "../../state/actions/core";
import {getFramework} from "../../state/actions/framework";
import {getParts} from "../../state/sagas/part";
import {clearParts} from "../../state/actions/part";

const mapStateToProps = ({ core, framework, part }) => {
    return {
        brands: core.brands,
        sections: framework.sections,
        isLoading: (part.isLoading),
        parts: part.parts,
        supplier_parts: part.supplier_parts,
    }
};
const mapDispatchToProps = {
    getBrands,
    getFramework,
    getParts,
    clearParts,
    saveSupplierParts,
};
export default connect(mapStateToProps, mapDispatchToProps)(SupplierPartReview)

