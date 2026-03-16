interface LoginResponse {
    data: UserData;
    messages: string[] | any[];
    isSuccessful: boolean;
}

interface UserData {
    jwt: string;
    refreshToken: string;
    refreshTokenExpiryDate: Date | string;
}