const groups = exports.groups = 
    [
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
                    type: 'brand',
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
        }
    ];
