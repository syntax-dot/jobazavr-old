import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/entities/users.entity";
import { Repository } from "typeorm";
import * as fs from "node:fs";

@Injectable()
export class UsersExportService {
	constructor(
		@InjectRepository(Users)
		private readonly usersRepository: Repository<Users>,
	) {}

	async handleCron() {
		const userIds = await this.usersRepository
			.createQueryBuilder("users")
			.select(["users.user_id as user_id"])
			.getRawMany();

		const ids = userIds.map((el) => el.user_id);

		fs.writeFileSync("./users.json", JSON.stringify(ids));
	}
}
