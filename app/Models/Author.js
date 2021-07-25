'use strict'

const Model = use('Model');
const { validate } = use('Validator');

class Author extends Model {

  static async validate(input) {
    return await validate(input, {
      nidn: 'required',
      niy: 'required',
      nama: 'required',
      google_scholar_id: 'required',
    }, {
      'nidn.required': 'NIDN wajib diisi.',
      'niy.required': 'NIY wajib diisi.',
      'nama.required': 'Nama wajib diisi.',
      'google_scholar_id.required': 'ID User Google Scholar wajib diisi.',
    });
  }

}

module.exports = Author
