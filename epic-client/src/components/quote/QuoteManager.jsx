import React, {Fragment} from 'react'
import TabbedView from "../../common/TabbedView";
import * as PropTypes from "prop-types";
import {doWeHaveObjects} from "../../helpers/utils";

const tabs = [
    "Customer" ,
    "Bike" ,
    "Quote List" ,
    "Quote detail" ,
];
const initialState = {
    tab: 0,
};
class QuoteManager  extends React.Component {
    state = initialState;

    componentDidMount() {
        this.checkPropsData();
    };

    // componentDidUpdate(prevProps) {
    //     this.checkPropsData();
    // };
    checkPropsData = () => {
        if (!this.props.isLoading) this.getData();
    };
    getData = () => {
        let brandsRequired = true;
        let frameworkRequired = true;

        if (doWeHaveObjects(this.props.brands)) brandsRequired = false;
        if (doWeHaveObjects(this.props.sections)) frameworkRequired = false;

          if (brandsRequired) {
            this.props.getBrandsAndSuppliers();
        }
        if (frameworkRequired) {
            this.props.getFramework();
        }
    };
    changeCurrentTab = (newTab) => {
        if (newTab !== this.state.tab) this.setState({tab: newTab})
    };
    render() {
        const { tab } = this.state;
        return <Fragment>
            <TabbedView tabs={tabs} changeTab={this.changeCurrentTab} currentTab={tab}/>

        </Fragment>
    };
}

QuoteManager.defaultProps = {
    parts: [],
    brands: [],
    sections: [],
    isLoading: false,

};

QuoteManager.propTypes = {
    bikes: PropTypes.array.isRequired,
    bikeParts: PropTypes.array.isRequired,
    brands: PropTypes.array,
    sections: PropTypes.array,
    parts: PropTypes.array.isRequired,
    frames: PropTypes.array.isRequired,
    getBrandsAndSuppliers: PropTypes.func.isRequired,
    saveBrands: PropTypes.func.isRequired,
    getFramework: PropTypes.func.isRequired,
   listParts: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};

export default QuoteManager;