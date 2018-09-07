/**
 * ソーシャルプラスサービス
 * @module
 */

import * as factory from './factory';

import { AccountService } from './service/account.service';

export import factory = factory;

export namespace service {
    /**
     * アカウントサービス
     * @class
     */
    export class Account extends AccountService { }
}
