/*
  Replacement for Object.hasOwnProperty()
  to satisfy eslint(no-prototype-builtins)
*/
export function hasOwnProperty( object, property ) { // eslint-disable-line import/prefer-default-export
  return Object.prototype.hasOwnProperty.call( object, property );
}

export function isPlainObject( value ) {
  return (
    ( value !== null )
    && ( typeof value === "object" )
    && ( Object.getPrototypeOf( value ) === Object.prototype )
  );
}
