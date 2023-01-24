import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ThemesEvents } from '~/shared/constants/event.constant';
import { ThemesServiceService } from './themes-service.service';

@Controller()
export class ThemesServiceController {
  constructor(private readonly themesServiceService: ThemesServiceService) {}

  // ===Microservice===
  @MessagePattern({ cmd: ThemesEvents.ThemesGetAll })
  getAllThemes() {
    return this.themesServiceService.getAllThemes();
  }

  @MessagePattern({ cmd: ThemesEvents.ThemeGetInfo })
  async getThemeInfo(data: { id: string }) {
    return await this.themesServiceService.getTheme(data.id);
  }

  @MessagePattern({ cmd: ThemesEvents.ThemeActiveByMaster })
  async activeTheme(data: { id: string }) {
    return await this.themesServiceService.activeTheme(data.id);
  }

  @MessagePattern({ cmd: ThemesEvents.ThemeDeleteByMaster })
  async deleteTheme(data: { id: string }) {
    return await this.themesServiceService.deleteTheme(data.id);
  }

  @MessagePattern({ cmd: ThemesEvents.ThemeGetConfig })
  async getThemeConfig(data: { id: string }) {
    return await this.themesServiceService.getThemeConfig(data.id);
  }

  @MessagePattern({ cmd: ThemesEvents.ThemeGetConfigItem })
  async getThemeConfigItem(data: { id: string; key: string }) {
    return await this.themesServiceService.getThemeConfigItem(
      data.id,
      data.key,
    );
  }

  @MessagePattern({ cmd: ThemesEvents.ThemeUpdateConfig })
  async updateThemeConfig(data: { id: string; config: string }) {
    return await this.themesServiceService.updateThemeConfig(
      data.id,
      data.config,
    );
  }

  @MessagePattern({ cmd: ThemesEvents.ThemeUpdateConfigItem })
  async updateThemeConfigItem(data: {
    id: string;
    key: string;
    value: string;
  }) {
    return await this.themesServiceService.updateThemeConfigItem(
      data.id,
      data.key,
      data.value,
    );
  }
}
