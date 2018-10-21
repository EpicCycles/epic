import React, {Fragment} from "react";
import {
    moveObjectDownOnePlace,
    moveObjectToBottom,
    moveObjectToTop,
    moveObjectUpOnePlace,
    NEW_FRAMEWORK_ID
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
            <table key={`sections`} className="fixed_header">
                <thead>
                <tr key="sectionsHeaders">
                    <th>Section Name</th>
                    <th>Part Types</th>
                    <th>Position</th>
                </tr>
                </thead>
                <tbody>
                {sectionsToUse.map((section) => {
                    const componentKey = section.id ? section.id : section.dummyKey;
                    return (
                        <tr key={`section_${componentKey}`}>
                            <SectionEdit
                                key={`sectionEdit${componentKey}`}
                                section={section}
                                componentKey={componentKey}
                                handleSectionChange={this.handleSectionChange}
                            />
                            <td>
                                {sectionsToUse.length > 1 &&
                                <FrameworkMoves
                                    componentKey={componentKey}
                                    moveToTop={this.moveToTop}
                                    moveUp={this.moveUp}
                                    moveDown={this.moveDown}
                                    moveToBottom={this.moveToBottom}
                                />
                                }
                            </td>
                        </tr>
                    );
                })}
                <tr key={`section_new`}>
                    <SectionEdit
                        key="sectionEditNew"
                        section={{}}
                        componentKey={NEW_FRAMEWORK_ID}
                        updateSection={this.handleSectionChange}
                    />
                    <td/>
                </tr>
                </tbody>
            </table>
            {isLoading &&
            <Dimmer active inverted>
                <Loader content='Loading'/>
            </Dimmer>
            }

        </Fragment>;
    }
}

export default Framework;
