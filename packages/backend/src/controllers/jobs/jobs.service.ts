import { InjectRedis } from "@liaoliaots/nestjs-redis";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Redis from "ioredis";
import { UserDataDto } from "src/dto/user-data.dto";
import { Banners } from "src/entities/banners.entity";
import { Cities } from "src/entities/cities.entity";
import { Citizenships } from "src/entities/citizenships.entity";
import { JobsFavorites } from "src/entities/jobs-favorites.entity";
import { JobsResponses } from "src/entities/jobs-responses.entity";
import { Jobs } from "src/entities/jobs.entity";
import { Logos } from "src/entities/logos.entity";
import Errors from "src/errors.enum";
import errorGenerator from "src/utils/errorGenerator.utils";
import getCurrentTimestamp from "src/utils/getCurrentTimestamp.utils";
import replyToEmployer from "src/utils/replyToEmployer.utils";
import { Repository } from "typeorm";
import { EmployersData, JobsData } from "./dto/jobs-data.dto";
import {
	JobsFiltersDataQueryDto,
	JobsQueryDto,
	JobsQueryGetDto,
} from "./dto/jobs-query.dto";
import axios from "axios";
import * as fs from "fs";
import * as appRoot from "app-root-path";
import { JobsViews } from "src/entities/jobs-views.entity";

@Injectable()
export class JobsService {
	constructor(
		@InjectRepository(Jobs)
		private readonly jobsRepository: Repository<Jobs>,

		@InjectRepository(Cities)
		private readonly citiesRepository: Repository<Cities>,

		@InjectRepository(JobsResponses)
		private readonly jobsResponsesRepository: Repository<JobsResponses>,

		@InjectRepository(Citizenships)
		private readonly citizenshipsRepository: Repository<Citizenships>,

		@InjectRepository(Banners)
		private readonly bannersRepository: Repository<Banners>,

		@InjectRepository(Logos)
		private readonly logosRepository: Repository<Logos>,

		@InjectRepository(JobsViews)
		private readonly jobsViewsRepository: Repository<JobsViews>,

		@InjectRepository(JobsFavorites)
		private readonly jobsFavoritesRepository: Repository<JobsFavorites>,

		@InjectRedis() private readonly redis: Redis,
	) {}

	async getEmployersAndVacancies(
		query: JobsFiltersDataQueryDto,
	): Promise<EmployersData> {
		if (query?.city_id) {
			const findCity = await this.citiesRepository
				.createQueryBuilder("cities")
				.select(["cities.id as id"])
				.where("cities.id = :id", { id: query.city_id })
				.getRawOne();

			if (!findCity) errorGenerator(Errors.CITY_NOT_FOUND);
		}

		if (query?.employer) {
			const findEmployer = await this.jobsRepository
				.createQueryBuilder("jobs")
				.select(["jobs.title as title"])
				.where("jobs.title = :title", { title: query.employer })
				.getRawOne();

			if (!findEmployer) errorGenerator(Errors.NOT_FOUND);
		}

		let employers = [];

		if (!query?.employer)
			employers = await this.jobsRepository
				.createQueryBuilder("jobs")
				.select(["DISTINCT title as title"])
				.where(
					`jobs.city_id ${query?.city_id ? `= ${query?.city_id}` : "<> 0"}`,
				)
				.andWhere(
					`jobs.description ${
						query?.vacancy ? `= '${query?.vacancy}'` : "!= ''"
					}`,
				)
				.orderBy("jobs.title", "ASC")
				.getRawMany();

		const vacancies = await this.jobsRepository
			.createQueryBuilder("jobs")
			.select(["DISTINCT description as description"])
			.where("description NOT LIKE :empty", { empty: "% - %" })
			.andWhere("description != :description", { description: "Не указано" })
			.andWhere(
				`jobs.city_id ${query?.city_id ? `= ${query?.city_id}` : "<> 0"}`,
			)
			.andWhere(
				`jobs.title ${query?.employer ? `= '${query?.employer}'` : "!= ''"}`,
			)
			.andWhere(
				`jobs.description ${
					query?.vacancy ? `= '${query?.vacancy}'` : "!= ''"
				}`,
			)
			.orderBy("jobs.description", "ASC")
			.getRawMany();

		let allAvailableCities = undefined;

		if (query?.employer || query?.vacancy)
			allAvailableCities = await this.jobsRepository
				.createQueryBuilder("jobs")
				.select(["DISTINCT city_id as city_id"])
				.where(
					`jobs.title ${query?.employer ? `= '${query?.employer}'` : "!= ''"}`,
				)
				.andWhere(
					`jobs.description ${
						query?.vacancy ? `= '${query?.vacancy}'` : "<> ''"
					}`,
				)
				.getRawMany();

		return {
			employers: query?.employer
				? undefined
				: employers.map((el) => {
						return el.title;
					}),
			vacancies: vacancies.map((el) => {
				return el.description;
			}),
			cities:
				query?.employer || query?.vacancy
					? allAvailableCities.map((el) => {
							return el.city_id;
						})
					: undefined,
		};
	}

	async getFavorites(
		user: UserDataDto,
		query: JobsQueryGetDto,
	): Promise<JobsData[]> {
		if (!Object?.keys(query)) {
			const cached = await this.redis.get(`favorites:${user.user_id}`);

			if (cached) return JSON.parse(cached);
		}

		if (!user?.id) errorGenerator(Errors.BAD_REQUEST);

		const favoriteIds = await this.jobsFavoritesRepository
			.createQueryBuilder("jobs_favorites")
			.select(["jobs_favorites.job_id as id"])
			.where("jobs_favorites.created_by = :id", { id: user.id })
			.getRawMany();

		if (!favoriteIds.length) return [];

		const allLogos = await this.logosRepository
			.createQueryBuilder("logos")
			.select(["logos.title as title", "logos.path as path"])
			.getRawMany();

		const allBanners = await this.bannersRepository
			.createQueryBuilder("banners")
			.select(["banners.title as title", "banners.path as path"])
			.getRawMany();

		const replies = await this.jobsResponsesRepository
			.createQueryBuilder("jobs_responses")
			.select(["jobs_responses.job_id as job_id"])
			.where("jobs_responses.created_by = :id", { id: user.id })
			.orderBy("jobs_responses.created_at", "DESC")
			.getRawMany();

		const repliesIds = replies.map((reply) => reply.job_id);

		const jobs = await this.jobsRepository
			.createQueryBuilder("jobs")
			.select([
				"jobs.id as id",
				"jobs.title as title",
				"jobs.description as description",
				"jobs.address as address",
				"jobs.salary as salary",
				"jobs.latitude as latitude",
				"jobs.longitude as longitude",
				"jobs.terms as terms",
			])
			.where("jobs.id IN (:...ids)", {
				ids: [0, ...repliesIds, ...favoriteIds.map((favorite) => favorite.id)],
			})
			.andWhere(
				"(LOWER(jobs.title) LIKE :title AND LOWER(jobs.description) LIKE :description)",
				{
					title: query?.employer ? `%${query.employer || ""}%` : "%",
					description: query?.vacancy ? `%${query.vacancy || ""}%` : "%",
				},
			)
			.getRawMany();

		jobs.forEach((job) => {
			job.avatar = allLogos.find((logo) =>
				job.title.toLowerCase().includes(logo.title.toLowerCase()),
			)?.path;
			job.banner = allBanners.find((banner) =>
				job.description.toLowerCase().includes(banner.title.toLowerCase()),
			)?.path;
			job.replied = repliesIds.includes(job.id);
		});

		if (!Object?.keys(query))
			await this.redis.set(
				`favorites:${user.user_id}`,
				JSON.stringify(jobs),
				"EX",
				300,
			);

		return jobs;
	}

	async getJobsById(id: number): Promise<JobsData> {
		const job = await this.jobsRepository
			.createQueryBuilder("jobs")
			.select([
				"jobs.id as id",
				"jobs.title as title",
				"jobs.description as description",
				"jobs.address as address",
				"jobs.salary as salary",
				"jobs.latitude as latitude",
				"jobs.longitude as longitude",
				"jobs.terms as terms",
			])
			.where("jobs.id = :id", { id })
			.getRawOne();

		if (!job) errorGenerator(Errors.NOT_FOUND);

		return job;
	}

	async view(id: number): Promise<boolean> {
		const job = await this.jobsRepository
			.createQueryBuilder("jobs")
			.select(["jobs.id as id"])
			.where("jobs.id = :id", { id })
			.getRawOne();

		if (!job) errorGenerator(Errors.NOT_FOUND);

		await this.jobsViewsRepository
			.createQueryBuilder("jobs_views")
			.insert()
			.values({
				job_id: id,
				viewed_at: getCurrentTimestamp(),
			})
			.execute();

		return job;
	}

	async getJobsByCity(id: number, query: JobsQueryGetDto): Promise<JobsData[]> {
		if (query?.salary_to < query?.salary_from)
			errorGenerator(Errors.BAD_REQUEST);

		const findCity = await this.citiesRepository
			.createQueryBuilder("cities")
			.where("cities.id = :id", { id })
			.getRawOne();

		if (!findCity) errorGenerator(Errors.CITY_NOT_FOUND);

		const allLogos = await this.logosRepository
			.createQueryBuilder("logos")
			.select(["logos.title as title", "logos.path as path"])
			.getRawMany();

		const allBanners = await this.bannersRepository
			.createQueryBuilder("banners")
			.select(["banners.title as title", "banners.path as path"])
			.getRawMany();

		let jobs = await this.jobsRepository
			.createQueryBuilder("jobs")
			.select([
				"jobs.id as id",
				"jobs.title as title",
				"jobs.description as description",
				"jobs.address as address",
				"jobs.salary as salary",
				"jobs.latitude as latitude",
				"jobs.longitude as longitude",
				"jobs.terms as terms",
			])
			.where("jobs.city_id = :id", { id })
			.andWhere(
				"(LOWER(jobs.title) LIKE :title AND LOWER(jobs.description) LIKE :description)",
				{
					title: query?.employer ? `%${query.employer || ""}%` : "%",
					description: query?.vacancy ? `%${query.vacancy || ""}%` : "%",
				},
			)
			.limit(query.limit || 25)
			.offset(query.offset || 0)
			.getRawMany();

		if (query?.salary_from || query?.salary_to) {
			jobs = jobs.filter((job) => {
				const salary = job.salary.replace(/[^0-9-]+/g, "").split("-");

				const salaryFrom = Number(salary[0]);
				const salaryTo = Number(salary?.[1] || salary[0]);

				if (query?.salary_from && query?.salary_to) {
					if (salaryFrom >= query.salary_from && salaryTo <= query.salary_to)
						return job;
				} else if (query?.salary_from) {
					if (salaryFrom >= query.salary_from) return job;
				} else if (query?.salary_to) {
					if (salaryTo <= query.salary_to) return job;
				}
			});
		}

		jobs.forEach((job) => {
			job.avatar = allLogos.find((logo) =>
				job.title.toLowerCase().includes(logo.title.toLowerCase()),
			)?.path;
			job.banner = allBanners.find((banner) =>
				job.description.toLowerCase().includes(banner.title.toLowerCase()),
			)?.path;
		});

		return jobs;
	}

	async getJobs(query: JobsQueryDto): Promise<JobsData[]> {
		if (query?.salary_to < query?.salary_from)
			errorGenerator(Errors.BAD_REQUEST);

		if (!Object?.keys(query)) {
			const cached = await this.redis.get(`jobs:${JSON.stringify(query)}`);

			if (cached) return JSON.parse(cached);
		}

		if (query?.city_id) {
			const findCity = await this.citiesRepository
				.createQueryBuilder("cities")
				.select(["cities.id as id"])
				.where("cities.id = :id", { id: query.city_id })
				.getRawOne();

			if (!findCity) errorGenerator(Errors.CITY_NOT_FOUND);
		}

		const allLogos = await this.logosRepository
			.createQueryBuilder("logos")
			.select(["logos.title as title", "logos.path as path"])
			.getRawMany();

		const allBanners = await this.bannersRepository
			.createQueryBuilder("banners")
			.select(["banners.title as title", "banners.path as path"])
			.getRawMany();

		let jobs = await this.jobsRepository
			.createQueryBuilder("jobs")
			.select([
				"jobs.id as id",
				"jobs.title as title",
				"jobs.description as description",
				"jobs.address as address",
				"jobs.salary as salary",
				"jobs.city_id as city_id",
				"jobs.latitude as latitude",
				"jobs.longitude as longitude",
				"jobs.terms as terms",
			])
			.where(
				"jobs.latitude BETWEEN :latitudeMin AND :latitudeMax AND jobs.longitude BETWEEN :longitudeMin AND :longitudeMax",
				{
					latitudeMin: query.latitude - query.radius,
					latitudeMax: query.latitude + query.radius,
					longitudeMin: query.longitude - query.radius,
					longitudeMax: query.longitude + query.radius,
				},
			)
			.andWhere(
				"(LOWER(jobs.title) LIKE :title AND LOWER(jobs.description) LIKE :description)",
				{
					title: query?.employer ? `%${query.employer || ""}%` : "%",
					description: query?.vacancy ? `%${query.vacancy || ""}%` : "%",
				},
			)
			.andWhere(
				`jobs.city_id ${query?.city_id ? `= ${query?.city_id}` : "<> 0"}`,
			)
			.orderBy(
				"SQRT(POW(jobs.latitude - :latitude, 2) + POW(jobs.longitude - :longitude, 2))",
				"ASC",
			)
			.limit(query.limit || 100)
			.offset(query.offset || 0)
			.setParameters({
				latitude: query.latitude,
				longitude: query.longitude,
			})
			.getRawMany();

		if (query?.salary_from || query?.salary_to) {
			jobs = jobs.filter((job) => {
				const salary = job.salary.replace(/[^0-9-]+/g, "").split("-");

				const salaryFrom = Number(salary[0]);
				const salaryTo = Number(salary?.[1] || salary[0]);

				if (query?.salary_from && query?.salary_to) {
					if (salaryFrom >= query.salary_from && salaryTo <= query.salary_to)
						return job;
				} else if (query?.salary_from) {
					if (salaryFrom >= query.salary_from) return job;
				} else if (query?.salary_to) {
					if (salaryTo <= query.salary_to) return job;
				}
			});
		}

		jobs.forEach((job) => {
			job.avatar = allLogos.find((logo) =>
				job.title.toLowerCase().includes(logo.title.toLowerCase()),
			)?.path;
			job.banner = allBanners.find((banner) =>
				job.description.toLowerCase().includes(banner.title.toLowerCase()),
			)?.path;
		});

		if (!Object?.keys(query))
			await this.redis.set(
				`jobs:${JSON.stringify(query)}`,
				JSON.stringify(jobs),
				"EX",
				300,
			);

		return jobs;
	}

	async replyOnJob(id: number, user: UserDataDto): Promise<boolean> {
		if (!user.phone || !user.name) errorGenerator(Errors.ACCESS_DENIED);

		const findJob = await this.jobsRepository
			.createQueryBuilder("jobs")
			.select([
				"jobs.id as id",
				"jobs.description as description",
				"jobs.address as address",
				"jobs.title as title",
			])
			.where("jobs.id = :id", { id })
			.getRawOne();

		if (!findJob) errorGenerator(Errors.JOB_NOT_FOUND);

		await this.jobsResponsesRepository
			.createQueryBuilder("jobs_responses")
			.insert()
			.values({
				job_id: id,
				created_by: user.id,
				created_at: getCurrentTimestamp(),
			})
			.execute();

		const findCitizenship = await this.citizenshipsRepository
			.createQueryBuilder("citizenships")
			.select(["citizenships.title as title"])
			.where("citizenships.id = :id", { id: user.citizenship_id })
			.getRawOne();

		const findCity = await this.citiesRepository
			.createQueryBuilder("cities")
			.select(["cities.title as title"])
			.where("cities.id = :id", { id: user.city_id })
			.getRawOne();

		await replyToEmployer(
			`Новый отклик на вакансию «${findJob.description}» из ${
				user.platform === "vk"
					? "VK"
					: user.platform === "mob"
						? "мобильного приложения"
						: "Telegram"
			} в ${findJob.title.trim()} по адресу ${
				findJob.address
			}!\n\nОтправитель: ${user.name}\nВозраст: ${user.age}\nТелефон: ${
				user.phone
			}\nГражданство: ${findCitizenship?.title || "Не указано"}\n\n${
				user.platform === "vk" ? `vk.com/id${user.user_id}` : ``
			}`,
		);

		const bitrixKeys = JSON.parse(
			fs.readFileSync(`${appRoot}/bitrix_keys.json`).toString(),
		);

		await axios.post(
			`https://jobazavr.bitrix24.ru/rest/crm.lead.add.json`,
			{
				fields: {
					TITLE: `Отклик из ${
						user.platform === "vk"
							? "VK"
							: user.platform === "mob"
								? "мобильного приложения"
								: "Telegram"
					}`,
					NAME: user.name.split(" ")[0],
					LAST_NAME: user.name.split(" ")[1],
					PHONE: [{ VALUE: user.phone, VALUE_TYPE: "WORK" }],
					UF_CRM_1680515254966: findCity?.title || "Не указано",
					UF_CRM_1680506994031: user.age,
					UF_CRM_1680506974494: findCitizenship?.title || "Не указано",
					SOURCE_ID: user.platform === "vk" ? "UC_3K265U" : "UC_GF3S7S",
					COMPANY_TITLE: findJob.title,
					ASSIGNED_BY_ID: "1079",
					CREATED_BY_ID: "1079",
					POST: findJob.description,
					ADDRESS: findJob.address,
				},
			},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${bitrixKeys.access_token}`,
				},
			},
		);

		await this.jobsFavoritesRepository
			.createQueryBuilder("jobs_favorites")
			.delete()
			.where("job_id = :id", { id })
			.andWhere("created_by = :user_id", { user_id: user.id })
			.execute();

		await this.redis.del(`favorites:${user.user_id}`);

		return true;
	}

	async removeFromFavorites(user: UserDataDto, id: number): Promise<boolean> {
		const findJob = await this.jobsRepository
			.createQueryBuilder("jobs")
			.where("jobs.id = :id", { id })
			.getRawOne();

		if (!findJob) errorGenerator(Errors.JOB_NOT_FOUND);

		const findFavorite = await this.jobsFavoritesRepository
			.createQueryBuilder("jobs_favorites")
			.where("jobs_favorites.created_by = :id", { id: user.id })
			.andWhere("jobs_favorites.job_id = :jobId", { jobId: id })
			.getRawOne();

		if (!findFavorite) errorGenerator(Errors.NOT_FOUND);

		await this.jobsFavoritesRepository
			.createQueryBuilder("jobs_favorites")
			.delete()
			.where("jobs_favorites.created_by = :id", { id: user.id })
			.andWhere("jobs_favorites.job_id = :jobId", { jobId: id })
			.execute();

		await this.redis.del(`favorites:${user.user_id}`);

		return true;
	}

	async addToFavorites(user: UserDataDto, id: number): Promise<boolean> {
		const findJob = await this.jobsRepository
			.createQueryBuilder("jobs")
			.where("jobs.id = :id", { id })
			.getRawOne();

		if (!findJob) errorGenerator(Errors.JOB_NOT_FOUND);

		const findFavorite = await this.jobsFavoritesRepository
			.createQueryBuilder("jobs_favorites")
			.where("jobs_favorites.created_by = :id", { id: user.id })
			.andWhere("jobs_favorites.job_id = :jobId", { jobId: id })
			.getRawOne();

		if (findFavorite) errorGenerator(Errors.ALREADY_EXISTS);

		await this.jobsFavoritesRepository
			.createQueryBuilder("jobs_favorites")
			.insert()
			.values({
				created_by: user.id,
				job_id: id,
				created_at: getCurrentTimestamp(),
			})
			.execute();

		await this.redis.del(`favorites:${user.user_id}`);

		return true;
	}
}
