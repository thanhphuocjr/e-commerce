function maskEmail(email) {
  const [name, domain] = email.split('@');
  if (name.length <= 2) return `***@${domain}`;
  return name[0] + '***' + name.slice(-1) + '@' + domain;
}
export class ProfileResponseDTO {
  constructor(user) {
    this.id = user.id?.toString();
    this.email = maskEmail(user.email);
    this.fullName = user.fullName;
    this.role = user.role;
    this.status = user.status;
    this.lastLogin = user.lastLogin;
    this.createdAt = user.createdAt;
  }
}
