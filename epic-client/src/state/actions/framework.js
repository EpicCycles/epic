export const FRAMEWORK = 'framework/FRAMEWORK';
export const FRAMEWORK_SAVE = 'framework/FRAMEWORK_SAVE';
export const FRAMEWORK_UPDATE = 'framework/FRAMEWORK_UPDATE';

export const getFramework =  ()  => ({
    type: `${FRAMEWORK}_REQUESTED`,
    payload: { }
});

export const getFrameworkSuccess = sections => ({
    type: FRAMEWORK,
    payload: sections
});

export const getFrameworkFailure = error => ({
    type: `${FRAMEWORK}_ERROR`,
    payload: error
});

export const saveFramework =  sections  => ({
    type: `${FRAMEWORK_SAVE}_REQUESTED`,
    payload: { sections }
});

export const saveFrameworkSuccess = sections => ({
    type: FRAMEWORK_SAVE,
    payload: sections
});

export const saveFrameworkFailure = error => ({
    type: `${FRAMEWORK_SAVE}_ERROR`,
    payload: error
});

export const updateFramework = sections => ({
    type: FRAMEWORK_UPDATE,
    payload: sections
});
