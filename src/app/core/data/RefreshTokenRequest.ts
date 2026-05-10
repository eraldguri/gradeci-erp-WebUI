export interface RefreshTokenRequest {
    currentJwt: string;
    currentRefreshToken: string;
    refreshTokenExpiryDate: string;
}