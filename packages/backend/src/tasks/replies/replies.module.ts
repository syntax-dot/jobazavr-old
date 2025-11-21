import { Module } from "@nestjs/common";
import { RepliesService } from "./replies.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JobsResponses } from "src/entities/jobs-responses.entity";

@Module({
	providers: [RepliesService],
	imports: [TypeOrmModule.forFeature([JobsResponses])],
})
export class RepliesModule {}
