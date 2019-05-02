import React from "react";
import {Link} from "react-router-dom";

const HeaderSection = props => (
    props.sectionContents.map(group => {
        return (
            <li className="dropdown" key={'navSection' + group.groupPos}>
                <p className="dropbtn">{group.groupHeader}</p>
                <div className="dropdown-content">
                    <div className="dropdown-section">{group.groupHeader}</div>
                    {group.groupLinks.map(linkData => {
                        return <Link
                            key={`link${linkData.linkNumber}`}
                            className="dropbtn"
                            to={linkData.linkRoute ? linkData.linkRoute : linkData.linkURL}
                        >
                            {linkData.displayText}
                        </Link>
                    })}
                </div>
            </li>
        )
    })
);
export default HeaderSection;

