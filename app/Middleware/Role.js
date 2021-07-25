'use strict'

class Role {
  async handle ({ request, auth }, next, args) {
    const user = await auth.getUser();
    if (args.length < 1)  {
      throw Error('Authentication fail for role');
    }
    const allowed = args.find(a => {
      return user.role === a.toUpperCase();
    });

    if (!allowed) {
      throw Error('Access forbiden')
    }

    await next();
  }
}

module.exports = Role
