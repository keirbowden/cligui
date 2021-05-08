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
        ,
        {
            name : 'debug',
            label: 'Debugging',
            commands : [
                {
                    name: 'listlogs',
                    label: 'List Logs',
                    icon: 'file',
                    startMessage: 'Retrieving log file list',
                    completeMessage: 'Log file list retrieved',
                    command: 'sfdx',
                    subcommand: 'force:apex:log:list',
                    instructions: 'Choose the org that you wish to extract the log file details for and click the \'List\' button',
                    executelabel: 'List',
                    refreshConfig: false,
                    refreshOrgs: false,
                    json: true,
                    type: 'brand',
                    resultprocessor: 'loglist',
                    polling: {
                        supported: false
                    },
                    overview : 'Lists all the available log files for a specific org.',
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
                    name: 'getlog',
                    label: 'Get Log File',
                    icon: 'file',
                    startMessage: 'Rerieving log file',
                    completeMessage: 'Log file retrieved',
                    command: 'sfdx',
                    subcommand: 'force:apex:log:get',
                    instructions: 'Choose the org that you wish to extract the log file from, then click the \'Get log files\' button to retrieve the available log files. Then choose a file and click the \'Get\' button to retrieve the contents and display in the output modal.',
                    executelabel: 'Get',
                    refreshConfig: false,
                    refreshOrgs: false,
                    json: true,
                    type: 'success',
                    resultprocessor: 'logfile',
                    polling: {
                        supported: false
                    },
                    overview : 'Displays the contents of a selected debug log file from a specific Salesforce instance.',
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
                }
            ]
        },
        {
            name : 'scanner',
            label: 'Scanner',
            commands : [
                {
                    name: 'scannerlistrules',
                    label: 'List Rules',
                    icon: 'list',
                    startMessage: 'Listing rules',
                    completeMessage: 'Rules listed',
                    command: 'sfdx',
                    subcommand: 'scanner:rule:list',
                    instructions: 'TODO',
                    executelabel: 'List Rules',
                    refreshOrgs: false,
                    json: {
                        supported: true,
                        polling: false,
                        status: 'status',
                        result: 'result'
                    },
                    resultprocessor: 'scannerrules',
                    overview : 'TODO',
                    params : [
                        {
                            name : 'categories',
                            label: 'Categories',
                            type: 'text',
                            flag: '-c'
                        },
                        {
                            name : 'language',
                            label: 'Language',
                            type: 'text',
                            flag: '-l'
                        }
                    ]        
                },
                {
                    name: 'scannerscan',
                    label: 'Scan Files',
                    icon: 'opened_folder',
                    startMessage: 'Scanning files',
                    completeMessage: 'Files scanned',
                    command: 'sfdx',
                    subcommand: 'scanner:run',
                    instructions: 'TODO',
                    executelabel: 'Scan Files',
                    refreshOrgs: false,
                    openFile: 'user',
                    openFileParam: 'outfile',
                    json: {
                        supported: true,
                        polling: false,
                        status: 'status',
                        result: 'result'
                    },
                    resultprocessor: 'scannerrun',
                    overview : 'TODO',
                    params : [
                        {
                            name : 'categories',
                            label: 'Categories',
                            type: 'category',
                            flag: '-c'
                        },
                        {
                            name : 'target',
                            label: 'Target',
                            quote: true,
                            type: 'text',
                            flag: '-t'
                        },
                        {
                            name : 'format',
                            label: 'Format',
                            type: 'select',
                            default: 'html',
                            values: ['csv', 'json', 'junit', 'table', 'xml', 'html'],
                            flag: '-f'
                        },
                        {
                            name : 'outfile',
                            label: 'Output File',
                            type: 'text',
                            flag: '-o'
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
                    name: 'pkgcreate',
                    label: 'Create Package',
                    icon: 'open',
                    startMessage: 'Creating package',
                    completeMessage: 'Package created',
                    command: 'sfdx',
                    subcommand: 'force:package:create',
                    instructions: 'TODO',
                    executelabel: 'Create Package',
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
                            name : 'name',
                            label: 'Package Name',
                            type: 'text',
                            flag: '-n',
                        },
                        {
                            name : 'description',
                            label: 'Description',
                            type: 'text',
                            flag: '-d'
                        },
                        {
                            name : 'type',
                            label: 'Package Type',
                            type: 'select',
                            values: ['Managed','Unlocked'],
                            flag: '-t'
                        },
                        {
                            name: 'path',
                            label: 'Path',
                            type: 'dir',
                            relative: true,
                            flag: '-r'
                        },
                        {
                            name : 'orgdependent',
                            label: 'Org Dependent',
                            type: 'checkbox',
                            flag: '--orgdependent'
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
