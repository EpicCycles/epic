import React, {Fragment} from "react";
import {
    moveObjectDownOnePlace,
    moveObjectToBottom,
    moveObjectToTop,
    moveObjectUpOnePlace
} from "../../helpers/framework";
import SectionEdit from "./SectionEdit";
import FrameworkMoves from "./FrameworkMoves";
import {findIndexOfObjectWithKey} from "../../helpers/utils";
import {Dimmer, Loader} from "semantic-ui-react";

class Framework extends React.Component {
    componentWillMount() {
        if (!(this.props.sections && this.props.sections.length > 0)) {
            this.props.getFramework();
        }
    };

    handleSectionChange = (sectionKey, updatedSection) => {
        const sectionsWithUpdates = this.props.sections.slice();
        const sectionToUpdateIndex = findIndexOfObjectWithKey(sectionsWithUpdates, sectionKey);
        if (sectionToUpdateIndex > -1) {
            sectionsWithUpdates[sectionToUpdateIndex] = updatedSection;
        } else {
            sectionsWithUpdates.push(updatedSection);
        }
        this.props.updateFramework(sectionsWithUpdates);
    };
    moveUp = (fieldName) => {
        const fields = fieldName.split('_');
        const sectionKey = fields[1];
        this.props.updateFramework(moveObjectUpOnePlace(this.props.sections, sectionKey));
    };
    moveDown = (fieldName) => {
        const fields = fieldName.split('_');
        const sectionKey = fields[1];
        this.props.updateFramework(moveObjectDownOnePlace(this.props.sections, sectionKey));
    };
    moveToTop = (fieldName) => {
        const fields = fieldName.split('_');
        const sectionKey = fields[1];
        this.props.updateFramework(moveObjectToTop(this.props.sections, sectionKey));
    };
    moveToBottom = (fieldName) => {
        const fields = fieldName.split('_');
        const sectionKey = fields[1];
        this.props.updateFramework(moveObjectToBottom(this.props.sections, sectionKey));
    };

    render() {
        const {
            sections,
            isLoading,
            saveFramework
        } = this.props;
        const sectionsToUse = sections ? sections.filter(section => !section.delete) : [];
        return <Fragment>
            <ul key={`sections`}>
                {sectionsToUse.map((section) => {
                    const componentKey = section.id ? section.id : section.dummyKey;
                    return (
                        <Fragment>
                            <SectionEdit
                                key={`sectionEdit${componentKey}`}
                                section={section}
                                componentKey={componentKey}
                                handleSectionChange={this.handleSectionChange}
                            />
                            {sectionsToUse.length > 1 &&
                            <FrameworkMoves
                                componentKey={"new"}
                                moveToTop={this.moveToTop}
                                moveUp={this.moveUp}
                                moveDown={this.moveDown}
                                moveToBottom={this.moveToBottom}
                            />
                            }
                        </Fragment>
                    );
                })}
                <SectionEdit
                    key="sectionEditNew"
                    section={{}}
                    componentKey={"new"}
                    updateSection={this.handleSectionChange}
                />
            </ul>
            {isLoading &&
            <Dimmer active inverted>
                <Loader content='Loading'/>
            </Dimmer>
            }

        </Fragment>;
    }
}

export default Framework;
