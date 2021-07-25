'use strict'
const User = use('App/Models/User');
const minify = use('App/Helpers/Minify');

class AuthController {

  async login({ request, response, auth, view }) {
    try {
      await auth.check();
      return response.redirect('/');
    } catch (error) {
      return view.render('auth/login');
    }
  }

  async loginSent({ request, response, session, auth, view }) {
    const cred = request.all();
    try {
      const validation = await User.validate(cred);
      if (validation.fails()) {
        session
          .withErrors(validation.messages())
          .flashExcept(['password']);
        throw Error();
      }

      const user = await User.query().where('phone', cred.phone).first();
      if (user === null) {
        session
          .withErrors([{
              message: 'Nomor HP tidak terdaftar.',
              field: 'cred'
            }])
          .flashExcept(['password']);
      } else {
        const isPasswordValid = await user.isPassword(cred.password);
        if (!isPasswordValid) {
          session
            .withErrors([{
                message: 'Password salah.',
                field: 'cred'
              }])
            .flashExcept(['password']);
        } else {
          await auth.remember(true).login(user);
        }
      }
    } catch (error) {
      console.log(error);
    }
    return response.redirect('back');
  }

  async logout({ response, auth }) {
    await auth.logout();
    return response.route('AuthController.login');
  }

  register({ response, view }) {
    return minify(view.render('auth/register'));
  }

  pilih_jalur({ response, view }) {
    return view.render('auth/pilih-jalur');
  }

}

module.exports = AuthController
