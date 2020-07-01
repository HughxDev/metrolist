export default function isDev() {
  return ( globalThis.location.hostname !== 'boston.gov' );
}

export function isLocalDev() {
  const { hostname } = globalThis.location;

  return (
    ( hostname === 'localhost' )
    || ( hostname === '127.0.0.1' )
    || /\b(?:\d{1,3}\.){3}\d{1,3}\b/.test( hostname ) // is IPv4 address
  );
}

export function getApiDomain() {
  return ( isLocalDev() ? 'https://d8-ci.boston.gov' : '' );
}

export function getDevelopmentsApiEndpoint() {
  return `${getApiDomain()}/metrolist/api/v1/developments?_format=json`;
  // return `/metrolist/api/v1/developments?_format=json`;
}

export function getAmiApiEndpoint() {
  return `${getApiDomain()}/metrolist/api/v1/ami/hud/base?_format=json`;
  // return `/metrolist/api/v1/ami/hud/base?_format=json`;
}
