export const SMTP_CONFIG = {
    HOST: "smtp.gmail.com",
    USER: "nguyenquynhqb98@gmail.com",
    PASS: "gmhmqlpkuvfeekqu",
    PORT: "587",
    SECURE: false,
    FROM: "noreply@gmail.com",
}
declare type ENV_TYPE = 'development' | 'staging' | 'production';
export const NODE_ENV: ENV_TYPE = (process.env.NODE_ENV || 'development') as ENV_TYPE;

export const JwtConstants = {
    secret: process.env.SECRET_TOKEN || 'thisisprivate',
    accessTokenExpire: '120m',
    refreshTokenExpire: '100d',
    refresh_token_regen: 7 * 24 * 60 * 60, // 7 days in seconds
};
export const CONFIRM_EMAIL_URL = process.env.CONFIRM_EMAIL_URL || 'http://localhost:3000/auth/confirm_email'

export const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS || '/app/firebase-key.json';