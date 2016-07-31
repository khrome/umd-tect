umd-tect
========
Sometimes you need to inspect a piece of code to determine whether it has a UMD wrapper already (maybe you're whitelisting modules as browser safe, maybe you'r dynamically determining if you need to add a wrapper (at runtime or as part of a build process)).

It could be that this is a great tool or an artifact of deciding to go with UMD years ago.


Usage
-----

There's not much supported (only detecting [returnExports](https://github.com/umdjs/umd/blob/master/templates/returnExports.js) from strings), which loooks like:

	var Detect =  require('umd-tect')
	Detect.isUMD(myCode, function(err, isNPM){
		//isUMD is now a thing
	});

Or get the detailed breakdown of the parse

	Detect.module(myCode, function(err, module){
		/*
			module contains all the extracted text:
			.header_commonjs, .header_amd, .header_global,
			.rootArgs, .args, .header, and .body
		*/
	});
	

Testing
-------
Just run

	mocha