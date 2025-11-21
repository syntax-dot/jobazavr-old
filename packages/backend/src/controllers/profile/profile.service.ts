import { InjectRedis } from "@liaoliaots/nestjs-redis";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Redis from "ioredis";
import { UserDataDto } from "src/dto/user-data.dto";
import { Citizenships } from "src/entities/citizenships.entity";
import { Users } from "src/entities/users.entity";
import Errors from "src/errors.enum";
import errorGenerator from "src/utils/errorGenerator.utils";
import { Repository } from "typeorm";
import { InitializeData } from "../initialize/dto/initialize-data.dto";
import { ProfilePatchBody } from "./dto/profile-body.dto";
import { Cities } from "src/entities/cities.entity";
import { AuthTokens } from "src/entities/auth-tokens.entity";
import { JobsResponses } from "src/entities/jobs-responses.entity";
import { JobsFavorites } from "src/entities/jobs-favorites.entity";
import { Events } from "src/entities/events.entity";
import { Uploads } from "src/entities/uploads.entity";
import axios from "axios";
import * as fs from "fs";
import * as appRoot from "app-root-path";

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(Users)
		private readonly usersRepository: Repository<Users>,

		@InjectRepository(Citizenships)
		private readonly citizenshipsRepository: Repository<Citizenships>,

		@InjectRepository(Cities)
		private readonly citiesRepository: Repository<Cities>,

		@InjectRepository(Events)
		private readonly eventsRepository: Repository<Events>,

		@InjectRepository(Uploads)
		private readonly uploadsRepository: Repository<Uploads>,

		@InjectRepository(AuthTokens)
		private readonly authTokensRepository: Repository<AuthTokens>,

		@InjectRepository(JobsResponses)
		private readonly jobsResponsesRepository: Repository<JobsResponses>,

		@InjectRepository(JobsFavorites)
		private readonly jobsFavoritesRepository: Repository<JobsFavorites>,

		@InjectRedis()
		private readonly redis: Redis,
	) {}

	async getProfile(user: UserDataDto): Promise<InitializeData> {
		let citizenship = null;

		if (user.citizenship_id)
			citizenship = await this.citizenshipsRepository
				.createQueryBuilder("citizenships")
				.select(["citizenships.id as id", "citizenships.title as title"])
				.where("citizenships.id = :id", { id: user.citizenship_id })
				.getRawOne();

		let city = null;

		if (user.city_id)
			city = await this.citiesRepository
				.createQueryBuilder("cities")
				.select([
					"cities.id as id",
					"cities.title as title",
					"cities.latitude as latitude",
					"cities.longitude as longitude",
				])
				.where("cities.id = :id", { id: user.city_id })
				.getRawOne();

		return {
			name: user.name,
			phone: user.phone,
			sex: user.sex,
			city,
			age: user.age,
			is_admin: user.is_admin,
			onboarding: +user.onboarding === 1,
			notifications: user.platform === "vk" ? user.notifications : undefined,
			first_training: +user.first_training === 1,
			citizenship,
		};
	}

	async updateProfile(
		user: UserDataDto,
		body: ProfilePatchBody,
	): Promise<boolean> {
		if (body.onboarding || body.first_training)
			errorGenerator(Errors.BAD_REQUEST);

		if (body.citizenship_id) {
			const citizenship = await this.citizenshipsRepository
				.createQueryBuilder("citizenships")
				.select(["citizenships.id as id", "citizenships.title as title"])
				.where("citizenships.id = :id", { id: body.citizenship_id })
				.getRawOne();

			if (!citizenship) errorGenerator(Errors.CITIZENSHIP_NOT_FOUND);
		}

		if (body.city_id) {
			const findCity = await this.citiesRepository
				.createQueryBuilder("cities")
				.select(["cities.id as id"])
				.where("cities.id = :id", { id: body.city_id })
				.getRawOne();

			if (!findCity) errorGenerator(Errors.CITY_NOT_FOUND);
		}

		if (body.notifications) {
			const notifications = await axios.get(
				`https://api.vk.com/method/apps.isNotificationsAllowed?user_id=${user.user_id}&access_token=${process.env.APP_TOKEN}&v=5.201`,
			);

			if (!notifications.data.response.is_allowed)
				errorGenerator(Errors.NOTIFICATIONS_DISABLED);
		}

		if (Object.keys(body)) {
			await this.usersRepository
				.createQueryBuilder()
				.update(Users)
				.set(body)
				.where("id = :id", { id: user.id })
				.execute();

			if (!user.phone && body.phone) {
				let findCitizenship;

				if (body.citizenship_id)
					findCitizenship = await this.citizenshipsRepository
						.createQueryBuilder("citizenships")
						.select(["citizenships.title as title"])
						.where("citizenships.id = :id", { id: body.citizenship_id })
						.getRawOne();

				try {
					const bitrixKeys = JSON.parse(
						fs.readFileSync(`${appRoot}/bitrix_keys.json`).toString(),
					);

					await axios.post(
						`https://jobazavr.bitrix24.ru/rest/crm.lead.add.json`,
						{
							fields: {
								TITLE: `Регистрации в приложении из ${
									user.platform === "vk"
										? "VK"
										: user.platform === "mob"
											? "мобильного приложения"
											: "Telegram"
								}`,
								NAME: (user.name ? user.name : body.name).split(" ")[0],
								LAST_NAME: (user.name ? user.name : body.name).split(" ")[1],
								PHONE: [{ VALUE: body.phone, VALUE_TYPE: "WORK" }],
								UF_CRM_1680506994031: user.age ? user.age : body.age,
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
			}

			await this.redis.del(
				`jobazavr_user:${
					user.platform === "mob" ? "external" : user.platform
				}:${user.platform === "mob" ? user.id : user.user_id}`,
			);
		} else {
			errorGenerator(Errors.BAD_REQUEST);
		}

		return true;
	}

	async deleteProfile(user: UserDataDto): Promise<boolean> {
		await this.authTokensRepository
			.createQueryBuilder()
			.delete()
			.from(AuthTokens)
			.where("created_by = :id", { id: user.id })
			.execute();

		await this.jobsResponsesRepository
			.createQueryBuilder()
			.delete()
			.from(JobsResponses)
			.where("created_by = :id", { id: user.id })
			.execute();

		await this.eventsRepository
			.createQueryBuilder()
			.delete()
			.from(Events)
			.where("created_by = :id", { id: user.id })
			.execute();

		await this.jobsFavoritesRepository
			.createQueryBuilder()
			.delete()
			.from(JobsFavorites)
			.where("created_by = :id", { id: user.id })
			.execute();

		await this.uploadsRepository
			.createQueryBuilder()
			.delete()
			.from(Uploads)
			.where("uploaded_by = :id", { id: user.id })
			.execute();

		await this.usersRepository
			.createQueryBuilder()
			.delete()
			.from(Users)
			.where("id = :id", { id: user.id })
			.execute();

		await this.redis.del(
			`jobazavr_user:${user.platform === "mob" ? "external" : user.platform}:${
				user.platform === "mob" ? user.id : user.user_id
			}`,
		);

		return true;
	}
}
