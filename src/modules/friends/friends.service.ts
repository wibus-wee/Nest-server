import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Friends } from "../../shared/entities/friends.entity";
import { CreateFriendsDto } from "../../shared/dto/create-friends-dto";
import { GHttp } from "../../../helper/helper.http.service";
import { delObjXss } from "utils/xss.util";
import rssParser from "utils/rss.utils";

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friends)
    private friendsRepository: Repository<Friends>,
    private readonly http: GHttp
  ) {}

  async create(data: CreateFriendsDto, ismaster: boolean) {
    data = delObjXss(data);
    if (data.image == null) {
      data.image = "";
    }
    if (data.check != null) {
      data.check = 0;
    }
    if (data.owner == null) {
      data.owner = 0;
    }
    if (ismaster) {
      data.check = 1;
    }
    if (await this.friendsRepository.findOne({ name: data.name })) {
      throw new HttpException("已存在这位朋友啦", HttpStatus.BAD_REQUEST);
    }
    return await this.friendsRepository.save(data);
  }

  // 修改友链
  async update(id, data) {
    data = delObjXss(data);
    // console.log(data.check)
    return await this.friendsRepository.update(id, data);
  }

  async list(query: any) {
    switch (query.type) {
    case "all":
      return await this.friendsRepository.find({
        order: {
          id: query.order === 'ASC' ? 'ASC' : 'DESC',
        },
        where: {
          check: 1,
        }
      });
    case 'true-all':
      return await this.friendsRepository.find({
        order: {
          id: query.order === 'ASC' ? 'ASC' : 'DESC',
        },
      });
    case "limit":
      let page = query.page
      if (page < 1 || isNaN(page)) {
        page = 1;
      }
      const limit = query.limit || 10;
      const skip = (page - 1) * limit;
      return await this.friendsRepository.find({
        skip: skip,
        take: limit,
        order: {
          id: query.order === 'ASC' ? 'ASC' : 'DESC',
        },
      });
    case "num":
      return await this.friendsRepository.count();
    case "uncheck":
      return await this.friendsRepository.find({
        where: {
          check: 0,
        }
      });
    case "uncheck_num":
      return await this.friendsRepository.count({
        check: 0,
      });
    default:
      return await this.friendsRepository.find({
        order: {
          id: query.order === 'ASC' ? 'ASC' : 'DESC',
        },
        where: {
          check: 1,
        }
      });
    }
  }

  async spider(url: string) {
    // const FriendData = await this.friendsRepository.findOne(id);
    const rssContent = await this.http.axiosRef
      .get(url, {
        timeout: 5000,
        'axios-retry': {
          retries: 1,
          shouldResetTimeout: true,
        },
      })
      .then((res) => {
        return res.data
      })
    return rssParser(rssContent);
  }

  async check(id: number) {}

  // 删除友链
  async delete(id: number) {
    return await this.friendsRepository.delete(id);
  }
}
