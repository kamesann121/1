THREE.FBXLoader = function ( manager ) {
  this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
};

THREE.FBXLoader.prototype = {

  constructor: THREE.FBXLoader,

  load: function ( url, onLoad, onProgress, onError ) {
    var scope = this;

    var loader = new THREE.FileLoader( scope.manager );
    loader.setResponseType( 'arraybuffer' );
    loader.load( url, function ( buffer ) {
      try {
        onLoad( scope.parse( buffer, scope.path ) );
      } catch ( error ) {
        if ( onError ) {
          onError( error );
        } else {
          console.error( error );
        }

        scope.manager.itemError( url );
      }
    }, onProgress, onError );
  },

  parse: function ( buffer ) {
    // ここにFBXパーサーの処理が入る（省略されてる部分）
    console.warn( 'FBXLoader.parse() はこの簡易版では未実装です' );
    return null;
  }

};
