import {connect} from 'react-redux'
import {getBrandsAndSuppliers, saveBrands, updateBrands} from "../../state/actions/core";
import Brands from "./Brands";

export default connect(({core}) => ({
    brands: core.brands,
    suppliers: core.suppliers,
    isLoading: core.isLoading,
}), {
    getBrandsAndSuppliers,
    saveBrands,
    updateBrands
})(Brands)
