var should = require("should");
var request = require("request");
var Detector = require('./detector');

describe('Detector', function(){
    
    it('correctly detects the returnExports pattern is UMD', function(done){
        Detector.isUMD(boilerplate.returnExports, function(err, isNPM){
            isNPM.should.equal(true);
            done();
        });
    });
    
    it('correctly detects the returnExports pattern details', function(done){
        Detector.module(boilerplate.returnExports, function(err, result){
            result.rootArgs.indexOf('root').should.not.equal(-1);
            result.rootArgs.indexOf('factory').should.not.equal(-1);
            result.args.indexOf('b').should.not.equal(-1);
            result.header_commonjs.indexOf('exports').should.not.equal(-1);
            should.exist(result.header_global);
            result.header_amd.indexOf('define(').should.not.equal(-1);
            done();
        });
    });
});

var boilerplate = {
    returnExports : '(function (root, factory) {\
        if (typeof define === \'function\' && define.amd) {\
            // AMD. Register as an anonymous module.\
            define([\'b\'], factory);\
        } else if (typeof module === \'object\' && module.exports) {\
            // Node. Does not work with strict CommonJS, but\
            // only CommonJS-like environments that support module.exports,\
            // like Node.\
            module.exports = factory(require(\'b\'));\
        } else {\
            // Browser globals (root is window)\
            root.returnExports = factory(root.b);\
        }\
    }(this, function (b) {\
        //use b in some fashion.\
    \
        // Just return a value to define the module export.\
        // This example returns an object, but the module\
        // can return a function as the exported value.\
        return {};\
    }));'
}