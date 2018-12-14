export const CLEAR_FRAME = "bike/CLEAR_FRAME";
export const FRAME_ARCHIVE_REQUESTED = "bike/FRAME_ARCHIVE_REQUESTED";
export const FRAME_ARCHIVE_OK = "bike/FRAME_ARCHIVE_OK";
export const FRAME_ARCHIVE_ERROR = "bike/FRAME_ARCHIVE_ERROR";
export const FRAME_SAVE_REQUESTED = "bike/FRAME_SAVE_REQUESTED";
export const FRAME_SAVE_OK = "bike/FRAME_SAVE_OK";
export const FRAME_SAVE_ERROR = "bike/FRAME_SAVE_ERROR";
export const FRAME_UPLOAD_REQUESTED = "bike/FRAME_UPLOAD_REQUESTED";
export const FRAME_UPLOAD_OK = "bike/FRAME_UPLOAD_OK";
export const FRAME_UPLOAD_ERROR = "bike/FRAME_UPLOAD_ERROR";
export const FRAME_LIST_REQUESTED = "bike/FRAME_LIST_REQUESTED";
export const FRAME_LIST_OK = "bike/FRAME_LIST_OK";
export const FRAME_LIST_ERROR = "bike/FRAME_LIST_ERROR";


export const clearFrame = () => ({
    type: CLEAR_FRAME
});
export const archiveFrames = (frameArchiveList, searchCriteria) => ({
    type: FRAME_ARCHIVE_REQUESTED,
    payload: { frameArchiveList, searchCriteria }
});
export const archiveFramesError = (error) => ({
    type: FRAME_ARCHIVE_ERROR,
    payload: error
});
export const archiveFramesSuccess = () => ({
    type: FRAME_ARCHIVE_OK
});
export const saveFrame = (frame, searchCriteria) => ({
    type: FRAME_SAVE_REQUESTED,
    payload: { frame, searchCriteria }
});
export const saveFrameError = (error) => ({
    type: FRAME_SAVE_ERROR,
    payload: error
});
export const saveFrameSuccess = (frame) => ({
    type: FRAME_SAVE_OK,
    payload: frame
});
export const uploadFrame = (frame) => ({
    type: FRAME_UPLOAD_REQUESTED,
    payload: { frame }
});
export const uploadFrameError = (error) => ({
    type: FRAME_UPLOAD_ERROR,
    payload: error
});
export const uploadFrameSuccess = (frame) => ({
    type: FRAME_UPLOAD_OK,
    payload: frame
});
export const getFrameList = (searchCriteria) => ({
    type: FRAME_LIST_REQUESTED,
    payload: searchCriteria
});
export const getFrameListOK = (frames) => ({
    type: FRAME_LIST_OK,
    payload: frames
});
export const getFrameListError = (error) => ({
    type: FRAME_LIST_ERROR,
    payload: error
});
