import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Citizenships } from 'src/entities/citizenships.entity';
import { Users } from 'src/entities/users.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Cities } from 'src/entities/cities.entity';
import { JobsResponses } from 'src/entities/jobs-responses.entity';
import { AuthTokens } from 'src/entities/auth-tokens.entity';
import { JobsFavorites } from 'src/entities/jobs-favorites.entity';
import { Events } from 'src/entities/events.entity';
import { Uploads } from 'src/entities/uploads.entity';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [
    TypeOrmModule.forFeature([
      Users,
      JobsResponses,
      AuthTokens,
      JobsFavorites,
      Citizenships,
      Uploads,
      Events,
      Cities,
    ]),
  ],
})
export class ProfileModule {}
