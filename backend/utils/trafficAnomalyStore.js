const MAX_ANOMALIES = 200;

const routeStats = new Map();
const recentAnomalies = [];

function getRouteKey(method, path) {
  return `${method.toUpperCase()} ${path}`;
}

function ensureStats(routeKey) {
  if (!routeStats.has(routeKey)) {
    routeStats.set(routeKey, {
      count: 0,
      avgParamCount: 0,
      avgSize: 0,
      paramKeys: new Set()
    });
  }
  return routeStats.get(routeKey);
}

function updateAverage(currentAvg, value, count) {
  if (count <= 0) return value;
  return currentAvg + (value - currentAvg) / count;
}

function addAnomaly(anomaly) {
  recentAnomalies.unshift(anomaly);
  if (recentAnomalies.length > MAX_ANOMALIES) {
    recentAnomalies.pop();
  }
}

function recordRequest({
  method,
  path,
  status,
  durationMs,
  queryKeys,
  bodyKeys,
  contentLength,
  hasAuth
}) {
  const routeKey = getRouteKey(method, path);
  const stats = ensureStats(routeKey);

  const paramKeys = [...new Set([...(queryKeys || []), ...(bodyKeys || [])])];
  const paramCount = paramKeys.length;
  const size = contentLength || 0;

  stats.count += 1;
  stats.avgParamCount = updateAverage(stats.avgParamCount, paramCount, stats.count);
  stats.avgSize = updateAverage(stats.avgSize, size, stats.count);

  const anomalies = [];

  if (stats.count >= 5) {
    const newKeys = paramKeys.filter((key) => !stats.paramKeys.has(key));
    if (newKeys.length > 0) {
      anomalies.push({
        type: 'NewParameterPattern',
        detail: `New parameters: ${newKeys.join(', ')}`,
        score: 40
      });
    }
  }

  if (stats.count >= 10) {
    if (stats.avgParamCount > 0 && paramCount > stats.avgParamCount + 6) {
      anomalies.push({
        type: 'ParamCountSpike',
        detail: `Param count ${paramCount} > baseline ${stats.avgParamCount.toFixed(1)}`,
        score: 45
      });
    }

    if (stats.avgSize > 0 && size > stats.avgSize * 3) {
      anomalies.push({
        type: 'PayloadSizeSpike',
        detail: `Payload size ${size} > baseline ${Math.round(stats.avgSize)}`,
        score: 50
      });
    }
  }

  if (status >= 500 && durationMs > 1000) {
    anomalies.push({
      type: 'LatencyAndErrorSpike',
      detail: `Status ${status} with ${Math.round(durationMs)}ms latency`,
      score: 55
    });
  }

  if (!hasAuth && status === 200 && path.includes('/admin')) {
    anomalies.push({
      type: 'UnauthenticatedAdminAccess',
      detail: 'Successful admin path without auth token',
      score: 70
    });
  }

  paramKeys.forEach((key) => stats.paramKeys.add(key));

  if (anomalies.length > 0) {
    const timestamp = new Date().toISOString();
    anomalies.forEach((anomaly) => {
      addAnomaly({
        ...anomaly,
        timestamp,
        route: routeKey,
        status,
        durationMs
      });
    });
  }

  return anomalies;
}

function getSummary() {
  const totalRoutes = routeStats.size;
  const anomalyCount = recentAnomalies.length;

  const severity = anomalyCount === 0
    ? 'LOW'
    : anomalyCount < 5
      ? 'MEDIUM'
      : 'HIGH';

  return {
    totalRoutes,
    anomalyCount,
    severity
  };
}

function getRecentAnomalies(limit = 10) {
  return recentAnomalies.slice(0, limit);
}

module.exports = {
  recordRequest,
  getSummary,
  getRecentAnomalies
};
