export interface UpdatePassword {
    userId: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}