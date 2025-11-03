import {INodeProperties} from 'n8n-workflow';

export const eventOperations: INodeProperties[] = [
	// ----------------------------------
	//         			event
	// ----------------------------------
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['event'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get the data of a event',
				action: 'Get a event',
			},
		],
		default: 'get',
	},
];

export const eventFields: INodeProperties[] = [
	// ----------------------------------
	//         		event:get
	// ----------------------------------
	{
		displayName: 'Event ID',
		name: 'eventId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['event'],
			},
		},
		description: 'The ID of the event to get',
	},
];
