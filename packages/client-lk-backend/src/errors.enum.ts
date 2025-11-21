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

  static readonly USER_NOT_FOUND = {
    errorCode: 3,
    message: 'user not found',
  };

  static readonly BAD_REQUEST = {
    errorCode: 4,
    message: 'bad request',
  };

  static readonly PHOTO_NOT_FOUND = {
    errorCode: 5,
    message: 'photo not found',
  };

  static readonly ENTER_ORGANIZATION_NAME = {
    errorCode: 6,
    message: 'enter organization name',
  };

  static readonly ONLY_IMAGES_ARE_ALLOWED = {
    errorCode: 7,
    message: 'only images are allowed',
  };

  static readonly AUTH_PARAMS_NOT_VALID = {
    errorCode: 8,
    message: 'auth params not valid',
  };

  static readonly WAIT_BEFORE_NEXT_CODE = {
    errorCode: 9,
    message: 'wait before next code',
  };

  static readonly PHONE_ALREADY_IN_USE = {
    errorCode: 10,
    message: 'phone already in use',
  };

  static readonly CITY_NOT_FOUND = {
    errorCode: 11,
    message: 'city not found',
  };

  static readonly WAIT_FOR_SYNC = {
    errorCode: 12,
    message: 'wait for sync',
  };
}

export default Errors;
