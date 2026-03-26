export interface CreateTenant {
    identifier: string;
    name: string;
    connectionString: string;
    email: string;
    firstName: string;
    lastName: string;
    validUpTo: string;
    isActive: boolean;
}