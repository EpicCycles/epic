import React, {Fragment} from "react";
import {Link} from "react-router-dom";

const MenuSection = props => (
    <Fragment>
        {props.sectionContents.map(section => {
            return (
                <Fragment key={'menuSection' + section.sectionPos}>
                    <h2>{section.groupHeader}</h2>
                    <div className="">
                        {section.groupLinks.map(linkData => {
                            return <Link
                                key={`menuLink${linkData.linkNumber}`}
                                className="internal_link"
                                to={linkData.linkRoute ? linkData.linkRoute : linkData.linkURL}
                            >
                                {linkData.displayText}
                            </Link>
                        })}
                    </div>
                </Fragment>
            )
        })}
    </Fragment>
);
export default MenuSection;

