'use strict'
const path = require('path')
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');


process.env['NODE_CONFIG_DIR'] = path.join(__dirname, 'config/');
const feathers = require('@feathersjs/feathers')
const configuration = require('@feathersjs/configuration');

const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

const middleware = require('./middleware')
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');


const app = express(feathers());

app.configure(configuration())
  .configure(middleware)

app.use(compress());
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);


app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

const host = app.get('host')
const port = app.get('port')

process.on('nuxt:build:done', (err) => {
  if (err) {
    console.error(err) // eslint-disable-line no-console
    process.exit(1)
  }
  const server = app.listen(port)
  server.on('listening', () =>
    console.log(`Feathers application started on ${host}:${port}`) // eslint-disable-line no-console
  )
})

module.exports = app
