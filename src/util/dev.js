export function isProd( hostname = globalThis.location.hostname ) {
  return (
    ( hostname === 'wwww.boston.gov' )
    || ( hostname === 'boston.gov' )
  );
}

export default function isDev() {
  return !isProd();
}

export function isLiveDev( urlOrDomain = globalThis.location.hostname ) {
  return /^(?:https?:\/\/)?metrolist\.netlify\.app/.test( urlOrDomain );
}

export function isLocalDev( hostname = globalThis.location.hostname ) {
  return (
    ( hostname === 'localhost' )
    || ( hostname === '127.0.0.1' )
    || /\b(?:\d{1,3}\.){3}\d{1,3}\b/.test( hostname ) // is IPv4 address
  );
}

export function getApiDomain() {
  return ( ( isDev() || isLocalDev() ) ? 'https://d8-dev.boston.gov' : '' );
}

export function getDevelopmentsApiEndpoint() {
  return `${getApiDomain()}/metrolist/api/v1/developments?_format=json`;
  // return `/metrolist/api/v1/developments?_format=json`;
}

export function getAmiApiEndpoint() {
  return `${getApiDomain()}/metrolist/api/v1/ami/hud/base?_format=json`;
  // return `/metrolist/api/v1/ami/hud/base?_format=json`;
}
