interface CurrentUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  mobile: string;
  role: string;
  tenant: string;
  permissions: string[];
}