import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';
import AppError from '../utils/AppError.js';
import { GET_DB } from '../config/mongodb.js';
import nodemailer from 'nodemailer';
import { env } from '../config/environment.js';
import * as userModel from '../models/mongodb/userModel.js';
import crypto from 'crypto';
import * as refreshTokenRepository from '../repositories/user/mongodb/refreshTokenRepository.js';
import { getUserRepository } from '../factories/userRepoFactory.js';
import { ProfileResponseDTO } from '../dto/users/profileResponseDto.js';
import { UserResponseDTO } from '../dto/users/userResponseDto.js';
import { UserListResponseDTO } from '../dto/users/userListResponseDto.js';

const userRepository = getUserRepository();

class UserService {
  async register(userData) {
    // eslint-disable-next-line no-useless-catch
    try {
      const { email, password, fullName } = userData;
      const existingUser = await userRepository.findOneByEmail(email);

      if (existingUser) {
        throw new Error('Email has already exists!');
      }

      const createdUser = await userRepository.createNew({
        email,
        password,
        fullName,
        role: 'user',
      });
      return createdUser;
    } catch (error) {
      throw new AppError(
        error.message || 'Register have some problems!',
        error.status || StatusCodes.UNPROCESSABLE_ENTITY,
        error,
      );
    }
  }

  //Login - chỉ xác thực user, trả về user info
  //Token sẽ được tạo ở Gateway
  async login(email, password) {
    try {
      const user = await userRepository.findOneByEmail(email);
      if (!user) throw new AppError('Account does not exists!', 401);

      if (user._destroy) throw new AppError('Account has been deleted!', 401);

      const isValidPassword = await userModel.comparePassword(
        password,
        user.password,
      );

      if (!isValidPassword) throw new AppError('Password is not correct!', 401);

      try {
        await userRepository.updateDataById(user._id, {
          lastLogin: Date.now(),
        });
      } catch (updateError) {
        console.log('Update lastLogin failed!', updateError);
      }

      const updateUser = await userRepository.setActiveStatus(user._id);

      // Chỉ trả về user info, Gateway sẽ xử lý token
      return new UserResponseDTO(updateUser);
    } catch (error) {
      console.log('Login error details: ', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Server error when logging in!', 500);
    }
  }

  //RefreshToken - Gateway sẽ gọi hàm này để tạo access token mới
  async validateRefreshToken(refreshToken) {
    try {
      if (!refreshToken) throw new AppError('Refresh token is required', 400);

      const tokenDoc = await refreshTokenRepository.findByToken(refreshToken);
      if (!tokenDoc) {
        throw new AppError('Invalid or expired refresh token', 401);
      }

      const user = await userRepository.findOneById(tokenDoc.userId);
      if (!user || user.status !== 'active') {
        await refreshTokenRepository.deleteByToken(refreshToken);
        throw new AppError('User not found or inactive', 401);
      }

      // Trả về user info, Gateway sẽ tạo access token mới
      return new UserResponseDTO(user);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        'Server error when validating refresh token!',
        500,
        error,
      );
    }
  }

  //Logout - xóa refresh token
  async logout(refreshToken) {
    try {
      if (refreshToken) {
        const tokenDoc = await refreshTokenRepository.findByToken(refreshToken);

        if (tokenDoc) {
          await userRepository.setInActiveStatus(tokenDoc.userId);
          await refreshTokenRepository.deleteByToken(refreshToken);
        }
      }

      return { message: 'Logged out Successfully!' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Server error when logging out', 500, error);
    }
  }

  //Logout All Devices
  async logoutAllDevices(userId) {
    try {
      await refreshTokenRepository.deleteByUserId(userId);
      await userRepository.setInActiveStatus(userId);
      return { message: 'Logged out from all devices successfully!' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Server error when logging out from all devices!');
    }
  }

  //Get profile DTO
  async getProfile(userId) {
    try {
      const user = await userRepository.findOneById(userId);
      if (!user) {
        throw new AppError('User not found', StatusCodes.NOT_FOUND);
      }
      return new ProfileResponseDTO(user);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Server error when get profile in', 500, error);
    }
  }

  //Change password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await userRepository.findOneById(userId);
      // console.log(user);
      if (!user) {
        throw new AppError('Khong tim thay user!', StatusCodes.NOT_FOUND);
      }

      const isValidPassword = await userModel.comparePassword(
        currentPassword,
        user.password,
      );
      if (!isValidPassword) {
        throw new AppError('Mat khau hien tai khong dung', 400);
      }
      await userRepository.updateDataById(user._id, { password: newPassword });
      return { message: 'Change password successfully!' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Loi server khi change password!');
    }
  }

  async getUsersList(queryParams) {
    try {
      console.log('QueryParams: ', queryParams);
      const users = await userRepository.findUsersWithFilters(queryParams);
      return UserListResponseDTO.fromRepo(users);
    } catch (error) {
      console.error('getUsers error: ', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Loi server khi Get list users!');
    }
  }

  //Admin create User
  async createUser(userData) {
    try {
      const existingUser = await userRepository.findOneByEmail(userData.email);
      if (existingUser) {
        throw new AppError('Email da duoc su dung', 400);
      }
      // return await userRepository.createNew(userData);
      const user = await userRepository.createNew(userData);
      return new UserResponseDTO(user);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Loi server khi Create new user!');
    }
  }

  //Admin Stats
  async getUserStats() {
    try {
      return userRepository.getStats();
    } catch (error) {
      throw new AppError('Server error while getting stats', 500, error);
    }
  }

  //Admin Get User DTO
  async getUserById(id) {
    try {
      const user = await userRepository.findOneById(id);
      return new UserResponseDTO(user);
    } catch (error) {
      throw new AppError('Server error while getting User', 500, error);
    }
  }
  //Admin Soft Delete
  async deleteUser(id) {
    try {
      const userId = await userRepository.findOneById(id);
      if (!userId) {
        throw new AppError('Không tìm thấy user', 404);
      }
      const user = await userRepository.softDelete(id);
      return new UserResponseDTO(user);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Server error while deleting User', 500, error);
    }
  }
  async permanentDeleteUser(id) {
    try {
      const userId = await userRepository.findOneById(id);
      if (!userId) {
        throw new AppError('User is not exist!', 404);
      }
      return await userRepository.permanentDelete(id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Server error while deleting User!', 500, error);
    }
  }

  //Admin Update
  async updateUser(id, updateData) {
    try {
      const userId = await userRepository.findOneById(id);
      if (!userId) throw new AppError('Khong tim thay ID trong Database!', 404);

      // return userRepository.updateDataById(id, updateData);
      const updateUser = await userRepository.updateDataById(id, updateData);
      return new UserResponseDTO(updateUser);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Loi server khi Update user!');
    }
  }

  async restoreUser(id) {
    try {
      const user = await userRepository.findOneById(id);
      if (!user) {
        throw new AppError('Không tìm thấy user', 404);
      }

      if (!user._destroy) {
        throw new AppError('User chưa bị xóa, không cần khôi phục', 400);
      }

      return await userRepository.restoreUser(id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Server error while restoring user', 500, error);
    }
  }
  async forgotPassword(email) {
    const user = await userRepository.findOneByEmail(email);
    if (!user) throw new AppError('Can not find email!', 404);

    const { token } = await userRepository.setResetPasswordToken(email);

    // Gửi email (ví dụ dùng Gmail SMTP)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: env.EMAIL_USER,
      to: email,
      subject: 'Đặt lại mật khẩu',
      html: `<p>Click here to reset your password on Spotify_Web:</p> <hr/> <br/> Link: <a href="${resetLink}">${resetLink}</a>`,
    });

    return { message: 'Sended link reset password to your email!' };
  }

  async resetPassword(token, newPassword) {
    const user = await userRepository.findByResetToken(token);
    if (!user) throw new AppError('Token không hợp lệ hoặc đã hết hạn', 400);

    await userRepository.updateDataById(user._id, { password: newPassword });
    await userRepository.clearResetToken(user._id);

    return { message: 'Successfully reset password!' };
  }
}
export default new UserService();
