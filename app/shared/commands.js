const groups = exports.groups = 
    [
        {
            name : 'setup',
            label: 'Setup',
            commands : [
                {
                    name: 'createorg',
                    label: 'Create Scratch Org',
                    icon: 'record_create',
                    startMessage: 'Creating scratch org',
                    completeMessage: 'Scratch org created',
                    command: 'sfdx',
                    subcommand: 'force:org:create',
                    openorg: 'user',
                    instructions: 'TODO',
                    executelabel: 'Create',
                    type: 'success',
                    refreshOrgs: true,
                    json: {
                        supported: true,
                        polling: false,
                        status: 'status',
                        result: 'result'
                    },
                    overview : 'Scratch orgs are short lived orgs for developing features. As they expire after a maximum of ' + 
                            '30 days, it is extremely important to ensure that your local codebase contains all changes ' + 
                            'made in the org - once it expires, you CANNOT access it',
                    params : [
                        {
                            name : 'devhub',
                            label: 'Dev Hub',
                            type: 'org',
                            default: true,
                            variant: 'hub',
                            flag: '-v'
                        },
                        {
                            name: 'definition',
                            label: 'Definition File',
                            type: 'file',
                            default: false,
                            flag: '-f'
                        },
                        {
                            name : 'alias',
                            label: 'Alias',
                            type: 'text',
                            flag: '-a'
                        },
                        {
                            name: 'duration',
                            label: 'Duration',
                            type: 'number',
                            range: '1:30',
                            default: 7,
                            pattern : '\\d\\d',
                            maxlength: 2,
                            min: 1,
                            max:30,
                            flag: '-d'
                        },
                        {
                            name: 'defaultuser',
                            label: 'Set as default user?',
                            type: 'checkbox',
                            default: false,
                            flag: '-s'
                        }
                    ]        
                },
                {
                    name: 'deleteorg',
                    label: 'Delete Scratch Org',
                    icon: 'record_delete',
                    startMessage: 'Deleting scratch org',
                    completeMessage: 'Scratch org deleted',
                    command: 'sfdx',
                    subcommand: 'force:org:delete',
                    instructions: 'TODO',
                    executelabel: 'Delete',
                    type: 'destructive',
                    refreshOrgs: true,
                    json: {
                        supported: true,
                        polling: false,
                        status: 'status',
                        result: 'result'
                    },
                    overview : 'TODO',
                    additionalflags: '-p',
                    params : [
                        {
                            name : 'org',
                            label: 'Scratch Org',
                            type: 'org',
                            variant: 'scratch',
                            flag: '-u'
                        }
                    ]        
                },
            ]
        },
        {
            name : 'auth',
            label: 'Auth',
            commands : [
                {
                    name: 'login',
                    label: 'Login to Org',
                    icon: 'adduser',
                    startMessage: 'Logginng in to org',
                    completeMessage: 'Login complet3',
                    command: 'sfdx',
                    subcommand: 'force:auth:web:login',
                    instructions: 'TODO',
                    executelabel: 'Login',
                    type: 'success',
                    refreshOrgs: true,
                    json: {
                        supported: true,
                        polling: false,
                        status: 'status',
                        result: 'result'
                    },
                    overview : 'TODO',
                    params : [
                        {
                            name : 'alias',
                            label: 'Alias',
                            type: 'text',
                            flag: '-a'
                        },
                        {
                            name: 'instance',
                            label: 'Instance URL',
                            type: 'select',
                            values: ['https://login.salesforce.com', 'https://test.salesforce.com'],
                            flag: '-r'
                        },
                        {
                            name: 'defaultuser',
                            label: 'Set as default user?',
                            type: 'checkbox',
                            default: false,
                            flag: '-s'
                        },
                        {
                            name: 'defaultdevhubuser',
                            label: 'Set as default dev hub user?',
                            type: 'checkbox',
                            default: false,
                            flag: '-d'
                        }
                    ]
                },
                {
                    name: 'logout',
                    label: 'Logout of Org',
                    icon: 'block_visitor',
                    startMessage: 'Logging out of org',
                    completeMessage: 'Logged out of org',
                    command: 'sfdx',
                    subcommand: 'force:auth:logout',
                    instructions: 'TODO',
                    executelabel: 'Logout',
                    type: 'destructive',
                    refreshOrgs: true,
                    json: {
                        supported: true,
                        polling: false,
                        status: 'status',
                        result: 'result'
                    },
                    overview : 'TODO',
                    additionalflags: '-p',
                    params : [
                        {
                            name : 'org',
                            label: 'Choose Org',
                            type: 'org',
                            variant: 'all',
                            flag: '-u'
                        }
                    ]        
                },
                {
                    name: 'defaultuser',
                    label: 'Default Username',
                    icon: 'user',
                    startMessage: 'Setting default username',
                    completeMessage: 'Default username set',
                    command: 'sfdx',
                    subcommand: 'force:config:set',
                    instructions: 'TODO',
                    executelabel: 'Set',
                    refreshConfig: true,
                    refreshOrgs: false,
                    json: {
                        supported: true,
                        polling: false,
                        status: 'status',
                        result: 'result'
                    },
                    overview : 'TODO',
                    params : [
                        {
                            name : 'username',
                            label: 'Username',
                            type: 'org',
                            default: false,
                            allowEmpty: true,
                            separator: '=',
                            variant: 'all',
                            flag: 'defaultusername'
                        },
                        {
                            name : 'global',
                            label: 'Global ?',
                            type: 'checkbox',
                            default: 'false',
                            flag: '-g'
                        }
                    ]        
                },
                {
                    name: 'defaultdevhub',
                    label: 'Default Dev Hub',
                    icon: 'strategy',
                    startMessage: 'Setting default dev hub',
                    completeMessage: 'Defaul dev hub set',
                    command: 'sfdx',
                    subcommand: 'force:config:set',
                    instructions: 'TODO',
                    executelabel: 'Set',
                    refreshConfig: true,
                    refreshOrgs: false,
                    json: {
                        supported: true,
                        polling: false,
                        status: 'status',
                        result: 'result'
                    },
                    overview : 'TODO',
                    params : [
                        {
                            name : 'username',
                            label: 'Username',
                            type: 'org',
                            default: false,
                            allowEmpty: true,
                            separator: '=',
                            variant: 'hub',
                            flag: 'defaultdevhubusername'
                        },
                        {
                            name : 'global',
                            label: 'Global ?',
                            type: 'checkbox',
                            default: 'false',
                            flag: '-g'
                        }
                    ]
                }
            ]
        },
        {
            name : 'org',
            label: 'Org',
            commands : [
                {
                    name: 'openorg',
                    label: 'Open Org',
                    icon: 'open',
                    startMessage: 'Opening org',
                    completeMessage: 'Org opened',
                    command: 'sfdx',
                    subcommand: 'force:org:open',
                    instructions: 'TODO',
                    executelabel: 'Open',
                    refreshOrgs: false,
                    json: {
                        supported: true,
                        polling: false,
                        status: 'status',
                        result: 'result'
                    },
                    overview : 'TODO',
                    params : [
                        {
                            name : 'org',
                            label: 'Choose Org',
                            type: 'org',
                            variant: 'all',
                            flag: '-u'
                        }
                    ]        
                },
                {
                    name: 'runclass',
                    label: 'Run Test Class',
                    icon: 'multi_select_checkbox',
                    startMessage: 'Running test class',
                    completeMessage: 'Test class run',
                    command: 'sfdx',
                    subcommand: 'force:apex:test:run',
                    instructions: 'TODO',
                    executelabel: 'Run',
                    refreshConfig: false,
                    refreshOrgs: false,
                    json: true,
                    polling: {
                        supported: true,
                        type: 'test',
                    },
                    overview : 'TODO',
                    params : [
                        {
                            name : 'username',
                            label: 'Username',
                            type: 'org',
                            default: false,
                            allowEmpty: true,
                            variant: 'all',
                            flag: '-u'
                        },
                        {
                            name : 'class',
                            label: 'Test Class',
                            type: 'text',
                            default: 'bg_PRD_PlatformNameRetrievalService_Test',
                            flag: '-t'
                        },                        
                    ]        
                },
                {
                    name: 'runlocal',
                    label: 'Run Local Tests',
                    icon: 'multi_select_checkbox',
                    startMessage: 'Running all tests in the org namespace',
                    completeMessage: 'All tests in the org namespace run',
                    command: 'sfdx',
                    subcommand: 'force:apex:test:run',
                    instructions: 'TODO',
                    executelabel: 'Run',
                    refreshConfig: false,
                    refreshOrgs: false,
                    json: true,
                    polling: {
                        supported: true,
                        type: 'test',
                    },
                    overview : 'TODO',
                    additionalflags: '-l RunLocalTests',
                    params : [
                        {
                            name : 'username',
                            label: 'Username',
                            type: 'org',
                            default: false,
                            allowEmpty: true,
                            variant: 'all',
                            flag: '-u'
                        }
                    ]
                },
                {
                    name: 'getlog',
                    label: 'Get Log File',
                    icon: 'file',
                    startMessage: 'Rerieving log file',
                    completeMessage: 'Log file retrieved',
                    command: 'sfdx',
                    subcommand: 'force:apex:log:get',
                    instructions: 'TODO',
                    executelabel: 'Get',
                    refreshConfig: false,
                    refreshOrgs: false,
                    json: true,
                    resultprocessor: 'logfile',
                    polling: {
                        supported: false
                    },
                    overview : 'TODO',
                    params : [
                        {
                            name : 'username',
                            label: 'Username',
                            type: 'org',
                            default: false,
                            variant: 'all',
                            flag: '-u'
                        },
                        {
                            name : 'logfile',
                            label: 'Logfile',
                            type: 'logfile',
                            flag: '-i'
                        }
                    ]        
                },
                {
                    name: 'listlogs',
                    label: 'List Logs',
                    icon: 'file',
                    startMessage: 'Retrieving log file list',
                    completeMessage: 'Log file list retrieved',
                    command: 'sfdx',
                    subcommand: 'force:apex:log:list',
                    instructions: 'TODO',
                    executelabel: 'List',
                    refreshConfig: false,
                    refreshOrgs: false,
                    json: true,
                    resultprocessor: 'loglist',
                    polling: {
                        supported: false
                    },
                    overview : 'TODO',
                    params : [
                        {
                            name : 'username',
                            label: 'Username',
                            type: 'org',
                            default: false,
                            variant: 'all',
                            flag: '-u'
                        }
                    ]        
                },
                {
                    name: 'display',
                    label: 'Display Org',
                    icon: 'info',
                    startMessage: 'Getting org details',
                    completeMessage: 'Display org complete',
                    command: 'sfdx',
                    subcommand: 'force:org:display',
                    instructions: 'TODO',
                    executelabel: 'Display',
                    refreshOrgs: false,
                    json: {
                        supported: true,
                        polling: false,
                        status: 'status',
                        result: 'result'
                    },
                    overview : 'TODO',
                    params : [
                        {
                            name : 'org',
                            label: 'Choose Org',
                            type: 'org',
                            variant: 'all',
                            flag: '-u'
                        },
                        {
                            name : 'verbose',
                            label: 'Verbose ?',
                            type: 'checkbox',
                            default: 'false',
                            flag: '--verbose'
                        }
                    ]        
                }
            ]
        },
        {
            name : 'pkg',
            label: 'Packaging',
            commands : [
                {
                    name: 'pkgcreatever',
                    label: 'Create Version',
                    icon: 'open',
                    startMessage: 'Creating version',
                    completeMessage: 'Version created',
                    command: 'sfdx',
                    subcommand: 'force:package:version:create',
                    instructions: 'TODO',
                    executelabel: 'Create Version',
                    refreshOrgs: false,
                    json: {
                        supported: true,
                        polling: false,
                        status: 'status',
                        result: 'result'
                    },
                    overview : 'TODO',
                    params : [
                        {
                            name : 'devhub',
                            label: 'Dev Hub',
                            type: 'org',
                            default: true,
                            variant: 'hub',
                            flag: '-v'
                        },
                        {
                            name : 'package',
                            label: 'Package',
                            type: 'package',
                            flag: '-p'
                        },
                        {
                            name : 'key',
                            label: 'Key',
                            type: 'text',
                            flag: '-k',
                            excludes: 'bypasskey'
                        },
                        {
                            name : 'coverage',
                            label: 'Run Tests',
                            type: 'checkbox',
                            flag: '-c'
                        },
                        {
                            name : 'description',
                            label: 'Version Description',
                            type: 'text',
                            quote: true,
                            flag: '-e'
                        },
                        {
                            name : 'definition',
                            label: 'Definition File',
                            type: 'file',
                            flag: '-f'
                        },
                        {
                            name : 'bypasskey',
                            label: 'Bypass Key',
                            type: 'checkbox',
                            flag: '-x',
                            excludes: 'key'
                        },
                        {
                            name: 'wait',
                            label: 'Wait (mins)',
                            type: 'number', 
                            min: 0,
                            max: 60,
                            flag: '-w'
                        }
                    ]        
                },
                {
                    name: 'pkgpromotever',
                    label: 'Promote Version',
                    icon: 'open',
                    startMessage: 'Promoting version',
                    completeMessage: 'Version promoted',
                    command: 'sfdx',
                    subcommand: 'force:package:version:promote',
                    instructions: 'TODO',
                    executelabel: 'Promote Version',
                    refreshOrgs: false,
                    json: {
                        supported: true,
                        polling: false,
                        status: 'status',
                        result: 'result'
                    },
                    overview : 'TODO',
                    additionalflags : '-n',
                    params : [
                        {
                            name : 'devhub',
                            label: 'Dev Hub',
                            type: 'org',
                            default: true,
                            variant: 'hub',
                            flag: '-v'
                        },
                        {
                            name : 'package',
                            label: 'Package',
                            type: 'package',
                            flag: '-p',
                            internal: true
                        },
                        {
                            name : 'version',
                            label: 'Version',
                            type: 'packageversion',
                            flag: '-p'
                        }
                    ]        
                },
                {
                    name: 'pkglist',
                    label: 'List Packages',
                    icon: 'open',
                    startMessage: 'Retrieving package list',
                    completeMessage: 'Package list retrieved',
                    command: 'sfdx',
                    subcommand: 'force:package:list',
                    instructions: 'TODO',
                    executelabel: 'List Packages',
                    resultprocessor: 'packagelist',
                    refreshOrgs: false,
                    json: {
                        supported: true,
                        polling: false,
                        status: 'status',
                        result: 'result'
                    },
                    overview : 'TODO',
                    params : [
                        {
                            name : 'devhub',
                            label: 'Dev Hub',
                            type: 'org',
                            default: true,
                            variant: 'hub',
                            flag: '-v'
                        }
                    ]        
                },
                {
                    name: 'pkgverlist',
                    label: 'List Package Versions',
                    icon: 'open',
                    startMessage: 'Retrieving package versions',
                    completeMessage: 'Package versions retrieved',
                    command: 'sfdx',
                    subcommand: 'force:package:version:list',
                    instructions: 'TODO',
                    executelabel: 'List Package Versions',
                    resultprocessor: 'packageversionlist',
                    refreshOrgs: false,
                    json: {
                        supported: true,
                        polling: false,
                        status: 'status',
                        result: 'result'
                    },
                    overview : 'TODO',
                    params : [
                        {
                            name : 'devhub',
                            label: 'Dev Hub',
                            type: 'org',
                            default: true,
                            variant: 'hub',
                            flag: '-v'
                        },
                        {
                            name : 'package',
                            label: 'Package',
                            type: 'package',
                            flag: '-p'
                        },
                        {
                            name : 'created',
                            label: 'Created Last Days',
                            type: 'number',
                            min: 0,
                            max: 500,
                            flag: '-c'
                        },
                        {
                            name : 'modified',
                            label: 'Modified Last Days',
                            type: 'number',
                            min: 0,
                            max: 500,
                            flag: '-m'
                        },
                        {
                            name : 'released',
                            label: 'Released Only',
                            type: 'checkbox',
                            flag: '-r'
                        }                        
                    ]        
                }            
            ]
        }
    ];
