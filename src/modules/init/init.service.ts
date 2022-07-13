import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigsService } from '../configs/configs.service';
import { UserService } from '../user/user.service';

@Injectable()
export class InitService {
  private logger = new Logger(InitService.name)
  constructor(
    private readonly configs: ConfigsService,
    private readonly userService: UserService,
  ) {}

  async canInit() {
    const configs = await this.configs.getAllConfigs()
    const user = await this.userService.hasMaster()
    console.log(configs)
    // 没有用户，不应当初始化
    if (!user) {
      this.logger.warn('用户未注册，无法初始化')
      return false
    } else if (configs.length === 0) {
      return true
    } else if (configs.length) {
      this.logger.warn('配置已存在，无法初始化')
      return false
    }
    throw new BadRequestException('发生未知错误，无法初始化')
    return false
  }
}
