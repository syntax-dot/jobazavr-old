import axios from "axios";
import * as firebaseAdmin from "firebase-admin";
import { Devices } from "src/entities/devices.entity";
import { Repository } from "typeorm";

const sendPushNotifications = async (
	repository: Repository<Devices> | null,
	platform: "vk" | "tg" | "external",
	user_ids: number[] | string[],
	title: string,
	content: string | null,
): Promise<boolean> => {
	if (platform === "vk") {
		for (let i = 0; i < user_ids.length / 100; i++) {
			const sliced = user_ids.slice(i * 100, (i + 1) * 100);

			await axios.get(
				`https://api.vk.com/method/notifications.sendMessage?user_ids=${sliced.join(
					",",
				)}&message=${title}&v=5.131&access_token=${process.env.APP_TOKEN}`,
			);
		}
	} else if (platform === "tg") {
		// biome-ignore lint/complexity/noForEach: <explanation>
		user_ids.forEach(async (user_id) => {
			await axios.get(
				`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_KEY}/sendMessage?chat_id=${user_id}&text=${title}`,
			);
		});
	} else {
		const devices = await repository
			.createQueryBuilder("devices")
			.select(["devices.token as token"])
			.where("devices.created_by IN (:...user_ids)", { user_ids })
			.getRawMany();

		if (!devices.length) return true;

		const tokens = devices.map((device) => device.token);

		for (let i = 0; i < tokens.length / 500; i++) {
			const sliced = tokens.slice(i * 500, (i + 1) * 500);

			const message = {
				notification: {
					title,
					body: content,
				},
				tokens: sliced,
			};

			try {
				await firebaseAdmin.messaging().sendMulticast(message);
			} catch (e) {
				console.log(e);
			}
		}
	}

	return true;
};

export default sendPushNotifications;
