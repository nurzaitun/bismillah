'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

class ExceptionHandler extends BaseExceptionHandler {
  async handle (error, { request, response }) {
    switch (error.name) {
      case 'InvalidSessionException':
        return response.route('AuthController.login');
      default:
        return super.handle(...arguments);
    }
  }

  async report (error, { request }) {
  }
}

module.exports = ExceptionHandler
