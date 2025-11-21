import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Banners } from "src/entities/banners.entity";
import { Cities } from "src/entities/cities.entity";
import { Citizenships } from "src/entities/citizenships.entity";
import { JobsFavorites } from "src/entities/jobs-favorites.entity";
import { JobsResponses } from "src/entities/jobs-responses.entity";
import { Jobs } from "src/entities/jobs.entity";
import { Logos } from "src/entities/logos.entity";
import { JobsController } from "./jobs.controller";
import { JobsService } from "./jobs.service";
import { JobsViews } from "src/entities/jobs-views.entity";

@Module({
	controllers: [JobsController],
	providers: [JobsService],
	imports: [
		TypeOrmModule.forFeature([
			Jobs,
			Cities,
			Logos,
			Banners,
			JobsFavorites,
			JobsViews,
			Citizenships,
			JobsResponses,
		]),
	],
})
export class JobsModule {}
