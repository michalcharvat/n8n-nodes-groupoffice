import type {
	IDataObject,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';

export class GroupOfficeTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Group Office Trigger',
		name: 'groupOfficeTrigger',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:groupoffice.svg',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when Group Office events occur',
		defaults: {
			name: 'Group Office',
		},
		inputs: [],
		outputs: ['main'],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				options: [
					{
						name: '*',
						value: '*',
						description: 'Any time any event is triggered (Wildcard Event)',
					},
					{
						name: 'Calendar Event Added',
						value: 'calendar_event_added',
						description: 'Triggered when a event is added',
					},
					{
						name: 'Calendar Event Deleted',
						value: 'calendar_event_deleted',
						description: 'Triggered when a event is deleted',
					},
					{
						name: 'Calendar Event Updated',
						value: 'calendar_event_updated',
						description: 'Triggered when a event is updated',
					},
					{
						name: 'Contact Added',
						value: 'addressbook_contact_added',
						description: 'Triggered when a contact is added',
					},
					{
						name: 'Contact Deleted',
						value: 'addressbook_contact_deleted',
						description: 'Triggered when a contact is deleted',
					},
					{
						name: 'Contact Updated',
						value: 'addressbook_contact_updated',
						description: 'Triggered when a contact is updated',
					},
					{
						name: 'Finance Document Added',
						value: 'finance_financedocument_added',
						description: 'Triggered when a finance document is added',
					},
					{
						name: 'Finance Document Deleted',
						value: 'finance_financedocument_deleted',
						description: 'Triggered when a finance document is deleted',
					},
					{
						name: 'Finance Document Updated',
						value: 'finance_financedocument_updated',
						description: 'Triggered when a finance document is updated',
					},
					{
						name: 'Note Added',
						value: 'notes_note_added',
						description: 'Triggered when a note is added',
					},
					{
						name: 'Note Deleted',
						value: 'notes_note_deleted',
						description: 'Triggered when a note is deleted',
					},
					{
						name: 'Note Updated',
						value: 'notes_note_updated',
						description: 'Triggered when a note is updated',
					},
					{
						name: 'Project Added',
						value: 'project_added',
						description: 'Triggered when a project is added',
					},
					{
						name: 'Project Deleted',
						value: 'project_deleted',
						description: 'Triggered when a project is deleted',
					},
					{
						name: 'Project Updated',
						value: 'project_updated',
						description: 'Triggered when a project is updated',
					},
					{
						name: 'Task Added',
						value: 'tasks_task_added',
						description: 'Triggered when a task is added',
					},
					{
						name: 'Task Deleted',
						value: 'tasks_task_deleted',
						description: 'Triggered when a task is deleted',
					},
					{
						name: 'Task Updated',
						value: 'tasks_task_updated',
						description: 'Triggered when a task is updated',
					},
				],
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();
		const req = this.getRequestObject();

		const events = this.getNodeParameter('events', []) as string[];

		//console.log(req.body);

		const eventType = bodyData.event_type as string | undefined;

		//console.log(eventType);

		if (eventType === undefined || (!events.includes('*') && !events.includes(eventType))) {
			// If not eventType is defined or when one is defined but we are not
			// listening to it do not start the workflow.
			return {};
		}

		return {
			workflowData: [this.helpers.returnJsonArray(req.body as IDataObject[])],
		};
	}
}