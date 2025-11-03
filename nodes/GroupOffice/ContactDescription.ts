import type {INodeProperties} from 'n8n-workflow';

export const contactOperations: INodeProperties[] = [
	// ----------------------------------
	//         			contact
	// ----------------------------------
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['contact'],
			},
		},
		options: [
			/*
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new contact',
				action: 'Create a contact',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a contact',
				action: 'Delete a contact',
			},*/
			{
				name: 'Get',
				value: 'get',
				description: 'Get the data of a contact',
				action: 'Get a contact',
			},
			/*{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many contacts',
				action: 'Get many contacts',
			},*/
		],
		default: 'get',
	},
];

export const contactFields: INodeProperties[] = [
	// ----------------------------------
	//         		contact:create
	// ----------------------------------
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		placeholder: 'John',
		description: 'Firstname of created contact',
	},

	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		placeholder: 'Doe',
		description: 'Last Name of created contact',
	},

	{
		displayName: 'E-Mail',
		name: 'email',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		placeholder: 'john.doe@domain.com',
		description: 'E-mail address of created contact',
	},
	// ----------------------------------
	//         		contact:delete
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['delete'],
				resource: ['contact'],
			},
		},
		description: 'The ID of the contact to delete',
	},

	// ----------------------------------
	//         		contact:get
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['contact'],
			},
		},
		description: 'The ID of the contact to get',
	},
];

export const contactRequest = function() {

};
