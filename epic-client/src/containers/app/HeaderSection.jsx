import React, {Fragment} from "react";
import {Link} from "react-router-dom";

const HeaderSection = props => (
    <li className="dropdown">
        {props.sectionContents.map(section => {
            return (
                <Fragment key={'navSection' + section.sectionPos}>
                    <p className="dropbtn">{section.groupHeader}</p>
                    <div className="dropdown-content">
                        <div className="dropdown-section">{section.groupHeader}</div>
                        {section.groupLinks.map(linkData => {
                            return <Link
                                key={`link${linkData.linkRoute.substring(1)}`}
                                className="dropbtn"
                                to={linkData.linkRoute ? linkData.linkRoute : linkData.linkURL}
                            >
                                {linkData.displayText}
                            </Link>
                        })}
                    </div>
                </Fragment>
            )
        })}
    </li>
);
export default HeaderSection;

