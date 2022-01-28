export type User = {
  id: string;
  email: string;
  roles: UserRole[];
  id_providers: string[];
  status: UserStatus | '';
};

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
