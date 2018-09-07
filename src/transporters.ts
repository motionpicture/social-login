// tslint:disable:max-classes-per-file

/**
 * transporters
 * @ignore
 */

import * as createDebug from 'debug';
// import * as querystring from 'querystring';
import * as request from 'request';
// import * as fetch from 'isomorphic-fetch';
// import { BadRequestError } from './error/badRequest';

const debug = createDebug('mvtk:transporters');
// tslint:disable-next-line
const pkg = require('../package.json');

/**
 * transporter abstract class
 * トランスポーター抽象クラス
 * @export
 * @class
 * @abstract
 */
// export abstract class Transporter {
//     public abstract async request(url: string, options: RequestInit): Promise<any>;
// }
export abstract class Transporter {
    public abstract async request(options: request.OptionsWithUrl): Promise<any>;
}

export type IBodyResponseCallback = Promise<any>;

/**
 * RequestError
 * @export
 * @class
 */
export class RequestError extends Error {
    public code: number;
    public errors: Error[];
}

/**
 * stub transporter
 * スタブトランポーター
 * @export
 * @class
 */
export class StubTransporter implements Transporter {
    public body: any;
    constructor(body: any) {
        this.body = body;
    }

    public async request(options: request.OptionsWithUrl) {
        debug('requesting...', options);

        return this.body;
    }
}

/**
 * DefaultTransporter
 * @export
 * @class
 */
export class DefaultTransporter implements Transporter {
    /**
     * Default user agent.
     */
    public static readonly USER_AGENT: string = `mvtk/${pkg.version}`;

    public expectedStatusCodes: number[];

    constructor(expectedStatusCodes: number[]) {
        this.expectedStatusCodes = expectedStatusCodes;
    }

    /**
     * Configures request options before making a request.
     */
    public static CONFIGURE(options: request.OptionsWithUrl): request.OptionsWithUrl {
        // set transporter user agent

        options.headers = (options.headers !== undefined) ? options.headers : {};
        if (!options.headers['User-Agent']) {
            options.headers['User-Agent'] = DefaultTransporter.USER_AGENT;
        } else if (options.headers['User-Agent'].indexOf(DefaultTransporter.USER_AGENT) === -1) {
            options.headers['User-Agent'] = `${options.headers['User-Agent']} ${DefaultTransporter.USER_AGENT}`;
        }

        return options;
    }

    /**
     * Makes a request with given options and invokes callback.
     */
    public async request(options: request.OptionsWithUrl) {
        const requestOptions = DefaultTransporter.CONFIGURE(options);
        debug('requesting...', requestOptions);

        return new Promise<any>((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                debug('error', error);
                try {
                    const result = this.wrapCallback(error, response, body);
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            });
        });
    }

    /**
     * Wraps the response callback.
     */
    private wrapCallback(error: any, response: request.RequestResponse, body: any): any {
        debug('request processed.', error, response.statusCode, body);
        let err: any = new RequestError('An unexpected error occurred');

        // tslint:disable-next-line:no-single-line-block-comment
        /* istanbul ignore else */
        if (response.statusCode !== undefined) {
            if (this.expectedStatusCodes.indexOf(response.statusCode) < 0) {
                err = new RequestError(body);
                err.code = response.statusCode;
                err.errors = [];
            } else {
                // 結果をオブジェクトとして返却
                let result;
                try {
                    result = JSON.parse(body);
                } catch {
                    result = {};
                }

                return result;
            }
        }

        throw err;
    }
}
