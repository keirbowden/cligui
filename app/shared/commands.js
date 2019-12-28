const groups = exports.groups = 
    [
        {
            name : 'auth',
            label: 'Auth',
            commands : [
                {
                    name: 'login',
                    label: 'Login to Org',
                    icon: 'adduser',
                    startMessage: 'Logging in to org',
                    completeMessage: 'Login complete',
                    command: 'sfdx',
                    subcommand: 'force:auth:web:login',
                    instructions: 'Choose an alias for the org if required and pick the endpoint to login to. Check the appropriate box to set this as the default user or default dev hub user, then click the Login button. Note that the default user/dev hub user will only be set for the current directory. Used the dedicated commands to set these details globally. Note also that this will refresh the orgs which will take a few moments.',
                    executelabel: 'Login',
                    type: 'success',
                    refreshOrgs: true,
                    json: {
                        supported: true,
                        polling: false,
                        status: 'status',
                        result: 'result'
                    },
                    overview : 'Login to an org and cache the details so that it can be opened in future without needing credentials. For security reasons, always logout of any org that contains real data.',
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
                    instructions: 'Choose the org you wish to logout of from the datalist and click the Logout button. Note that this will refresh the orgs which will take a few moments.',
                    executelabel: 'Logout',
                    type: 'destructive',
                    refreshOrgs: true,
                    json: {
                        supported: true,
                        polling: false,
                        status: 'status',
                        result: 'result'
                    },
                    overview : 'Logout of an org you have previously authenticated against, removing all cached information that would allow the org to be opened without requiring credentials.',
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
                    instructions: 'Select the username from the datalist and check the Global ? box if you wish to set this as the default username for all of your projects, then click the Set button. Note that you must have already authenticated as the user you wish to set as the default.',
                    executelabel: 'Set',
                    refreshConfig: true,
                    refreshOrgs: false,
                    json: {
                        supported: true,
                        polling: false,
                        status: 'status',
                        result: 'result'
                    },
                    overview : 'Set the default user for the project in the current chosen directory or globally for all projects.',
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
                    completeMessage: 'Default dev hub set',
                    command: 'sfdx',
                    subcommand: 'force:config:set',
                    instructions: 'Select the username from the datalist and check the Global ? box if you wish to set this as the default dev hub user for all of your projects, then click the Set button. Note that you must have already authenticated as the user you wish to set as the default dev hub.',
                    executelabel: 'Set',
                    refreshConfig: true,
                    refreshOrgs: false,
                    json: {
                        supported: true,
                        polling: false,
                        status: 'status',
                        result: 'result'
                    },
                    overview : 'Set the default dev hub user for the project in the current chosen directory or globally for all projects.',
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
                },
                {
                    name: 'openorg',
                    label: 'Open Org',
                    icon: 'open',
                    startMessage: 'Opening org',
                    completeMessage: 'Org opened',
                    command: 'sfdx',
                    subcommand: 'force:org:open',
                    instructions: 'Choose the org to open from the datalist and cick the \'Open\' button',
                    executelabel: 'Open',
                    refreshOrgs: false,
                    type: 'brand',
                    json: {
                        supported: true,
                        polling: false,
                        status: 'status',
                        result: 'result'
                    },
                    overview : 'Opens an org you have previously authenticated against without requiring you to re-enter credentials. Note that this has security implications so you should always logout of an org containing real data.',
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
                    instructions: 'Choose the dev hub to create the scratch org against - if you have set the default either locally or globally then this will be pre-selected for you. Select the scratch org definition file and then define the alias. Chooe how long you want the org to live for, and check the box to make this the default user if required. Check the \'Open Org\' box if you want to open the scratch org once it has been created. Finally, click the \'Create\'  button to create the scratch org. Note that this will refresh the orgs which will take a few moments.',
                    executelabel: 'Create',
                    type: 'success',
                    refreshOrgs: true,
                    json: {
                        supported: true,
                        polling: false,
                        status: 'status',
                        result: 'result'
                    },
                    overview : 'Scratch orgs are short lived orgs for developing features. As they expire after a maximum of 30 days, it is extremely important to ensure that your local codebase contains all changes made in the org - once it expires, you CANNOT access it',
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
                    instructions: 'Choose the org that you wish to delete from the datalist and click the \'Delete\' button. Note that this will refresh the orgs which will take a few moments.',
                    executelabel: 'Delete',
                    type: 'destructive',
                    refreshOrgs: true,
                    json: {
                        supported: true,
                        polling: false,
                        status: 'status',
                        result: 'result'
                    },
                    overview : 'Deletes a scratch org before its scheduled expiry date. Use this command if you have finished with an org. Make sure that you have retrieved everything you need from the org, as this action cannot be undone',
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
