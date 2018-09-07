// import * as qs from 'qs';
import * as request from 'request';

import { DefaultTransporter, Transporter } from './transporters';

/**
 * service constructor options
 * @export
 * @interface
 */
export interface IOptions {
    /**
     * apiKey
     */
    apiKey: string;
    /**
     * transporter object
     */
    transporter?: Transporter;
}

export type IRequestOptions = request.OptionsWithUri & {
    expectedStatusCodes: number[];
};

/**
 * base service class
 * @export
 * @class Service
 */
export class Service {
    public options: IOptions;
    public requestOptions: request.CoreOptions;
    // ソーシャルプラスのエンドポイントは固定です。
    private ENDPOINT: string = 'https://api.socialplus.jp';

    constructor(options: IOptions, requestOptions?: request.CoreOptions) {
        this.options = options;

        this.requestOptions = {
            headers: {},
            method: 'GET'
        };
        if (requestOptions !== undefined) {
            this.requestOptions = { ...this.requestOptions, ...requestOptions };
        }
    }

    /**
     * Create and send request to API
     */
    public async request(options: IRequestOptions) {
        const qs = {
            key: this.options.apiKey,
            ...options.qs
        };
        delete options.qs;
        const requestOptions = {
            url: `${this.ENDPOINT}${options.uri}`,
            qs,
            ...this.requestOptions,
            ...options
        };

        /*requestOptions.headers = {
            'Content-Type': 'application/json'
        };*/

        delete requestOptions.uri;

        // create request
        const transporter =
            (this.options.transporter !== undefined) ? this.options.transporter : new DefaultTransporter(options.expectedStatusCodes);

        return transporter.request(requestOptions);
    }
}
