import React from "react";
import * as PropTypes from "prop-types";

// have an array of title, parent compoent has state which is current selected tab index

const TabbedView  = (props) => {
   const { currentTab, tabs, changeTab  } = props;
   const selectedTab = currentTab ? currentTab : 0;
    return <ul className="tabrow">
        {tabs.map ((tab, index) => <li
            id={`tab${index}`}
            key={`tab${index}`}
            onClick={() => (index !== selectedTab) && changeTab(index)}
            className={(index === selectedTab) ? "tabSelected" : "tabUnselected"}
        >
            {tab}
        </li>)}
    </ul>
};

TabbedView.propTypes = {
    currentTab: PropTypes.number,
    tabs: PropTypes.array.isRequired,
    changeTab: PropTypes.func.isRequired,
};
export default TabbedView;