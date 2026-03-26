import { ApiResponse } from "../ApiResponse";

export interface TenantResponse extends ApiResponse<TenantResponse> {
    identifier: string;
    name: string;
    connectionString: string | null;
    email: string;
    firstName: string;
    lastName: string;
    validUpTo: string; // ISO-8601 timestamp
    isActive: boolean;
}
  