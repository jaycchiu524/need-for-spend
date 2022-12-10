import { CreateUserDto } from './dto.types'
import { userDao } from './dao'

const createUser = async (userfields: CreateUserDto) => {
  return userDao.createUser(userfields)
}

const getUserByEmail = async (email: string) => {
  return userDao.getUserByEmail(email)
}

const getUsers = async (args: { take?: number; skip?: number }) => {
  return userDao.getUsers(args)
}

export const userServices = {
  createUser,
  getUserByEmail,
  getUsers,
}
