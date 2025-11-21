class Errors {
  static readonly ACCESS_DENIED = {
    errorCode: 0,
    message: 'access denied',
  };

  static readonly NOT_FOUND = {
    errorCode: 1,
    message: 'not found',
  };

  static readonly ALREADY_EXISTS = {
    errorCode: 2,
    message: 'already exists',
  };

  static readonly CITIZENSHIP_NOT_FOUND = {
    errorCode: 3,
    message: 'citizenship not found',
  };

  static readonly USER_NOT_FOUND = {
    errorCode: 4,
    message: 'user not found',
  };

  static readonly BAD_REQUEST = {
    errorCode: 5,
    message: 'bad request',
  };

  static readonly PHOTO_NOT_FOUND = {
    errorCode: 6,
    message: 'photo not found',
  };

  static readonly CITY_NOT_FOUND = {
    errorCode: 7,
    message: 'city not found',
  };

  static readonly ALREADY_RESPONDED = {
    errorCode: 8,
    message: 'already responded',
  };

  static readonly JOB_NOT_FOUND = {
    errorCode: 9,
    message: 'job not found',
  };

  static readonly EVENT_KEY_NOT_FOUND = {
    errorCode: 10,
    message: 'event key not found',
  };

  static readonly AUTH_PARAMS_NOT_VALID = {
    errorCode: 11,
    message: 'auth params not valid',
  };

  static readonly WAIT_BEFORE_NEXT_CODE = {
    errorCode: 12,
    message: 'wait before next code',
  };

  static readonly ONLY_IMAGES_ARE_ALLOWED = {
    errorCode: 13,
    message: 'only images are allowed',
  };

  static readonly ADDRESS_NOT_FOUND = {
    errorCode: 14,
    message: 'address not found',
  };

  static readonly PROVIDE_CITY_AND_ADDRESS = {
    errorCode: 15,
    message: 'provide city and address',
  };

  static readonly NOTIFICATIONS_DISABLED = {
    errorCode: 16,
    message: 'notifications disabled',
  };

  static readonly COMPANY_NOT_FOUND = {
    errorCode: 17,
    message: 'company not found',
  };
}

export default Errors;
