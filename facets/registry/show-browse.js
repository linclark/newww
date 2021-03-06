var sanitizer = require('sanitizer'),
    Hapi = require('hapi'),
    log = require('bole')('registry-browse'),
    uuid = require('node-uuid'),
    metrics = require('../../adapters/metrics')();

var pageSize = 100;
var possibleTypes = ['all', 'keyword', 'author', 'updated', 'depended', 'star', 'userstar'];

module.exports = function (request, reply) {
  var opts = {
    user: request.auth.credentials,
    hiring: request.server.methods.hiring.getRandomWhosHiring()
  };

  var getBrowseData = request.server.methods.registry.getBrowseData,
      addMetric = metrics.addMetric,
      addLatencyMetric = metrics.addPageLatencyMetric,
      timer = { start: Date.now() };

  // the url will be something like /browse/{type?}/{arg?}/{page}
  var params = request.params.p || '',
      page, type, arg;

  // grab the page number, if it's in the url
  page = +request.query.page || 1;

  // now let's get the type and arg, if they're in there
  params = params.split('/');
  type = params.shift() || 'updated'; // grab the first one - that will be the type

  if (possibleTypes.indexOf(type) === -1) {
    opts.errId = uuid.v1();

    opts.errorType = 'browseUrl';

    log.error(opts.errId + ' ' + Hapi.error.notFound('The requested url is invalid'), opts.url);
    return reply.view('error', opts).code(404);
  }

  if (type !== 'all' && type !== 'updated') {
    arg = params.shift();
  }

  var browseby = type;
  if (arg) {
    arg = sanitizer.sanitize(arg).replace(/<[^\>]+>/g, '').trim();
  }
  if (arg) {
    browseby += '/' + encodeURIComponent(arg);
  }

  var sarg;
  if (arg) {
    sarg = encodeURIComponent(arg);
  }

  var start = (page - 1) * pageSize,
      limit = pageSize;

  var timer = { start: Date.now() };
  getBrowseData(type, arg, start, limit, function (err, items) {
    timer.end = Date.now();

    if (err) {
      opts.errId = uuid.v1();

      opts.errorType = 'internal';

      log.error(opts.errId + ' ' + Hapi.error.internal('There was an error when getting the browse data'), err);
      return reply.view('error', opts).code(500);
    }

    var key = [type, arg, start, limit].join(', ');

    timer.end = Date.now();
    addLatencyMetric(timer, 'browse ' + key);

    addMetric({
      name: 'browse',
      value: key
    });

    opts.browse = {
      items: items,
      page: page,
      prevPage: page > 0 ? page - 1 : null,
      nextPage: items.length >= pageSize ? page + 1 : null,
      pageSize: pageSize,
      browseby: browseby,
      type: type,
      arg: type === 'keyword' ? JSON.stringify(sarg) : sarg
    };

    return reply.view('browse', opts);
  });
}