import React from "react";
import * as PropTypes from "prop-types";

// have an array of title, parent component has state which is current selected tab index

const TabbedView  = (props) => {
   const { currentTab, tabs, changeTab  } = props;
   const selectedTab = currentTab;
    return <ul className="tabrow" data-test="tab-row">
        {tabs.map ((tab, index) => <li
            id={`tab${index}`}
            key={`tab${index}`}
            onClick={() => (index !== selectedTab) && changeTab(index)}
            className={(index === selectedTab) ? "tabSelected" : "tabUnselected"}
            data-test="tab"
        >
            {tab}
        </li>)}
    </ul>
};

TabbedView.defaultProps = {
   currentTab: 0,
};
TabbedView.propTypes = {
    currentTab: PropTypes.number,
    tabs: PropTypes.array.isRequired,
    changeTab: PropTypes.func.isRequired,
};
export default TabbedView;