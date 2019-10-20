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
                }
            ]
        },
        {
            name : 'auth',
            label: 'Auth',
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
                    name: 'login',
                    label: 'Login to Org',
                    icon: 'adduser',
                    startMessage: 'Logginng in to org',
                    completeMessage: 'Login complet3',
                    command: 'sfdx',
                    subcommand: 'force:auth:web:login',
                    instructions: 'TODO',
                    executelabel: 'Login',
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
            name : 'config',
            label: 'Config',
            commands : [
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
            name : 'test',
            label: 'Test',
            commands : [
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
                        }
                    ]        
                }
            ]
        },
        {
            name : 'log',
            label: 'Logging',
            commands : [
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
                }
            ]
        }

    ];
