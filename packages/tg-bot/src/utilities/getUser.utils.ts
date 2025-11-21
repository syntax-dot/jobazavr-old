import { Users } from "../entities/users.entity";
import getCurrentTimestamp from "./getCurrentTimestamp.utils";
import { UserData } from "src/intefaces/user-data.interface";
import { GetUserParams } from "src/intefaces/get-user-params.interface";

const getUser = async ({
  ctx,
  usersRepository,
}: GetUserParams): Promise<UserData> => {
  const user_id = ctx.from.id;

  let user = await usersRepository
    .createQueryBuilder("users")
    .select(["*"])
    .where("users.user_id = :user_id", { user_id })
    .getRawOne();

  if (!user) {
    user = {
      user_id,
      name: `${ctx.from.first_name}`,
      platform: "tg",
      joined_at: getCurrentTimestamp(),
    };

    const insertAction = await usersRepository
      .createQueryBuilder()
      .insert()
      .into(Users)
      .values(user)
      .execute();

    user.id = insertAction.identifiers[0].id;
  }

  return user;
};

export default getUser;
