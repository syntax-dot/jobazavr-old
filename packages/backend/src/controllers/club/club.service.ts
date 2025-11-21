import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDataDto } from "src/dto/user-data.dto";
import { ClubForms } from "src/entities/club-forms.entity";
import { Repository } from "typeorm";
import * as appRoot from "app-root-path";
import errorGenerator from "src/utils/errorGenerator.utils";
import Errors from "src/errors.enum";
import getCurrentTimestamp from "src/utils/getCurrentTimestamp.utils";
import { ClubData } from "./dto/club-data.dto";
import { ClubPostBody } from "./dto/club-body.dto";
import * as createTemplate from "passbook";
import * as fs from "fs";
import { createCanvas, loadImage, registerFont } from "canvas";
import { Citizenships } from "src/entities/citizenships.entity";
import axios from "axios";

@Injectable()
export class ClubService {
	constructor(
		@InjectRepository(ClubForms)
		private readonly clubFormsRepository: Repository<ClubForms>,

		@InjectRepository(Citizenships)
		private readonly citizenshipsRepository: Repository<Citizenships>,
	) {}

	async getClubCard(user: UserDataDto): Promise<ClubData> {
		const clubCard = await this.clubFormsRepository
			.createQueryBuilder("club_forms")
			.select(["club_forms.id as id", "club_forms.created_at as created_at"])
			.andWhere("club_forms.created_by = :user_id", { user_id: user.id })
			.getRawOne();

		if (!clubCard) errorGenerator(Errors.NOT_FOUND);

		return {
			id: clubCard.id,
			name: user.name ? user.name : "Пользователь Jobazavr",
			expires_at: clubCard.created_at + 365 * 24 * 3600,
		};
	}

	async getPkpass(user: UserDataDto): Promise<string> {
		const clubCard = await this.clubFormsRepository
			.createQueryBuilder("club_forms")
			.select(["club_forms.id as id", "club_forms.created_at as created_at"])
			.andWhere("club_forms.created_by = :user_id", { user_id: user.id })
			.getRawOne();

		if (!clubCard) errorGenerator(Errors.NOT_FOUND);

		const date_finish = clubCard.created_at * 1000 + 365 * 24 * 3600 * 1000;
		const date_start = clubCard.created_at * 1000;

		const template = createTemplate("coupon", {
			passTypeIdentifier: "pass.com.jbclub.passbook",
			teamIdentifier: "H4DNS4NY2Z",
			foregroundColor: "rgb(255, 255, 255)",
			backgroundColor: "rgb(28, 71, 82)",
			labelColor: "rgb(255, 255, 255)",
			organizationName: "JOBAZAVR",
			barcode: {
				message: `${clubCard.id}`,
				format: "PKBarcodeFormatQR",
				messageEncoding: "iso-8859-1",
				altText: `${clubCard.id}`,
			},
		});

		template.keys("./passkeys-static/keys", "kokateam");
		template.loadImagesFrom(`./passkeys-static/images`);

		const name = user.name ? user.name : "Пользователь Jobazavr";

		const pass = template.createPass({
			serialNumber: `${clubCard.id}`,
			description: "JBClub coupon",
		});

		pass.secondaryFields.add({
			key: "owner",
			label: "ВЛАДЕЛЕЦ СЕРТИФИКАТА",
			value: name,
		});
		pass.secondaryFields.add({
			key: "expires",
			label: "ИСТЕКАЕТ",
			value: `${new Date(date_finish).toLocaleString("ru", {
				month: "numeric",
				day: "numeric",
				year: "numeric",
			})}`,
		});

		pass.backFields.add({
			key: "owner_back",
			label: "Владелец",
			value: name,
		});

		pass.backFields.add({
			key: "id_back",
			label: "Номер сертификата",
			value: `${clubCard.id}`,
		});

		pass.backFields.add({
			key: "started_back",
			label: "Выдан",
			value: `${new Date(date_start).toLocaleString("ru", {
				month: "numeric",
				day: "numeric",
				year: "numeric",
			})}`,
		});

		pass.backFields.add({
			key: "expires_back",
			label: "Действует до",
			value: `${new Date(date_finish).toLocaleString("ru", {
				month: "numeric",
				day: "numeric",
				year: "numeric",
			})}`,
		});

		const writeToLocalDisk = () => {
			return new Promise<void>((resolve) => {
				const file = fs.createWriteStream(`${user.id}.pkpass`);
				pass.on("error", function (error) {
					console.error(error);
					process.exit(1);
				});
				pass.pipe(file);

				file.on("finish", () => {
					resolve();
				});
			});
		};

		await writeToLocalDisk();

		const base64 = fs.readFileSync(`${user.id}.pkpass`, {
			encoding: "base64",
		});

		fs.unlinkSync(`${user.id}.pkpass`);

		return base64;
	}

	async getImage(user: UserDataDto): Promise<string> {
		const clubCard = await this.clubFormsRepository
			.createQueryBuilder("club_forms")
			.select(["club_forms.id as id", "club_forms.created_at as created_at"])
			.andWhere("club_forms.created_by = :user_id", { user_id: user.id })
			.getRawOne();

		if (!clubCard) errorGenerator(Errors.NOT_FOUND);

		const name = user.name ? user.name : "Пользователь Jobazavr";

		const date_finish = clubCard.created_at * 1000 + 365 * 24 * 3600 * 1000;

		const template = await loadImage(
			`${appRoot}/club-source-static/template.png`,
		);

		registerFont(`${appRoot}/club-source-static/montserrat400.ttf`, {
			family: "Montserrat400",
		});

		registerFont(`${appRoot}/club-source-static/montserrat600.ttf`, {
			family: "Montserrat600",
		});

		const canvas = createCanvas(template.width, template.height),
			ctx = canvas.getContext("2d");

		ctx.drawImage(template, 0, 0);

		ctx.font = `134px 'Montserrat600'`;
		ctx.fillStyle = "#ffffff";

		ctx.fillText(name, 291, 1880);
		ctx.fillText(
			`${new Date(date_finish).toLocaleString("ru", {
				month: "numeric",
				day: "numeric",
				year: "numeric",
			})}`,
			1990,
			1880,
		);

		ctx.font = `116px 'Montserrat400'`;

		ctx.textAlign = "center";
		ctx.fillText(clubCard.id, 2800, 975);

		const buffer = canvas.toBuffer("image/png");

		return buffer.toString("base64");
	}

	async createClubCardByForm(
		user: UserDataDto,
		body: ClubPostBody,
	): Promise<ClubData> {
		const isExists = await this.clubFormsRepository
			.createQueryBuilder("club_forms")
			.select(["club_forms.id as id", "club_forms.created_at as created_at"])
			.andWhere("club_forms.created_by = :user_id", { user_id: user.id })
			.getRawOne();

		const name = user.name ? user.name : "Пользователь Jobazavr";

		if (isExists) {
			return {
				id: isExists.id,
				name,
				expires_at: isExists.created_at + 365 * 24 * 3600,
			};
		}

		const time = getCurrentTimestamp();

		const insert = await this.clubFormsRepository
			.createQueryBuilder("club_forms")
			.insert()
			.values({
				created_by: user.id,
				phone: user.phone,
				email: body.email,
				created_at: time,
			})
			.execute();

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
						TITLE: `Регистрации в Jobazavr Club из ${
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

		return {
			id: insert.identifiers[0].id,
			name,
			expires_at: time + 365 * 24 * 3600,
		};
	}

	async deleteClubCard(user: UserDataDto): Promise<boolean> {
		const findClubCard = await this.clubFormsRepository
			.createQueryBuilder("club_forms")
			.select(["club_forms.id as id"])
			.where("club_forms.created_by = :user_id", { user_id: user.id })
			.getRawOne();

		if (!findClubCard) errorGenerator(Errors.NOT_FOUND);

		await this.clubFormsRepository
			.createQueryBuilder("club_forms")
			.delete()
			.where("club_forms.id = :id", { id: findClubCard.id })
			.execute();

		return true;
	}
}
