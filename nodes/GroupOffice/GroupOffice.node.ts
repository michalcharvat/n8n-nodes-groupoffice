import {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	IHttpRequestMethods,
	NodeOperationError
} from 'n8n-workflow';

import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';

import {groupOfficeApiRequest} from "./GenericFunctions";

import {contactFields, contactOperations} from './ContactDescription';
import {projectFields, projectOperations} from "./ProjectDescription";
import {taskFields, taskOperations} from "./TaskDescription";
import {eventFields, eventOperations} from "./EventDescription";

export class GroupOffice implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Group Office',
		name: 'groupOffice',
		icon: 'file:groupoffice.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: "Consume Group Office API",
		defaults: {
			name: "Group Office"
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'groupOfficeApi',
				required: true,
				displayOptions: {
					show: {
						authentication: ['accessToken']
					}
				}
			},
			{
				name: 'groupOfficeOAuth2Api',
				required: true,
				displayOptions: {
					show: {
						authentication: ['oAuth2'],
					}
				}
			}
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'Access Token',
						value: 'accessToken',
					},
					{
						name: 'OAuth2',
						value: 'oAuth2',
					},
				],
				default: 'accessToken',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'Event',
						value: 'event',
					},
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Task',
						value: 'task',
					},
				],
				default: 'contact',
			},

			// ----------------------------------
			//         operations
			// ----------------------------------
			...contactOperations,
			...projectOperations,
			...taskOperations,
			...eventOperations,

			// ----------------------------------
			//         parameters
			// ----------------------------------
			...contactFields,
			...projectFields,
			...taskFields,
			...eventFields,

			{
				displayName: 'Endpoint',
				name: 'endpoint',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['__CUSTOM_API_CALL__'],
					},
				},
				placeholder: 'Api/EndPoint/get',
				description: 'Request endpoint',
			},
			{
				displayName: 'Data',
				name: 'requestData',
				type: 'json',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['__CUSTOM_API_CALL__'],
					},
				},
				placeholder: '["ID": [taskId]]',
				description: 'Request data',
			},
		]
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData().slice();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0);
		let operation = '';
		let requestData = {};

		if (resource !== '__CUSTOM_API_CALL__') {
			operation = this.getNodeParameter('operation', 0);
		}

		let requestMethod: IHttpRequestMethods = 'POST';
		let responseData: any;

		let endpoint: string = '';

		const headers: IDataObject = {};

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === '__CUSTOM_API_CALL__') {
					requestMethod = 'POST';

					endpoint = this.getNodeParameter('endpoint', i) as string;
					requestData = JSON.parse(this.getNodeParameter('requestData', i) as string);

				} else if (resource === 'contact') {

					requestMethod = 'POST';

					if (operation === 'create') {

						const contactFirstName = this.getNodeParameter('firstName', i) as string;
						const contactLastName = this.getNodeParameter('lastName', i) as string;
						const contactEmail = this.getNodeParameter('email', i) as string;

						let contactData = {
							"firstName": contactFirstName,
							"lastName": contactLastName,
							//"name": contactName,
							"emailAddresses":
								[{type: "work", email: contactEmail}],
						}

						endpoint = 'Contact/set';
						requestData = {
							"create": {
								"new": contactData
							}
						};
					} else if (operation === 'get') {
						const contactId = this.getNodeParameter('contactId', i) as string;

						endpoint = 'Contact/get';
						requestData = {
							"ids": [contactId],
						};
					}
				} else if (resource === 'event') {
					if (operation === 'get') {

						requestMethod = 'POST';
						const eventId = this.getNodeParameter('eventId', i) as string;

						endpoint = 'sf/n8n/Model/get';
						requestData = {
							"entity": "\\GO\\Calendar\\Model\\Event",
							"id": eventId,
						};
					}
				} else if (resource === 'task') {
					if (operation === 'get') {

						requestMethod = 'POST';
						const taskId = this.getNodeParameter('taskId', i) as string;

						endpoint = 'Task/get';
						requestData = {
							"ids": [taskId],
						};
					}
				} else if (resource === 'project') {
					if (operation === 'get') {

						requestMethod = 'POST';
						const projectId = this.getNodeParameter('projectId', i) as string;

						endpoint = 'sf/n8n/Model/get';
						requestData = {
							"entity": "\\GO\\Projects2\\Model\\Project",
							"id": projectId,
						};
					}
				} else {
					throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`, {
						itemIndex: i,
					});
				}

				try {
					responseData = await groupOfficeApiRequest.call(
						this,
						requestMethod,
						[[
							endpoint,
							requestData,
							"n8nClient-" + i,
						]],
						headers,
					);
				} catch (error) {
					if (this.continueOnFail()) {
						//if (resource === 'file' && operation === 'download') {
						//	items[i].json = { error: error.message };
						//} else {
						returnData.push({json: {error: error.message}, pairedItem: {item: i}});
						//}
						continue;
					}

					throw error;
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
					{itemData: {item: i}},
				);
				returnData.push(...executionData);

			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({error: error.message}),
						{itemData: {item: i}},
					);
					returnData.push(...executionData);
					continue;
				}
				throw error
			}
		}

		if (resource === 'file' && operation === 'download') {
			// For file downloads the files get attached to the existing items
			return [items];
		} else {
			// For all other ones does the output get replaced
			return [returnData];
		}
	}
}
