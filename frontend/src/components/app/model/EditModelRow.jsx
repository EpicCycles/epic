import React, { Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { eliminateReadOnlyFields, getModelKey } from './helpers/model';
import EditModelInput from './EditModelInput';
import { fieldAlignment, gridItemClass } from './helpers/display';
import ModelEditIcons from './ModelEditIcons';
import IconArray from '../../../common/IconArray';
import ModelViewRowField from './ModelViewRowField';

const EditModelRow = props => {
  const {
    model,
    modelFields,
    persistedModel,
    className,
    onChange,
    lockFirstColumn,
    brands,
    sections,
    suppliers,
    actionsRequired,
    modelSave,
    modelDelete,
    modelReset,
    additionalActions,
    dummyRow,
    showReadOnlyFields,
  } = props;
  const componentKey = getModelKey(model);
  const fieldsToShow = showReadOnlyFields ? modelFields : eliminateReadOnlyFields(modelFields);
  return (
    <Fragment>
      {fieldsToShow.map((field, index) => {
        return (
          <div
            className={gridItemClass(
              `${className} ${fieldAlignment(field)}`,
              index,
              lockFirstColumn,
            )}
            key={`modelRow${field.fieldName}${componentKey}`}
          >
            {!dummyRow && field.readOnly && (
              <ModelViewRowField
                field={field}
                model={model}
                brands={brands}
                sections={sections}
                suppliers={suppliers}
              />
            )}
            {!dummyRow && !field.readOnly && (
              <EditModelInput
                field={field}
                model={model}
                persistedModel={persistedModel}
                componentKey={componentKey}
                index={index}
                onChange={onChange}
                brands={brands}
                sections={sections}
                suppliers={suppliers}
              />
            )}
          </div>
        );
      })}
      {actionsRequired && (
        <div
          className={gridItemClass(className, 1, lockFirstColumn)}
          key={`modelRowActions${componentKey}`}
        >
          {!dummyRow && (
            <ModelEditIcons
              componentKey={componentKey}
              model={model}
              modelReset={modelReset}
              modelDelete={modelDelete}
              modelSave={modelSave}
            />
          )}
          {!dummyRow && <IconArray componentKey={componentKey} actionArray={additionalActions} />}
        </div>
      )}
    </Fragment>
  );
};
EditModelRow.propTypes = {
  model: PropTypes.object.isRequired,
  modelFields: PropTypes.array.isRequired,
  persistedModel: PropTypes.object,
  className: PropTypes.string,
  sections: PropTypes.array,
  brands: PropTypes.array,
  suppliers: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  lockFirstColumn: PropTypes.bool,
  actionsRequired: PropTypes.bool,
  modelSave: PropTypes.func,
  modelReset: PropTypes.func,
  modelDelete: PropTypes.func,
  additionalActions: PropTypes.array,
  dummyRow: PropTypes.bool,
  showReadOnlyFields: PropTypes.bool,
};

export default EditModelRow;
