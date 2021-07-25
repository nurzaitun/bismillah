'use strict'

const User = use('App/Models/User');

class AuthUserDatum {
  async handle ({ request, auth }, next) {
    try {
      const user = await auth.getUser();
      const View = use('View');
      View.global('userDisplayName', await user.getDisplayName());
      View.global('profile', await User.query().where('id', user.id).with('school').first());
    } catch (error) {
    }

    await next();
  }
}

module.exports = AuthUserDatum
