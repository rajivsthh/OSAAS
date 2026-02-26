const { recordRequest } = require('../utils/trafficAnomalyStore');

const IGNORE_PATHS = ['/api/health'];

function trafficAnomalyMiddleware(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    if (IGNORE_PATHS.includes(req.path)) {
      return;
    }

    const contentLength = Number(req.headers['content-length'] || 0);
    const durationMs = Date.now() - start;

    recordRequest({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs,
      queryKeys: Object.keys(req.query || {}),
      bodyKeys: req.body && typeof req.body === 'object' ? Object.keys(req.body) : [],
      contentLength,
      hasAuth: Boolean(req.headers.authorization)
    });
  });

  next();
}

module.exports = {
  trafficAnomalyMiddleware
};
