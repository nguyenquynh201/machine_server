declare type ENV_TYPE = 'development' | 'staging' | 'production';
export const NODE_ENV: ENV_TYPE = (process.env.NODE_ENV || 'development') as ENV_TYPE;

export const JwtConstants = {
    secret: process.env.SECRET_TOKEN || 'thisisprivate',
    accessTokenExpire: '120m',
    refreshTokenExpire: '100d',
    refresh_token_regen: 7 * 24 * 60 * 60, // 7 days in seconds
};