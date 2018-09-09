'use strict'

const nuxt = require('./nuxt')
const services = require('../services');

module.exports = function () {
  // Add your custom middleware here. Remember, that
  // just like Express the order matters, so error
  // handling middleware should go last.
  this.configure(services);
  
  const app = this

  app.use(nuxt)
}
