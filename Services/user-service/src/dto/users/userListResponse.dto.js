import { UserResponseDTO } from './userResponse.dto.js';

export class UserListResponseDTO {
  constructor({ list, pagination }) {
    this.list = list.map((u) => new UserResponseDTO(u));
    this.pagination = pagination;
  }

  static fromRepo(usersFromRepo) {
    return new UserListResponseDTO({
      list: usersFromRepo.users,
      pagination: usersFromRepo.pagination,
    });
  }
}
