import fetch from 'isomorphic-unfetch';
import urlParse from 'url-parse';

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  query?: Record<string, any>;
};

function addDefaultHeaders(headers: RequestInit['headers'], url: string) {
  return {
    Accept: 'application/json',
    'Content-type': 'application/json',
    Host: urlParse(url).host,
    // TODO version
    // TODO real user agent
    'User-agent': `rai-sdk-javascript/`,
    ...headers,
  };
}

export async function request<T>(url: string, options: RequestOptions = {}) {
  const opts = {
    method: options.method || 'GET',
    body: JSON.stringify(options.body),
    headers: addDefaultHeaders(options.headers, url),
  };
  const fullUrl = options.query
    ? `${url}?${urlParse.qs.stringify(options.query)}`
    : url;

  const response = await fetch(fullUrl, opts);

  if (response.ok) {
    const responseBody = await response.json();

    return responseBody as T;
  }

  throw {
    statusCode: response.status,
    statusText: response.statusText,
    headers: response.headers,
  };
}
