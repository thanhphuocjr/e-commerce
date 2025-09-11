import { UserResponseDTO } from './userResponse.dto.js';


export class UserListResponseDTO {
  constructor({ data, pagination }) {
    this.data = data.map((u) => new UserResponseDTO(u));
    this.pagination = pagination;
  }

  static fromRepo(usersFromRepo) {
    return new UserListResponseDTO({
      data: usersFromRepo.users,
      pagination: usersFromRepo.pagination,
    });
  }
}
