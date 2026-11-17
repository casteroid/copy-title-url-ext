const TRACKING_PARAM = /^(utm_.*|fbclid|gclid|mc_eid)$/;

// Filters the query as raw text: URLSearchParams would re-encode the parameters that are
// kept (spaces, `+`, keys without `=`). The fragment is left alone.
export const removeTrackingParams = (url: string): string => {
  const hashStart = url.indexOf("#");
  const beforeHash = hashStart === -1 ? url : url.slice(0, hashStart);
  const queryStart = beforeHash.indexOf("?");
  if (queryStart === -1) return url;
  const params = beforeHash.slice(queryStart + 1).split("&");
  const kept = params.filter((param) => !TRACKING_PARAM.test(param.split("=", 1)[0] ?? ""));
  if (kept.length === params.length) return url;
  const query = kept.length > 0 ? `?${kept.join("&")}` : "";
  return beforeHash.slice(0, queryStart) + query + url.slice(beforeHash.length);
};
