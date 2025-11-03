import type {OptionsWithUri} from 'request';

import {
	NodeOperationError,
	type IExecuteFunctions,
	IDataObject,
	INodeExecutionData, ILoadOptionsFunctions
} from 'n8n-workflow';

export async function groupOfficeApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: string,
	body: any = {},
	headers?: object,
) {
	const authenticationMethod = this.getNodeParameter('authentication', 0);

	let credentials;

	if (authenticationMethod === 'accessToken') {
		credentials = (await this.getCredentials('groupOfficeApi')) as { goUrl: string };
	} else {
		credentials = (await this.getCredentials('groupOfficeOAuth2Api')) as { goUrl: string };
	}

	headers = {'Content-Type': 'application/json'};
	body = JSON.stringify(body);

	const options: OptionsWithUri = {
		headers: headers,
		method: method,
		body: body,
		uri: `${credentials.goUrl}/api/jmap.php`,
		json: true,
	};

	console.log(credentials);
	console.log(headers);
	console.log(method);
	console.log(body);

	/*
	if (Object.keys(options.body as IDataObject).length === 0) {
		delete options.body;
	}*/

	const credentialType =
		authenticationMethod === 'accessToken' ? 'groupOfficeApi' : 'groupOfficeOAuth2Api';

	const response = await this.helpers.requestWithAuthentication.call(this, credentialType, options);

	if (typeof response === 'string' && response.includes('<b>Fatal error</b>')) {
		throw new NodeOperationError(
			this.getNode(),
			"GroupOffice responded with a 'Fatal error', check description for more details",
			{
				description: `Server response:\n${response}`,
			},
		);
	}

	return response;
}

export function validateJSON(json: string | undefined): any {
	let result;
	try {
		result = JSON.parse(json!);
	} catch (exception) {
		result = [];
	}
	return result;
}

export function wrapData(data: IDataObject | IDataObject[]): INodeExecutionData[] {
	if (!Array.isArray(data)) {
		return [{ json: data }];
	}
	return data.map((item) => ({
		json: item,
	}));
}
