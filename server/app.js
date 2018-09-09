'use strict'

const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');


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

module.exports = app;