/**
 * account.factory
 */

export interface IResultCommon {
    /**
     * リクエストが成功したかどうか。
     */
    status: ResponseStatus;
}

export interface IAuthenticatedUserArgs {
    /**
     * ソーシャル PLUS で振られたワンタイムトークン
     */
    token: string;
    /**
     * 真の場合はワンタイムトークンを削除しません
     * デバッグ時のみとし、通常は指定しないでください
     */
    preserveToken?: string;
    /**
     * 利用プランが旧 Entry 以上または新 Standard 以上の場合、認証情報に加えて個人情報を返します。
     */
    addProfile?: string;
    /**
     * add_profile が真の場合、このパラメータを真で与えると WebAPI 呼び出し後にソーシャル PLUS 側で保存している個人情報を削除します。
     */
    deleteProfile?: string;
}

export interface IAuthenticatedUserAPIIn {
    token: string;
    preserve_token?: string;
    add_profile?: string;
    delete_profile?: string;
}

export enum ResponseStatus {
    OK = 'ok',
    Failed = 'failed'
}

export enum SocialLoginProvider {
    Facebook = 'facebook',
    Twitter = 'twitter',
    Google = 'google',
    /**
     * Google+
     */
    Gplus = 'gplus',
    /**
     * Yahoo! JAPAN
     */
    Yahoo = 'yahoo',
    LINE = 'line',
    /**
     * 楽天
     */
    RakuTen = 'rakuten',
    /**
     * AppleID
     */
    Apple = 'apple'
}

export interface IUser {
    /**
     * ソーシャル PLUS ID
     */
    identifier: string;
    /**
     * お客様サイト側ユーザ ID。
     * map メソッドで紐付けられている場合に出 力されます。
     */
    primaryKey: string;
    /**
     * map メソッドで紐付けられた日時。
     */
    mappedAt: Date | undefined;
    /**
     * 前回のログイン日時。
     */
    lastLoggedInAt: Date | undefined;
    /**
     * 前回のログイン日時。
     */
    loginCount: number;
    /**
     * 初回ログイン日時。
     */
    createdAt: Date;
    /**
     * 前回ログインしたソーシャルプロバイダ名。
     */
    lastLoggedInProvider: SocialLoginProvider;
}

export interface IAuthenticatedUserResult extends IResultCommon {
    user: IUser;
}

export interface IUserOut {
    identifier: string;
    primary_key: string;
    mapped_at: string;
    last_logged_in_at: string;
    login_count: number;
    created_at: string;
    last_logged_in_provider: SocialLoginProvider;
}

export interface IAuthenticatedUserAPIOut extends IResultCommon {
    user: IUserOut;
}

export interface IMapAPIIn {
    identifier: string;
    primary_key: string;
    overwrite?: string;
}

export interface IMapArgs {
    /**
     * 紐付け対象のソーシャル PLUS ID。
     */
    identifier: string;
    /**
     * 紐付け対象のお客様サイト側ユーザ ID。
     * ユーザ ID は、ASCII コード 0x21~0x7f の範囲内、最大 255 バイトで指定する必要があります。
     */
    primaryKey: string;
    /**
     * すでに紐付け作業が行われている場合はエラーになりますが、overwrite に真を指定すると上書きされます。
     */
    overwrite?: string;
}

export interface IProviderOfUserAPIIn {
    identifier?: string;
    primary_key?: string;
}

export interface IIdentifier {
    /**
     * 取得対象のソーシャル PLUS ID。
     */
    identifier: string;
}

export interface IPrimaryKey {
    /**
     * 取得対象のお客様サイト側ユーザ ID。
     */
    primaryKey: string;
}

export type IProviderOfUserArgs = IIdentifier | IPrimaryKey;

export interface IProviderOfUserResults extends IResultCommon {
    /**
     * ログインしたことのあるソーシャルプロバイダ名。
     */
    providers: SocialLoginProvider[];
}
export type IProviderOfUserAPIOut = IProviderOfUserResults;

export interface ICreateUserAPIIn {
     primary_key?: string;
}

export interface ICreateUserArgs {
    /**
     * 紐付け対象のお客様サイト側ユーザ ID。
     * ユーザ ID は、ASCII コード 0x21~0x7f の範囲内で、最大 255 バイトで指定する必要があります。
     */
    primaryKey?: string;
}

export interface ICreateUserAPIOut extends IResultCommon {
    user: {
        identifier: string;
        primary_key: string;
    };
}

export interface ICreateUserResult extends IResultCommon {
    user: {
        /**
         * 作成したユーザのソーシャル PLUS ID。
         */
        identifier: string;
        /**
         * 作成したユーザに紐付けたお客様サイト側 ユーザ ID。
         */
        primaryKey: string;
    };
}

export interface IAssociationTokenAPIIn {
    identifier?: string;
    primary_key?: string;
    target_provider: SocialLoginProvider;
}

export interface ITargetProvider {
    /**
     * 追加で紐付けるソーシャルプロバイダ名。
     */
    targetProvider: SocialLoginProvider;
}

export type IAssociationTokenArgsWithPrimaryKey = ITargetProvider & IPrimaryKey;

export type IAssociationTokenArgsWithIdentifier = ITargetProvider & IIdentifier;

export type IAssociationTokenArgs = IAssociationTokenArgsWithIdentifier | IAssociationTokenArgsWithPrimaryKey;

export interface IAssociationTokenAPIOut extends IResultCommon {
    token: {
        token: string;
        expired_at: string;
    };
    authenticate_uri: string;
}

export interface IAssociationTokenResult extends IResultCommon {
    token: {
        /**
         * ソーシャルプロバイダ追加用トーク ン。
         */
        token: string;
        /**
         * トークンの有効期限。
         */
        expiredAt: Date;
    };
    /**
     * ソーシャルプロバイダ追加用ソー シャルログイン URL の部品。
     */
    authenticateUri: string;
}

export interface IDissociateAPIIn {
    identifier?: string;
    primary_key?: string;
    target_provider: SocialLoginProvider;
    nowarn?: boolean;
    nomerge?: boolean;
}

export interface IDissociateArgsBase {
    /**
     * 削除対象のプロバイダ。複数指定する場合は,で区切 って指定可能。
     */
    targetProvider: SocialLoginProvider;
    /**
     * true を指定した場合、処理後に紐付くソーシャルプロバイダが存在しなくなる場合でもエラーを発生させません。
     */
    nowarn?: boolean;
    /**
     * true を指定した場合、処理後に個人情報を更新しません。
     */
    nomerge?: boolean;
}

export type IDissociateArgsWithIdentifier = IDissociateArgsBase & IIdentifier;

export type IDissociateArgsWithPrimaryKey = IDissociateArgsBase & IPrimaryKey;

export type IDissociateArgs = IDissociateArgsWithIdentifier | IDissociateArgsWithPrimaryKey;

export interface IDissociateResult extends IResultCommon {
    /**
     * 紐付けを削除したソーシャルプロバイダ名。
     */
    dissociated: SocialLoginProvider[];
}

export type IDissociateAPIOut = IDissociateResult;

export interface IProfileAPIIn {
    identifier?: string;
    primary_key?: string;
    delete_profile?: string;
}

export interface IProfileArgsWithIdentifier extends IIdentifier {
    /**
     * 真の場合、WebAPI 呼び出し後にソーシャル PLUS 側 で保存している個人情報を削除します。
     */
    deleteProfile?: string;
}

export interface IProfileArgsWithPrimaryKey extends IPrimaryKey {
    /**
     * 真の場合、WebAPI 呼び出し後にソーシャル PLUS 側 で保存している個人情報を削除します。
     */
    deleteProfile?: string;
}

export type IProfileArgs = IProfileArgsWithIdentifier | IProfileArgsWithPrimaryKey;

export enum IGender {
    /**
     * 男性
     */
    Male = 1,
    /**
     * 女性
     */
    Female = 2,
    /**
     * その他
     */
    Other = 3
}

export enum IRelationshipStatus {
    /**
     * 独身
     */
    Single = 1,
    /**
     * 交際中
     */
    InARelationship = 2,
    /**
     * 婚約中
     */
    Engaged = 3,
    /**
     * 既婚
     */
    Married = 4,
    /**
     * 複雑な関係
     */
    ComplexRelationship = 5,
    /**
     * オープンな関係
     */
    OpenRelationship = 6,
    /**
     * 配偶者と死別
     */
    BereavedOfSpouse = 7,
    /**
     * 別居
     */
    Separately = 8,
    /**
     * 離婚
     */
    Divorce = 9,
    /**
     * シビル・ユニオン
     */
    CivilUnion = 10,
    /**
     * ドメスティック・パートナー
     */
    DomesticPartner = 11
}

export interface IProfileOut {
    first_name: string;
    first_name_kana: string;
    first_name_kanji: string;
    middle_name: string;
    middle_name_kana: string;
    middle_name_kanji: string;
    last_name: string;
    last_name_kana: string;
    last_name_kanji: string;
    full_name: string;
    full_name_kana: string;
    full_name_kanji: string;
    user_name: string;
    verified: boolean;
    gender: IGender;
    blood_type: string;
    birthday: string;
    age_range_max: number;
    age_range_min: number;
    relationship_status: IRelationshipStatus;
    location: string;
    location_id: string;
    location_jis_id: number;
    postal_code: string;
    prefecture: string;
    city: string;
    street: string;
    hometown: string;
    hometown_id: string;
    hometown_jis_id: number;
    graduated_school: string;
    graduated_school_type: string;
    graduated_year: string;
    job_company: string;
    job_position: string;
    uri: string[];
    website: string[];
    quotes: string;
    bio: string;
    image_url: string;
    last_updated_at: string;
    update_count: number;
}

export interface IEmailOut {
    email: string;
    verified: boolean;
    media_id: SocialLoginProvider;
}

export interface IPhoneOut {
    // tslint:disable-next-line:no-reserved-keywords
    number: string;
    // tslint:disable-next-line:no-reserved-keywords
    type: PhoneType;
    verified: boolean;
    media_id: SocialLoginProvider;
}

export enum FavoriteType {
    Like = 'like',
    Interest = 'interest',
    Book = 'book',
    Movie = 'movie',
    TV = 'tv',
    Game = 'game',
    Sports = 'sports',
    Cooking = 'cooking',
    Music = 'music',
    Food = 'food',
    Outdoor = 'outdoor',
    Brand = 'brand',
    Resort = 'resort',
    Art = 'art',
    Lesson = 'lesson',
    Celebrity = 'celebrity',
    Website = 'website',
    Gambling = 'gambling',
    Pet = 'pet',
    Quote = 'quote',
    Holiday = 'holiday'
}

export interface IFavoriteOut {
    category: string;
    name: string;
    media_id: SocialLoginProvider;
    item_type: FavoriteType;
}

export interface IProfileAPIOut extends IResultCommon {
    user: IUserOut & {
        profile_prohibited: boolean;
    };
    profile: IProfileOut;
    follow: {
        followed_by: number;
        following: number;
    };
    email: IEmailOut[];
    phone: IPhoneOut[];
    favorite: IFavoriteOut[];
}

export interface IProfile {
    /**
     * 名。
     */
    firstName: string;
    /**
     * 名(カナ)。
     */
    firstNameKana: string;
    /**
     * 名(漢字)。
     */
    firstNameKanji: string;
    /**
     * ミドルネーム。
     */
    middleName: string;
    /**
     * ミドルネーム(カナ)。
     */
    middleNameKana: string;
    /**
     * ミドルネーム(漢字)。
     */
    middleNameKanji: string;
    /**
     * 姓。
     */
    lastName: string;
    /**
     * 姓(カナ)。
     */
    lastNameKana: string;
    /**
     * 姓(漢字)。
     */
    lastNameKanji: string;
    /**
     * フルネーム。
     */
    fullName: string;
    /**
     * フルネーム(カナ)。
     */
    fullNameKana: string;
    /**
     * フルネーム(漢字)。
     */
    fullNameKanji: string;
    /**
     * ユーザ名文字列。
     */
    userName: string;
    /**
     * ソーシャルプロバイダ側で本人確認されているか
     */
    verified: boolean;
    /**
     * 性別。
     */
    gender: IGender | undefined;
    /**
     * 血液型
     */
    bloodType: string;
    /**
     * 誕生日。
     */
    birthday: Date | undefined;
    /**
     * 年齢層上限
     */
    ageRangeMax: number;
    /**
     * 年齢層下限。
     */
    ageRangeMin: number;
    /**
     * 交際状況。
     */
    relationshipStatus: IRelationshipStatus | undefined;
    /**
     * 居住地。
     */
    location: string;
    /**
     * ソーシャルプロバイダ側居住地 ID。
     */
    locationId: string;
    /**
     * 居住地 JIS 都道府県・市区町村コード。
     */
    locationJisId: number | undefined;
    /**
     * 郵便番号。
     */
    postalCode: string;
    /**
     * 都道府県。
     */
    prefecture: string;
    /**
     * 市区町村。
     */
    city: string;
    /**
     * 街区および番地。ただし、半角・全角の正規化は実施していません。
     */
    street: string;
    /**
     * 出身地。
     */
    hometown: string;
    /**
     * ソーシャルプロバイダ側出身地 ID。
     */
    hometownId: string;
    /**
     * 出身地 JIS 都道府県・市区町村コード。
     */
    hometownJisId: number | undefined;
    /**
     * 卒業学校名。
     */
    graduatedSchool: string;
    /**
     * 卒業学校種別。
     */
    graduatedSchoolType: string;
    /**
     * 卒業年。
     */
    graduatedYear: string;
    /**
     * 勤務先。
     */
    jobCompany: string;
    /**
     * 勤務先役職。
     */
    jobPosition: string;
    /**
     * ソーシャルプロバイダ別プロフィールURL。
     */
    uri: string[] | undefined;
    /**
     * ホームページ。
     */
    website: string[] | undefined;
    /**
     * 好きな言葉。Facebook のみ。
     */
    quotes: string;
    /**
     * 自己紹介。
     */
    bio: string;
    /**
     * プロフィールアイコン URL。
     */
    imageUrl: string;
    /**
     * 最終更新日時。
     */
    lastUpdatedAt: Date | undefined;
    /**
     * 初回ログインからの日数。
     */
    updateCount: number | undefined;
}

export interface IEmail {
    /**
     * メールアドレス
     */
    email: string;
    /**
     * ソーシャルプロバイダ側で確認済みのアドレスなら true
     */
    verified: boolean;
    /**
     * どのソーシャルプロバイダから取得したか
     */
    mediaId: SocialLoginProvider;
}

export enum PhoneType {
    /**
     * 電話番号
     */
    Phone = 'phone',
    /**
     * FAX 番号
     */
    Fax = 'fax',
    /**
     * 携帯電話番号
     */
    Mobile = 'mobile'
}

export interface IPhone {
    /**
     * 電話番号。
     */
    // tslint:disable-next-line:no-reserved-keywords
    number: string;
    /**
     * 電話番号種別。
     */
    // tslint:disable-next-line:no-reserved-keywords
    type: PhoneType;
    /**
     * 常に true となります。
     */
    verified: boolean;
    /**
     * どのソーシャルプロバイダから取得したか。
     */
    mediaId: SocialLoginProvider;
}

export interface IFavorite {
    /**
     * カテゴリ
     */
    category: string;
    /**
     * 「お気に入り」の内容
     */
    name: string;
    /**
     * どのソーシャルプロバイダから取得したか
     */
    mediaId: SocialLoginProvider;
    /**
     * 「お気に入り」対象の種別。
     */
    itemType: FavoriteType;
}

export interface IProfileResult extends IResultCommon {
    user: IUser & {
        /**
         * 管理画面または delete_profile メソッドで個人情報の取得を禁止している場合に true。
         */
        profileProhibited: boolean;
    };
    profile: IProfile;
    follow: {
        /**
         * 被フォロー数
         */
        followedBy: number;
        /**
         * フォロー数
         */
        following: number;
    };
    email: IEmail[];
    phone: IPhone[];
}

export interface IMergeUserAPIIn {
    source_identifier?: string;
    source_primary_key?: string;
    dest_identifier?: string;
    dest_primary_key?: string;
    nomerge?: string;
}

export interface IMergeUserArgs {
    /**
     * 結合元のソーシャル PLUS ID。
     */
    sourceIdentifier?: string;
    /**
     * 結合元のお客様サイト側ユーザ ID。
     */
    sourcePrimaryKey?: string;
    /**
     * 結合先のソーシャル PLUS ID。
     */
    destIdentifier?: string;
    /**
     * 結合先のお客様サイト側ユーザ ID。
     */
    destPrimaryKey?: string;
    /**
     * true を指定した場合、処理後に個人情報を更新 しません。
     */
    nomerge?: string;
}

export type IMergeUserAPIOut = IResultCommon;
export type IMergeUserResult = IResultCommon;
