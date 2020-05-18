export default function isDev() {
  return ( window.location.hostname !== 'boston.gov' );
}

export function isLocalDev() {
  const { hostname } = window.location;

  return (
    ( hostname === 'localhost' )
    || ( hostname === '127.0.0.1' )
    || /\b(?:\d{1,3}\.){3}\d{1,3}\b/.test( hostname ) // is IPv4 address
  );
}
