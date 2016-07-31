arrays = require('async-arrays');

//start with regex, convert to ast parse
var matchUMDWrapper = /\(\s*function\s*\(([a-zA-Z0-9_, ]*)\s*\)\s*{\s*(.*)\s*}\(this, function \(([a-zA-Z0-9_, ]*)\) {\s*(.*)\s*}\s*\)\s*\)/;

var matchUMDHeaders = /if\s*\(typeof\s*define\s*===\s*\'function\'\s*&&\s*define.amd\)\s*{(.*)}\s*else\s*if\s*\(typeof\s*module\s*===\s*\'object\'\s*&&\s*module.exports\)\s*{(.*)\s*}\s*else\s*{(.*)}/;
//console.log(blah.match(regex));

var detectors = {
    returnExports : detectReturnExports
};


function detectReturnExports(code, cb){
    if(typeof code === 'string'){
        var components = code.match(matchUMDWrapper);
        var result = {
            rootArgs : components[1].split(',').map(function(name){ return name.trim() }),
            header:  components[2],
            args : components[3].split(',').map(function(name){ return name.trim() }),
            body: components[4]
        };
        components = result.header.match(matchUMDHeaders);
        result.header_amd = components[1];
        result.header_commonjs = components[2];
        result.header_global = components[3];
        cb(undefined, result);
    }else{
        cb(new Error('AST not yet supported'));
    }
}

function getParsedBoilerplate(code, cb){
    //todo: inject cache onto string(to prevent memory ceiling issues)
    var found;
    arrays.forEachEmission(Object.keys(detectors), function(key, index, done){
        if(found) return done();
        detectors[key](code, function(err, result){
           if(result && result.header && result.header_amd){
               found = result;
           }
           done();
        });
    }, function(){
        cb(undefined, found);
    });
}

function isUMD(code, cb){
    return getParsedBoilerplate(code, function(err, result){
       cb(err, !!result); 
    });
}



module.exports = {
    isUMD : isUMD,
    module : getParsedBoilerplate
}