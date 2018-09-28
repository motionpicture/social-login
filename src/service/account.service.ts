import * as createDebug from 'debug';
import { OK } from 'http-status';

import * as factory from '../factory/account.factory';
import { Service } from '../service';
import { checkForDate, checkNull } from './common';

const debug = createDebug('social-plus:service');

/**
 * アカウントサービス
 * @class
 */
export class AccountService extends Service {
    /**
     * 認証対象のソーシャル PLUS ID の取得
     */
    public async authenticateUser(args: factory.IAuthenticatedUserArgs): Promise<factory.IAuthenticatedUserResult> {
        debug('requesting...', args);
        const qs: factory.IAuthenticatedUserAPIIn = {
            token: args.token
        };
        if (args.addProfile !== undefined) {
            qs.add_profile = args.addProfile;
        }
        if (args.deleteProfile !== undefined) {
            qs.delete_profile = args.deleteProfile;
        }
        if (args.preserveToken !== undefined) {
            qs.preserve_token = args.preserveToken;
        }

        const options = {
            expectedStatusCodes: [OK],
            uri: '/api/authenticated_user',
            method: 'GET',
            qs
        };
        const result: factory.IAuthenticatedUserAPIOut = await this.request(options);
        debug('result...', result);

        return {
            status: result.status,
            user: {
                identifier: result.user.identifier,
                primaryKey: result.user.primary_key,
                mappedAt: result.user.mapped_at === null ? undefined : new Date(result.user.mapped_at),
                lastLoggedInAt: result.user.last_logged_in_at === null ? undefined : new Date(result.user.last_logged_in_at),
                loginCount: result.user.login_count,
                createdAt: new Date(result.user.created_at),
                lastLoggedInProvider: result.user.last_logged_in_provider
            }
        };
    }

    /**
     * ソーシャル PLUS ID とお客様ユーザ ID の紐付け
     */
    public async map(args: factory.IMapArgs): Promise<factory.IResultCommon> {
        debug('requesting...', args);
        const qs: factory.IMapAPIIn = {
            identifier: args.identifier,
            primary_key: args.primaryKey
        };
        if (args.overwrite !== undefined) {
            qs.overwrite = args.overwrite;
        }

        const options = {
            expectedStatusCodes: [OK],
            uri: '/api/map',
            method: 'GET',
            qs
        };
        const result: factory.IResultCommon = await this.request(options);
        debug('result...', result);

        return result;
    }

    /**
     * ユーザがログインしたことのあるソーシャルプロバイダ一覧
     */
    public async providersOfUser(args: factory.IProviderOfUserArgs): Promise<factory.IProviderOfUserResults> {
        debug('requesting...', args);
        let qs: factory.IProviderOfUserAPIIn;
        if ((<factory.IPrimaryKey>args).primaryKey !== undefined) {
            qs = { primary_key: (<factory.IPrimaryKey>args).primaryKey };
        } else {
            qs = { identifier: (<factory.IIdentifier>args).identifier };
        }

        const options = {
            expectedStatusCodes: [OK],
            uri: '/api/providers_of_user',
            method: 'GET',
            qs
        };
        const result: factory.IProviderOfUserAPIOut = await this.request(options);
        debug('result...', result);

        return result;
    }

    /**
     * ユーザ作成
     */
    public async createUser(args: factory.ICreateUserArgs): Promise<factory.ICreateUserResult> {
        debug('requesting...', args);
        const qs: factory.ICreateUserAPIIn = {};
        if (args.primaryKey !== undefined) {
            qs.primary_key = args.primaryKey;
        }

        const options = {
            expectedStatusCodes: [OK],
            uri: '/api/create_user',
            method: 'GET',
            qs
        };
        const result: factory.ICreateUserAPIOut = await this.request(options);
        debug('result...', result);

        return {
            status: result.status,
            user: {
                identifier: result.user.identifier,
                primaryKey: result.user.primary_key
            }
        };
    }

    /**
     * ソーシャルプロバイダ追加用トークンの発行
     */
    public async associationToken(args: factory.IAssociationTokenArgs): Promise<factory.IAssociationTokenResult> {
        debug('requesting...', args);
        const qs: factory.IAssociationTokenAPIIn = {
            target_provider: args.targetProvider
        };
        if ((<factory.IAssociationTokenArgsWithPrimaryKey>args).primaryKey !== undefined) {
            qs.primary_key = (<factory.IAssociationTokenArgsWithPrimaryKey>args).primaryKey;
        } else {
            qs.identifier = (<factory.IAssociationTokenArgsWithIdentifier>args).identifier;
        }

        const options = {
            expectedStatusCodes: [OK],
            uri: '/api/association_token',
            method: 'GET',
            qs
        };
        const result: factory.IAssociationTokenAPIOut = await this.request(options);
        debug('result...', result);

        return {
            status: result.status,
            token: {
                token: result.token.token,
                expiredAt: new Date(result.token.expired_at)
            },
            authenticateUri: result.authenticate_uri
        };
    }

    /**
     * ソーシャルプロバイダとの紐付け削除
     */
    public async dissociate(args: factory.IDissociateArgs): Promise<factory.IDissociateResult> {
        debug('requesting...', args);
        const qs: factory.IDissociateAPIIn = {
            target_provider: args.targetProvider
        };
        if ((<factory.IDissociateArgsWithPrimaryKey>args).primaryKey !== undefined) {
            qs.primary_key = (<factory.IDissociateArgsWithPrimaryKey>args).primaryKey;
        } else {
            qs.identifier = (<factory.IDissociateArgsWithIdentifier>args).identifier;
        }
        if (args.nowarn !== undefined) {
            qs.nowarn = args.nowarn;
        }
        if (args.nomerge !== undefined) {
            qs.nomerge = args.nomerge;
        }

        const options = {
            expectedStatusCodes: [OK],
            uri: '/api/dissociate',
            method: 'GET',
            qs
        };
        const result: factory.IDissociateAPIOut = await this.request(options);
        debug('result...', result);

        return result;
    }

    /**
     * 個人情報の取得
     */
    public async profile(args: factory.IProfileArgs): Promise<factory.IProfileResult> {
        debug('requesting...', args);
        const qs: factory.IProfileAPIIn = {};
        if ((<factory.IProfileArgsWithPrimaryKey>args).primaryKey !== undefined) {
            qs.primary_key = (<factory.IProfileArgsWithPrimaryKey>args).primaryKey;
        } else {
            qs.identifier = (<factory.IProfileArgsWithIdentifier>args).identifier;
        }
        if (args.deleteProfile !== undefined) {
            qs.delete_profile = args.deleteProfile.toString();
        }
        const options = {
            expectedStatusCodes: [OK],
            uri: '/api/profile', method: 'GET', qs
        };
        const result: factory.IProfileAPIOut = await this.request(options);
        debug('result...', result);
        const profile: any = (result.profile !== null) ? result.profile : undefined;

        return {
            status: result.status,
            user: {
                identifier: result.user.identifier,
                primaryKey: result.user.primary_key,
                mappedAt: new Date(result.user.mapped_at),
                lastLoggedInAt: new Date(result.user.last_logged_in_at),
                lastLoggedInProvider: result.user.last_logged_in_provider,
                loginCount: result.user.login_count,
                createdAt: new Date(result.user.created_at),
                profileProhibited: result.user.profile_prohibited
            },
            profile: {
                firstName: checkNull(profile.first_name),
                firstNameKana: checkNull(profile.first_name_kana),
                firstNameKanji: checkNull(profile.first_name_kanji),
                middleName: checkNull(profile.middle_name),
                middleNameKana: checkNull(profile.middle_name_kana),
                middleNameKanji: checkNull(profile.middle_name_kanji),
                lastName: checkNull(profile.last_name),
                lastNameKana: checkNull(profile.last_name_kana),
                lastNameKanji: checkNull(profile.last_name_kanji),
                fullName: checkNull(profile.full_name),
                fullNameKana: checkNull(profile.full_name_kana),
                fullNameKanji: checkNull(profile.full_name_kanji),
                userName: checkNull(profile.user_name),
                verified: checkNull(profile.verified),
                gender: checkNull(profile.gender),
                bloodType: checkNull(profile.blood_type),
                birthday: checkForDate(profile.birthday),
                ageRangeMax: checkNull(profile.age_range_max),
                ageRangeMin: checkNull(profile.age_range_min),
                relationshipStatus: checkNull(profile.relationship_status),
                location: checkNull(profile.location),
                locationId: checkNull(profile.location_id),
                locationJisId: checkNull(profile.location_jis_id),
                postalCode: checkNull(profile.postal_code),
                prefecture: checkNull(profile.prefecture),
                city: checkNull(profile.city),
                street: checkNull(profile.street),
                hometown: checkNull(profile.hometown),
                hometownId: checkNull(profile.hometown_id),
                hometownJisId: checkNull(profile.hometown_jis_id),
                graduatedSchool: checkNull(profile.graduated_school),
                graduatedSchoolType: checkNull(profile.graduated_school_type),
                graduatedYear: checkNull(profile.graduated_year),
                jobCompany: checkNull(profile.job_company),
                jobPosition: checkNull(profile.job_position),
                uri: checkNull(profile.uri),
                website: checkNull(profile.website),
                quotes: checkNull(profile.quotes),
                bio: checkNull(profile.bio),
                imageUrl: checkNull(profile.image_url),
                lastUpdatedAt: checkForDate(profile.last_updated_at),
                updateCount: checkNull(profile.update_count)
            },
            follow: {
                followedBy: result.follow.followed_by,
                following: result.follow.following
            },
            email: result.email.map((email) => ({
                email: email.email,
                verified: email.verified,
                mediaId: email.media_id
            })),
            phone: result.phone.map((phone) => ({
                number: phone.number,
                verified: phone.verified,
                mediaId: phone.media_id,
                type: phone.type
            })),
            favorite: result.favorite.map((fav) => ({
                category: fav.category,
                name: fav.name,
                mediaId: fav.media_id,
                itemType: fav.item_type
            }))
        };
    }

    /**
     * ユーザの結合
     */
    public async mergeUser(args: factory.IMergeUserArgs): Promise<factory.IMergeUserResult> {
        debug('requesting...', args);
        const qs: factory.IMergeUserAPIIn = {};
        if (args.sourceIdentifier !== undefined) {
            qs.source_identifier = args.sourceIdentifier;
        } else if (args.sourcePrimaryKey !== undefined) {
            qs.source_primary_key = args.sourcePrimaryKey;
        } else {
            throw(new Error('結合元が必須です。'));
        }

        if (args.destIdentifier !== undefined) {
            qs.dest_identifier = args.destIdentifier;
        } else if (args.destPrimaryKey !== undefined) {
            qs.dest_primary_key = args.destPrimaryKey;
        } else {
            throw(new Error('結合先が必須です。'));
        }

        if (args.nomerge !== undefined) {
            qs.nomerge = args.nomerge;
        }

        const options = {
            expectedStatusCodes: [OK],
            uri: '/api/merge_user',
            method: 'GET',
            qs
        };
        const result: factory.IMergeUserAPIOut = await this.request(options);
        debug('result...', result);

        return result;
    }
}
