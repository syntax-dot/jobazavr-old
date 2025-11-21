import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { Citizenships } from "src/entities/citizenships.entity";
import { Users } from "src/entities/users.entity";
import { Repository } from "typeorm";
import * as appRoot from "app-root-path";
import * as fs from "fs";

@Injectable()
export class CreatedUsersExportToBitrixService {
	constructor(
		@InjectRepository(Users)
		private readonly usersRepository: Repository<Users>,

		@InjectRepository(Citizenships)
		private readonly citizenshipsRepository: Repository<Citizenships>,
	) {
		// this.handleCron();
	}

	async handleCron() {
		const registeredUsers = await this.usersRepository
			.createQueryBuilder("users")
			.select([
				"users.id as id",
				"users.name as name",
				"users.phone as phone",
				"users.age as age",
				"users.platform as platform",
				"users.citizenship_id as citizenship_id",
			])
			.where("users.phone IS NOT NULL")
			.getRawMany();

		let i = 0;
		for await (const user of registeredUsers) {
			i++;
			console.log(i, registeredUsers.length);

			try {
				const findCitizenship = await this.citizenshipsRepository
					.createQueryBuilder("citizenships")
					.select(["citizenships.title as title"])
					.where("citizenships.id = :id", { id: user.citizenship_id })
					.getRawOne();

				const bitrixKeys = JSON.parse(
					fs.readFileSync(`${appRoot}/bitrix_keys.json`).toString(),
				);

				await axios.post(
					`https://jobazavr.bitrix24.ru/rest/crm.lead.add.json`,
					{
						fields: {
							TITLE: `Регистрации в Jobazavr из ${
								user.platform === "vk"
									? "VK"
									: user.platform === "mob"
										? "мобильного приложения"
										: "Telegram"
							}`,
							NAME: user.name.split(" ")[0],
							LAST_NAME: user.name.split(" ")[1],
							PHONE: [{ VALUE: user.phone, VALUE_TYPE: "WORK" }],
							UF_CRM_1680506994031: user.age ? user.age : user.age,
							UF_CRM_1680506974494: findCitizenship?.title || "Не указано",
							SOURCE_ID: user.platform === "vk" ? "UC_3K265U" : "UC_GF3S7S",
							ASSIGNED_BY_ID: "1079",
							CREATED_BY_ID: "1079",
						},
					},
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${bitrixKeys.access_token}`,
						},
					},
				);
			} catch (e) {
				console.log(e);
			}

			// wait 1s
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}
}
