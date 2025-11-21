import { Injectable } from '@nestjs/common';
import { UserDataDto } from 'src/dto/user-data.dto';
import { InitializeData } from './dto/initialize-data.dto';

@Injectable()
export class InitializeService {
  async initialize(user: UserDataDto): Promise<InitializeData> {
    return {
      id: user.id,
      organization_name: user.organization_name,
      phone: user.phone,
      created_at: user.joined_at,
      is_admin: user.is_admin,
    };
  }
}
