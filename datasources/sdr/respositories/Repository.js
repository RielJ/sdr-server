

module.exports = class Repository {
  append = true
  sdr = null
  createError = Error;
  deleteError = Error;
  notFoundError = Error;
  updateError = Error;
  notFoundMessage = 'Not found';

  constructor(model) {
    this.model = model;
  }


  setSdrContext (sdr) {
    this.sdr = sdr;
  }
}