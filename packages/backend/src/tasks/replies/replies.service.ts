import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JobsResponses } from "src/entities/jobs-responses.entity";
import getCurrentTimestamp from "src/utils/getCurrentTimestamp.utils";
import { Repository } from "typeorm";
import * as xl from "excel4node";
import * as fs from "node:fs";
import { Cron } from "@nestjs/schedule";
import * as nodemailer from "nodemailer";

@Injectable()
export class RepliesService {
	constructor(
		@InjectRepository(JobsResponses)
		private readonly jobsResponsesRepository: Repository<JobsResponses>,
	) {}

	@Cron("0 */4 * * *")
	async handleCron() {
		const replies = await this.jobsResponsesRepository
			.createQueryBuilder("jobs_responses")
			.select([
				"jobs_responses.id as id",
				"jobs.address as address",
				"jobs.title as title",
				"jobs.description as description",
				"users.name as name",
				"users.phone as phone",
				"users.age as age",
				"users.platform as platform",
				"users.user_id as user_id",
			])
			.innerJoin("jobs_responses.job_id", "jobs")
			.innerJoin("jobs_responses.created_by", "users")
			.where("jobs_responses.created_at > :created_at", {
				created_at: getCurrentTimestamp() - 3600 * 4,
			})
			.getRawMany();

		if (!replies.length) return true;

		const wb = new xl.Workbook();

		const ws = wb.addWorksheet("Выгрузка из админ-панели");

		const style = wb.createStyle({
			font: {
				color: "#000000",
				size: 14,
				bold: true,
				center: true,
			},
			numberFormat: "$#,##0.00; ($#,##0.00); -",
		});

		const defaultStyle = wb.createStyle({
			font: {
				color: "#000000",
				size: 12,
			},
			numberFormat: "$#,##0.00; ($#,##0.00); -",
		});

		ws.cell(1, 1).string("ID").style(style);
		ws.cell(1, 2).string("Компания").style(style);
		ws.cell(1, 3).string("Вакансия").style(style);
		ws.cell(1, 4).string("Адрес").style(style);
		ws.cell(1, 5).string("Ссылка на страницу").style(style);
		ws.cell(1, 6).string("Имя фамилия").style(style);
		ws.cell(1, 7).string("Возраст").style(style);
		ws.cell(1, 8).string("Телефон").style(style);

		let key = 1;

		for await (const el of replies) {
			ws.cell(key + 1, 1)
				.string(String(el.id))
				.style(defaultStyle);
			ws.cell(key + 1, 2)
				.string(el.title)
				.style(defaultStyle);
			ws.cell(key + 1, 3)
				.string(el.description)
				.style(defaultStyle);
			ws.cell(key + 1, 4)
				.string(el.address)
				.style(defaultStyle);
			ws.cell(key + 1, 5)
				.string(
					el.platform === "vk"
						? `vk.com/id${el.user_id}`
						: el.platform === "tg"
							? `web.telegram.org/k/#${el.user_id}`
							: "",
				)
				.style(defaultStyle);
			ws.cell(key + 1, 6)
				.string(el.name)
				.style(defaultStyle);
			ws.cell(key + 1, 7)
				.string(String(el.age))
				.style(defaultStyle);
			ws.cell(key + 1, 8)
				.string(el.phone)
				.style(defaultStyle);

			key++;
		}

		const time = `${new Date(
			(getCurrentTimestamp() - 3600 * 4) * 1000,
		).toLocaleString("ru-RU", {
			timeZone: "Europe/Moscow",
			minute: "numeric",
			hour: "numeric",
		})} - ${new Date(getCurrentTimestamp() * 1000).toLocaleString("ru-RU", {
			timeZone: "Europe/Moscow",
			minute: "numeric",
			hour: "numeric",
		})}`;

		await wb.write(`${process.env.PWD}/static/${time}.xlsx`);

		let retries = 0;
		while (!fs.existsSync(`${process.env.PWD}/static/${time}.xlsx`)) {
			if (retries > 50) return true;

			await new Promise((resolve) => setTimeout(resolve, 2000));

			retries++;
		}

		const transporter = nodemailer.createTransport({
			host: "smtp.mail.ru",
			port: 587,
			auth: {
				user: process.env.MAIL_RU_MAIL,
				pass: process.env.MAIL_RU_PASSWORD,
			},
		});

		const mailOptions = {
			from: process.env.MAIL_RU_MAIL,
			to: process.env.MAIL_RU_MAIL,
			subject: `Выгрузка откликов за последние 4 часа (${time})`,
			text: `Выгрузка откликов за последние 4 часа (${time}).\n\nНовых откликов: ${replies.length}`,
			attachments: [
				{
					filename: "Выгрузка.xlsx",
					content: fs.createReadStream(
						`${process.env.PWD}/static/${time}.xlsx`,
					),
				},
			],
		};

		transporter.sendMail(mailOptions, (error) => {
			if (error) console.log(error);
		});

		try {
			fs.unlinkSync(`${process.env.PWD}/static/replies_auto.xlsx`);
		} catch {}

		return true;
	}
}
