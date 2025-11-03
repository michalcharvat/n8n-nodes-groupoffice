import type {INodeProperties} from 'n8n-workflow';

export const projectOperations: INodeProperties[] = [
	// ----------------------------------
	//         			project
	// ----------------------------------
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['project'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get the data of a project',
				action: 'Get a project',
			},
		],
		default: 'get',
	},
];

export const projectFields: INodeProperties[] = [
	// ----------------------------------
	//         		project:get
	// ----------------------------------
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['project'],
			},
		},
		description: 'The ID of the project to get',
	},
];
