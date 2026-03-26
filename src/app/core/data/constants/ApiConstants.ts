export const BASE_URL = "https://localhost:7114/api/";

export const LOGIN = BASE_URL + "Token/login"

export const UPDATE_USER = BASE_URL + "Users/update"
export const RESET_PASSWORD = BASE_URL + 'Users/change-password'

export const COUNTRIES_API = "https://restcountries.com/v3.1/all?fields=name,idd,flags";

//Tenant API
export const ADD_TENANT = BASE_URL + "Tenants/add";
export const ACTIVATE_TENANT = BASE_URL + "Tenants/{tenantId}/activate";
export const DEACTIVATE_TENANT = BASE_URL + "Tenants/{tenantId}/deactivate";
export const UPGRADE_TENANT = BASE_URL + "Tenants/upgrade";
export const GET_TENANT_BY_ID = BASE_URL + "Tenants/{tenantId}";
export const GET_TENANTS = BASE_URL + "Tenants/all";
