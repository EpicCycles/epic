import React, {Fragment} from "react";
import {
    moveObjectDownOnePlace,
    moveObjectToBottom,
    moveObjectToTop,
    moveObjectUpOnePlace,
    NEW_FRAMEWORK_ID, renumberAll
} from "../../helpers/framework";
import SectionEdit from "./SectionEdit";
import FrameworkMoves from "./FrameworkMoves";
import {findIndexOfObjectWithKey} from "../../helpers/utils";
import {Button, Dimmer, Loader} from "semantic-ui-react";
import {Prompt} from "react-router";

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
    saveChanges = () => {
        this.props.saveFramework(renumberAll(this.props.sections));
    };

    render() {
        const {
            sections,
            isLoading
        } = this.props;
        const sectionsToUse = sections ? sections.filter(section => !(section.delete || (section.dummyKey === NEW_FRAMEWORK_ID))) : [];
        const sectionsWithChanges = sections ? sections.filter(section => (section.delete || section.changed)) : [];
        const newSections = sections ? sections.filter(section => (section.dummyKey === NEW_FRAMEWORK_ID)) : [];
        let newSectionForDisplay = (newSections.length > 0) ? newSections[0] : {};
        const changesExist = sectionsWithChanges.length > 0;
        return <Fragment>
            <Prompt
                when={changesExist}
                message="You have made changes to the framework. Cancel and Save if you do not want to lose them."
            />
            <table key={`sections`} className="fixed_header">
                <thead>
                <tr key="sectionsHeaders" className="section">
                    <th></th>
                    <th className="three-quarters">Section</th>
                    <th>Position</th>
                    <th><Button onClick={this.saveChanges} disabled={isLoading || !changesExist}>
                        Save
                    </Button></th>
                </tr>
                </thead>
                <tbody>
                {sectionsToUse.map((section) => {
                    const componentKey = section.id ? section.id : section.dummyKey;
                    const className = section.error ? "error" : "";
                    const rowTitle = section.error ? section.error_detail : "";
                    return (
                        <tr
                            key={`section_${componentKey}`}
                            className={className}
                            title={rowTitle}
                        >
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
                            <td></td>
                        </tr>
                    );
                })}
                <tr key={`section_new`}>
                    <SectionEdit
                        key="sectionEditNew"
                        section={newSectionForDisplay}
                        componentKey={NEW_FRAMEWORK_ID}
                        handleSectionChange={this.handleSectionChange}
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
