export const CLEAR_FRAME = "bike/CLEAR_FRAME";
export const GET_BIKE = "bike/GET_BIKE";
export const GET_BIKE_PARTS = "bike/GET_BIKE_PARTS";
export const BIKE_REVIEW_START = "bike/BIKE_REVIEW_START";
export const BIKE_REVIEW_BIKE = "bike/BIKE_REVIEW_BIKE";
export const BIKE_DELETE = "bike/BIKE_DELETE";
export const BIKE_ADD_PART = "bike/BIKE_ADD_PART";
export const BIKE_SAVE = "bike/BIKE_SAVE";
export const BIKE_PART_DELETE = "bike/BIKE_PART_DELETE";
export const BIKE_PART_SAVE = "bike/BIKE_PART_SAVE";
export const FRAME_ARCHIVE = "bike/FRAME_ARCHIVE";
export const FRAME_DELETE = "bike/FRAME_DELETE";
export const FRAME_SAVE = "bike/FRAME_SAVE";
export const FRAME_UPLOAD = "bike/FRAME_UPLOAD";
export const FRAME_LIST = "bike/FRAME_LIST";


export const clearFrame = () => ({
    type: CLEAR_FRAME
});
export const saveBike = (bike) => ({
    type: `${BIKE_SAVE}_REQUESTED`,
    payload: { bike }
});
export const saveBikeOK = (bike) => ({
    type: `${BIKE_SAVE}_OK`,
    payload: { bike }
});
export const saveBikeError = (error) => ({
    type: `${BIKE_SAVE}_ERROR`,
    payload: error
});
export const getBikeParts = (bikeId) => ({
    type: `${GET_BIKE_PARTS}_REQUESTED`,
    payload: { bikeId }
});
export const getBikePartsOK = (responseData) => ({
    type:  `${GET_BIKE_PARTS}_OK`,
    payload: responseData
});
export const getBikePartsError = (error) => ({
    type: `${GET_BIKE_PARTS}_ERROR`,
    payload: error
});
export const getBike = (bikeId) => ({
    type: `${GET_BIKE}_REQUESTED`,
    payload: { bikeId }
});
export const getBikeOK = (responseData) => ({
    type:  `${GET_BIKE}_OK`,
    payload: responseData
});
export const getBikeError = (error) => ({
    type: `${GET_BIKE}_ERROR`,
    payload: error
});
export const saveBikePart = (bikeId, part) => ({
    type: `${BIKE_PART_SAVE}_REQUESTED`,
    payload: { bikeId, part }
});
export const saveBikePartOK = (parts) => ({
    type: `${BIKE_PART_SAVE}_OK`,
    payload: { parts }
});
export const saveBikePartError = (error) => ({
    type: `${BIKE_PART_SAVE}_ERROR`,
    payload: error
});
export const addBikePart = (bikeId, part) => ({
    type: `${BIKE_ADD_PART}_REQUESTED`,
    payload: { bikeId, part }
});
export const addBikePartOK = (parts) => ({
    type: `${BIKE_ADD_PART}_OK`,
    payload: { parts }
});
export const addBikePartError = (error) => ({
    type: `${BIKE_ADD_PART}_ERROR`,
    payload: error
});
export const deleteBikePart = (bikeId, partId) => ({
    type: `${BIKE_PART_DELETE}_REQUESTED`,
    payload: { bikeId, partId }
});
export const deleteBikePartOK = (responseData) => ({
    type: `${BIKE_PART_DELETE}_OK`,
    payload: responseData
});
export const deleteBikePartError = (error) => ({
    type: `${BIKE_PART_DELETE}_ERROR`,
    payload: error
});
export const reviewBikes = (bikeReviewList) => ({
    type:BIKE_REVIEW_START,
    payload: {bikeReviewList}
});
export const reviewBike = (bikeId) => ({
    type:BIKE_REVIEW_BIKE,
    payload: { bikeId }
});

export const deleteBikes = (bikeDeleteList, searchCriteria) => ({
    type: `${BIKE_DELETE}_REQUESTED`,
    payload: { bikeDeleteList, searchCriteria }
});
export const deleteBikesError = (error) => ({
    type: `${BIKE_DELETE}_ERROR`,
    payload: error
});
export const bikeDeleted = (bikeId) => ({
    type: `${BIKE_DELETE}_PROCESSED`,
    payload: { bikeId }
});
export const deleteBikesSuccess = () => ({
    type: `${BIKE_DELETE}_OK`
});
export const archiveFrames = (frameArchiveList, searchCriteria) => ({
    type: `${FRAME_ARCHIVE}_REQUESTED`,
    payload: { frameArchiveList, searchCriteria }
});
export const archiveFramesError = (error) => ({
    type: `${FRAME_ARCHIVE}_ERROR`,
    payload: error
});
export const archiveFramesSuccess = () => ({
    type: `${FRAME_ARCHIVE}_OK`
});
export const deleteFrames = (frameDeleteList, searchCriteria) => ({
    type: `${FRAME_DELETE}_REQUESTED`,
    payload: { frameDeleteList, searchCriteria }
});
export const deleteFramesError = (error) => ({
    type: `${FRAME_DELETE}_ERROR`,
    payload: error
});
export const deleteFramesSuccess = () => ({
    type: `${FRAME_DELETE}_OK`
});
export const saveFrame = (frame, searchCriteria) => ({
    type: `${FRAME_SAVE}_REQUESTED`,
    payload: { frame, searchCriteria }
});
export const saveFrameError = (error) => ({
    type: `${FRAME_SAVE}_ERROR`,
    payload: error
});
export const saveFrameSuccess = (frame) => ({
    type: `${FRAME_SAVE}_OK`,
    payload: frame
});
export const uploadFrame = (frame) => ({
    type: `${FRAME_UPLOAD}_REQUESTED`,
    payload: { frame }
});
export const uploadFrameError = (error) => ({
    type: `${FRAME_UPLOAD}_ERROR`,
    payload: error
});
export const uploadFrameSuccess = () => ({
    type: `${FRAME_UPLOAD}_OK`,
});
export const getFrameList = (searchCriteria) => ({
    type: `${FRAME_LIST}_REQUESTED`,
    payload: searchCriteria
});
export const getFrameListOK = (apiData) => ({
    type: `${FRAME_LIST}_OK`,
    payload: apiData
});
export const getFrameListError = (error) => ({
    type: `${FRAME_LIST}_ERROR`,
    payload: error
});
