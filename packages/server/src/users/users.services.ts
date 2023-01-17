import { CreateUserDto } from './dto.types'
import { userDao, UserInfo } from './dao'

const createUser = async (userfields: CreateUserDto) => {
  return userDao.createUser(userfields)
}

const getUserByEmail = async (email: string) => {
  return userDao.getUserByEmail(email)
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

export const usersServices = {
  createUser,
  getUserByEmail,
  getUserById,
  getUsers,
  updateUserInfo,
}
