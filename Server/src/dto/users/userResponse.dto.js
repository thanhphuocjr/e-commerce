export class UserResponseDTO {
  constructor(user) {
    this.id = user._id?.toString();
    this.email = user.email;
    this.fullName = user.fullName;
    this.role = user.role;
    this.status = user.status;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
