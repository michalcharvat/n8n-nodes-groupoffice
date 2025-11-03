import type {
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';

export class GroupOfficeApi implements ICredentialType {
	name = 'groupOfficeApi';

	displayName = 'Group Office API';

	documentationUrl = 'https://groupoffice.readthedocs.io/';

	properties: INodeProperties[] = [
		{
			displayName: 'Group Office URL',
			name: 'goUrl',
			type: 'string',
			placeholder: 'https://groupoffice.example.com',
			default: '',
		},
		{
			displayName: 'API Key',
			name: 'password',
			type: 'string',
			typeOptions: {password: true},
			default: '',
		},
	];

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		requestOptions.headers = {
			'Content-Type': 'application/json; charset=utf-8',
			'Authorization': "Bearer " + credentials.password
		};
		return requestOptions;
	}

	test: ICredentialTestRequest = {
		request: {
			baseURL: "={{$credentials.goUrl}}",
			url: '/api/jmap.php',
		},
	};
}
