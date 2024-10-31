import responseStatus from './responseStatus.js';

/**
 * responseBody object contains methods for generating standardized
 * response formats for different types of API responses.
 */
const responseBody = {
  
  /**
   * Generates a successful response format.
   *
   * @param {Object} data - Optional data to include in the response.
   * @returns {Object} - Formatted success response.
   */
  success: (data = {}) => ({
    status: responseStatus.success, 
    message: data.message || 'Your request is successfully executed', 
    data: data.data && Object.keys(data.data).length ? data.data : null, 
  }),

  /**
   * Generates a failure response format.
   *
   * @param {Object} data - Optional data to include in the response.
   * @returns {Object} - Formatted failure response.
   */
  failure: (data = {}) => ({
    status: responseStatus.failure, 
    message: data.message || 'Some error occurred while performing action.', 
    data: data.data && Object.keys(data.data).length ? data.data : null, 
  }),

  /**
   * Generates an internal server error response format.
   *
   * @param {Object} data - Optional data to include in the response.
   * @returns {Object} - Formatted internal server error response.
   */
  internalServerError: (data = {}) => ({
    status: responseStatus.serverError, 
    message: data.message || 'Internal server error.',
    data: data.data && Object.keys(data.data).length ? data.data : null, 
  }),

  /**
   * Generates a bad request response format.
   *
   * @param {Object} data - Optional data to include in the response.
   * @returns {Object} - Formatted bad request response.
   */
  badRequest: (data = {}) => ({
    status: responseStatus.badRequest, 
    message: data.message || 'Request parameters are invalid or missing.', 
    data: data.data && Object.keys(data.data).length ? data.data : null, 
  }),

  /**
   * Generates a record not found response format.
   *
   * @param {Object} data - Optional data to include in the response.
   * @returns {Object} - Formatted record not found response.
   */
  recordNotFound: (data = {}) => ({
    status: responseStatus.recordNotFound, 
    message: data.message || 'Record(s) not found with specified criteria.', 
    data: data.data && Object.keys(data.data).length ? data.data : null, 
  }),

  /**
   * Generates a validation error response format.
   *
   * @param {Object} data - Optional data to include in the response.
   * @returns {Object} - Formatted validation error response.
   */
  validationError: (data = {}) => ({
    status: responseStatus.validationError,
    message: data.message || `Invalid Data, Validation Failed.`, 
    data: data.data && Object.keys(data.data).length ? data.data : null, 
  }),

  /**
   * Generates an unauthorized response format.
   *
   * @param {Object} data - Optional data to include in the response.
   * @returns {Object} - Formatted unauthorized response.
   */
  unAuthorized: (data = {}) => ({
    status: responseStatus.unauthorized, 
    message: data.message || 'You are not authorized to access the request',
    data: data.data && Object.keys(data.data).length ? data.data : null, 
  }),
};

export default responseBody;