import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import * as fs from "node:fs";
import * as appRoot from "app-root-path";
import axios from "axios";
import * as FormData from "form-data";

@Injectable()
export class TokenRefreshService {
	@Cron("*/30 * * * *")
	async handleCron() {
		const bitrixKeys = JSON.parse(
			fs.readFileSync(`${appRoot}/bitrix_keys.json`).toString(),
		);

		const form = new FormData();

		form.append("grant_type", "refresh_token");
		form.append("client_id", process.env.BITRIX_APP_ID);
		form.append("client_secret", process.env.BITRIX_APP_SECRET);
		form.append("refresh_token", bitrixKeys.refresh_token);
		form.append("redirect_uri", process.env.BITRIX_REDIRECT_URI);

		const newToken = await axios.post(
			"https://jobazavr.bitrix24.ru/oauth/token/",
			form,
		);

		const newJson = {
			expires_in: newToken.data.expires,
			access_token: newToken.data.access_token,
			refresh_token: newToken.data.refresh_token,
		};

		fs.writeFileSync(`${appRoot}/bitrix_keys.json`, JSON.stringify(newJson));
	}
}
