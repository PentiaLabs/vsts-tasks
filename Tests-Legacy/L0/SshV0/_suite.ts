/// <reference path="../../definitions/mocha.d.ts"/>
/// <reference path="../../definitions/node.d.ts"/>

import assert = require('assert');
import trm = require('../../lib/taskRunner');
import path = require('path');

function setResponseFile(name: string) {
    process.env['MOCK_RESPONSES'] = path.join(__dirname, name);
}

describe('SshV0 Suite', function() {
    this.timeout(parseInt(process.env.TASK_TEST_TIMEOUT) || 20000);

    before((done) => {
        // init here
        done();
    });

    after(function () {

    });
    it('Fails for missing endpoint', (done) => {
        setResponseFile('responseEndpoint.json');

        var tr = new trm.TaskRunner('SshV0', true, true);

        tr.run()
            .then(() => {
                assert(tr.invokedToolCount == 0, 'should not have run any tools');
                assert(tr.resultWasSet, 'task should have set a result');
                assert(tr.stderr.length > 0, 'should have written to stderr');
                assert(tr.failed, 'task should have failed');
                assert(tr.stderr.indexOf('Input required: sshEndpoint') >= 0, 'wrong error message: "' + tr.stderr + '"');
                done();
            })
            .fail((err) => {
                done(err);
            });
    })
    //it('Fails for invalid private key', (done) => {
    //    setResponseFile('responseEndpoint.json');
    //    var tr = new trm.TaskRunner('SshV0', true, true);
    //    tr.setInput('sshEndpoint', 'IDInvalidKey');
    //    tr.setInput('runOptions', 'commands');
    //    tr.setInput('commands', 'ls -l');
    //
    //    tr.run()
    //        .then(() => {
    //            assert(tr.invokedToolCount == 0, 'should not have run any tools');
    //            assert(tr.resultWasSet, 'task should have set a result');
    //            assert(tr.stderr.length > 0, 'should have written to stderr');
    //            assert(tr.failed, 'task should have failed');
    //            assert(tr.stderr.indexOf('Failed to connect to remote machine. Verify the SSH endpoint details. Error:') >= 0, 'wrong error message: "' + tr.stderr + '"');
    //            assert(tr.stderr.indexOf('Error: Cannot parse privateKey: Unsupported key format') >= 0, 'wrong error message: "' + tr.stderr + '"');
    //            done();
    //        })
    //        .fail((err) => {
    //            done(err);
    //        });
    //})
    it('Fails when user name is not provided in the endpoint', (done) => {
        setResponseFile('responseEndpoint.json');
        var tr = new trm.TaskRunner('SshV0', true, true);
        tr.setInput('sshEndpoint', 'IDUserNameNotSet');
        tr.setInput('commands', 'ls -l');

        tr.run()
            .then(() => {
                assert(tr.invokedToolCount == 0, 'should not have run any tools');
                assert(tr.resultWasSet, 'task should have set a result');
                assert(tr.stderr.length > 0, 'should have written to stderr');
                assert(tr.failed, 'task should have failed');
                assert(tr.stderr.indexOf('Endpoint auth not present: IDUserNameNotSet') >= 0, 'wrong error message: "' + tr.stderr + '"');
                done();
            })
            .fail((err) => {
                done(err);
            });
    })
    it('Empty password/passphrase is valid in the endpoint', (done) => {
        setResponseFile('responseEndpoint.json');
        var tr = new trm.TaskRunner('SshV0', true, true);
        tr.setInput('sshEndpoint', 'IDPasswordNotSet');

        tr.run()
            .then(() => {
                assert(tr.invokedToolCount == 0, 'should not have run any tools');
                assert(tr.stderr.indexOf('Input required: password') < 0, 'task should not require password');
                done();
            })
            .fail((err) => {
                done(err);
            });
    })
    it('Fails when host is not provided in the endpoint', (done) => {
        setResponseFile('responseEndpoint.json');
        var tr = new trm.TaskRunner('SshV0', true, true);
        tr.setInput('sshEndpoint', 'IDHostNotSet');

        tr.run()
            .then(() => {
                assert(tr.invokedToolCount == 0, 'should not have run any tools');
                assert(tr.resultWasSet, 'task should have set a result');
                assert(tr.stderr.length > 0, 'should have written to stderr');
                assert(tr.failed, 'task should have failed');
                assert(tr.stderr.indexOf('Endpoint data not present: IDHostNotSet') >= 0, 'wrong error message: "' + tr.stderr + '"');
                done();
            })
            .fail((err) => {
                done(err);
            });
    })
    it('When port is not provided in the endpoint, 22 is used as default port number', (done) => {
        setResponseFile('responseEndpoint.json');
        var tr = new trm.TaskRunner('SshV0', true, true);
        tr.setInput('sshEndpoint', 'IDPortNotSet');

        tr.run()
            .then(() => {
                assert(tr.invokedToolCount == 0, 'should not have run any tools');
                assert(tr.stdout.indexOf('Using port 22 which is the default for SSH since no port was specified.') >= 0, 'default port 22 was not used');
                done();
            })
            .fail((err) => {
                done(err);
            });
    })
    it('Fails when connection cannot be made with given details', (done) => {
        setResponseFile('responseEndpoint.json');
        var tr = new trm.TaskRunner('SshV0', true, true);
        tr.setInput('sshEndpoint', 'IDValidKey');
        tr.setInput('runOptions', 'commands');
        tr.setInput('commands', 'ls -l');

        tr.run()
            .then(() => {
                assert(tr.invokedToolCount == 0, 'should not have run any tools');
                assert(tr.resultWasSet, 'task should have set a result');
                assert(tr.stderr.length > 0, 'should have written to stderr');
                assert(tr.failed, 'task should have failed');
                assert(tr.stderr.indexOf('Failed to connect to remote machine. Verify the SSH endpoint details.') >= 0, 'wrong error message: "' + tr.stderr + '"');
                done();
            })
            .fail((err) => {
                done(err);
            });
    })
    it('Fails for missing run options', (done) => {
        setResponseFile('responseEndpoint.json');

        var tr = new trm.TaskRunner('SshV0', true, true);
        tr.setInput('sshEndpoint', 'IDValidKey');

        tr.run()
            .then(() => {
                assert(tr.invokedToolCount == 0, 'should not have run any tools');
                assert(tr.failed, 'build should have failed');
                assert(tr.stderr.indexOf('Input required: runOptions') >= 0, 'wrong error message: "' + tr.stderr + '"');
                done();
            })
            .fail((err) => {
                done(err);
            });
    })
    it('Fails for missing commands', (done) => {
        setResponseFile('responseEndpoint.json');

        var tr = new trm.TaskRunner('SshV0', true, true);
        tr.setInput('sshEndpoint', 'IDValidKey');
        tr.setInput('runOptions', 'commands');

        tr.run()
            .then(() => {
                assert(tr.invokedToolCount == 0, 'should not have run any tools');
                assert(tr.failed, 'task should have failed');
                assert(tr.stderr.indexOf('Input required: commands') >= 0, 'wrong error message: "' + tr.stderr + '"');
                done();
            })
            .fail((err) => {
                done(err);
            });
    })
    it('Fails for missing script path', (done) => {
        setResponseFile('responseEndpoint.json');

        var tr = new trm.TaskRunner('SshV0', true, true);
        tr.setInput('sshEndpoint', 'IDValidKey');
        tr.setInput('runOptions', 'script');

        tr.run()
            .then(() => {
                assert(tr.invokedToolCount == 0, 'should not have run any tools');
                assert(tr.failed, 'task should have failed');
                assert(tr.stderr.indexOf('Input required: scriptPath') >= 0, 'wrong error message: "' + tr.stderr + '"');
                done();
            })
            .fail((err) => {
                done(err);
            });
    })
});