interface LoginResponse {
    jwt: string;
    refreshToken: string;
    refreshTokenExpiryDate: Date | string;
}