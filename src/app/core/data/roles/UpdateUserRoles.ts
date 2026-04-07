interface UpdateUserRoles {
    userRoles: UserRolesRequest[];
}

interface UserRolesRequest {
    roleId: string;
    name: string;
    description: string;
    isAssigned: boolean;
}