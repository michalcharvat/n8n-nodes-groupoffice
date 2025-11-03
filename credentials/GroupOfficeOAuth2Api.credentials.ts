import type { ICredentialType, INodeProperties } from 'n8n-workflow';



export class GroupOfficeOAuth2Api implements ICredentialType {
	name = 'groupOfficeOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Group Office OAuth2 API';

	documentationUrl = 'https://groupoffice.readthedocs.io/';

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Group Office URL',
			name: 'goUrl',
			type: 'string',
			placeholder: 'https://groupoffice.example.com',
			default: '',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'string',
			default: 'https://groupoffice.example.com/api/oauth.php/authorize',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'string',
			default: 'https://groupoffice.example.com/api/oauth.php/token',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'openid',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
	];
}
