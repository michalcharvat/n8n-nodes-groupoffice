import type {INodeProperties} from 'n8n-workflow';

export const taskOperations: INodeProperties[] = [
	// ----------------------------------
	//         			task
	// ----------------------------------
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['task'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get the data of a task',
				action: 'Get a task',
			},
		],
		default: 'get',
	},
];

export const taskFields: INodeProperties[] = [
	// ----------------------------------
	//         		task:get
	// ----------------------------------
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['task'],
			},
		},
		description: 'The ID of the task to get',
	},
];
