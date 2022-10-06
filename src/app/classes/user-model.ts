import { Role } from './role-enum';

export class User {

  id: number = 0
  name: string = ""
  accessToken: string = ""
  createTime: string = ""
  password: string = ""
  role: Role = Role.USER
  refreshToken: string = ""
  username: string = ""
  activeBoosters: number = 3
}
