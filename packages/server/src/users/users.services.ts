import * as argon2 from 'argon2'

import { CreateUserDto } from './dto.types'
import { userDao, UserInfo } from './dao'

const createUser = async (userfields: CreateUserDto) => {
  return userDao.createUser(userfields)
}

const getUserByEmail = async (email: string) => {
  return userDao.getUserByEmail(email)
}

const getUserByEmailWithPassword = async (email: string) => {
  return userDao.getUserByEmailWithPassword(email)
}

const getUsers = async (args: { take?: number; skip?: number }) => {
  return userDao.getUsers(args)
}

const getUserById = async (id: string) => {
  return userDao.getUserById(id)
}

const updateUserInfo = async (id: string, info: UserInfo) => {
  return userDao.updateUser(id, info)
}

/**
 * Verify password
 * @param password password to verify
 * @param hash password hash
 * @returns boolean
 */
const verifyPassword = async (password: string, hash: string) => {
  if (!password || !hash) return false

  return await argon2.verify(hash, password)
}

export const usersServices = {
  createUser,
  getUserByEmail,
  getUserByEmailWithPassword,
  getUserById,
  getUsers,
  updateUserInfo,
  verifyPassword,
}
