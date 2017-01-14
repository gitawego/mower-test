require('source-map-support/register');
var Jasmine = require('jasmine');
var jasmine = new Jasmine();
var SpecReporter = require('jasmine-spec-reporter').SpecReporter;

jasmine.configureDefaultReporter({});
jasmine.addReporter(new SpecReporter());
const config = require(`${process.cwd()}/jasmine.json`);
if (process.env.TEST_FILES) {
	//"spec_files": [ "**/*.spec.js" ],
	config['spec_files'] = process.env.TEST_FILES.split(',').map(function (d) {
		return d.trim();
	});
}
jasmine.loadConfig(config);

jasmine.execute();
