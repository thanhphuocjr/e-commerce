import { UserResponseDTO } from './userResponse.dto.js';

export class LoginResponseDTO {
  constructor(user, accessToken, refreshToken, expiresIn) {
    this.user = new UserResponseDTO(user);
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresIn = expiresIn;
  }
}
