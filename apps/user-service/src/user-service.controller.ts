import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { IpRecord } from '~/shared/common/decorator/ip.decorator';
import { UserEvents } from '~/shared/constants/event.constant';
import { UserService } from './user-service.service';
import { LoginDto, UserDto, UserPatchDto } from './user.dto';
import { UserDocument, UserModel } from './user.model';

@Controller()
export class UserServiceController {
  constructor(private readonly userService: UserService) {}

  @EventPattern(UserEvents.UserGet)
  handleUserGet(username: string, getLoginIp: boolean) {
    return this.userService.getUserByUsername(username, getLoginIp);
  }

  // @EventPattern(UserEvents.UserCheck)
  // handleUserCheckLogged() {}

  @EventPattern(UserEvents.UserRegister)
  handleUserRegister(user: UserDto) {
    user.nickname = user.nickname ?? user.username;
    return this.userService.register(user as UserModel);
  }

  @EventPattern(UserEvents.UserPatch)
  handleUserPatch(user: UserDocument, data: UserPatchDto) {
    return this.userService.patchUserData(user, data);
  }

  @EventPattern(UserEvents.UserLogout)
  handleUserLogout(token: string) {
    return this.userService.signout(token);
  }

  @EventPattern(UserEvents.UserLogoutAll)
  handleUserLogoutAll() {
    return this.userService.signoutAll();
  }

  @EventPattern(UserEvents.UserGetAllSession)
  handleUserGetAllSession(token: string) {
    return this.userService.getAllSignSession(token);
  }

  @EventPattern(UserEvents.UserLogin)
  async handleUserLogin(dto: LoginDto, ipLocation: IpRecord) {
    return this.userService.login(dto, ipLocation);
  }
}
