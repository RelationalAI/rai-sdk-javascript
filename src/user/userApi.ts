import { Base } from '../base';
import { User, UserRole, UserStatus } from './types';

const ENDPOINT = 'users';

type ListReponse = { users: User[] };
type SingleReponse = { user: User };
type DeleteResponse = {
  user_id: string;
  message: string;
};

export class UserApi extends Base {
  async createUser(email: string, roles: UserRole[]) {
    const result = await this.post<SingleReponse>(ENDPOINT, {
      body: {
        email,
        roles,
      },
    });

    return result.user;
  }

  async listUsers() {
    const result = await this.get<ListReponse>(ENDPOINT);

    return result.users;
  }

  async getUser(userId: string) {
    const result = await this.get<SingleReponse>(`${ENDPOINT}/${userId}`);

    return result.user;
  }

  async updateUser(userId: string, status?: UserStatus, roles?: UserRole[]) {
    const body: any = {};

    if (status) {
      body.status = status;
    }

    if (roles && roles.length) {
      body.roles = roles;
    }

    const result = await this.patch<SingleReponse>(`${ENDPOINT}/${userId}`, {
      body,
    });

    return result.user;
  }

  async enableUser(userId: string) {
    return await this.updateUser(userId, UserStatus.ACTIVE);
  }

  async disableUser(userId: string) {
    return await this.updateUser(userId, UserStatus.INACTIVE);
  }

  async deleteUser(userId: string) {
    const result = await this.delete<DeleteResponse>(
      `${ENDPOINT}/${userId}`,
      {},
    );

    return result;
  }
}
