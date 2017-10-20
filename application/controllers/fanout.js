'use strict';

const xapiService = require('../services/xapi');

const self = module.exports = {

  forwardActivity: function(request, reply) {
    xapiService.sendActivities(request.payload, request.auth.isAuthenticated && request.auth.token)
      .catch((err) => {
        request.log('error', err);
      });

    // reply immediately, don't let the request to xapi delay this one
    reply();
  },

};
