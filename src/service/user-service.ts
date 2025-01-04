import {
	type RegisterUserRequest,
	toUserResponse,
	type UserResponse,
} from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { prismaClient } from "../config/database";
import { HTTPException } from "hono/http-exception";
import { log } from "../config/logger";

export class UserService {
	static async register(request: RegisterUserRequest): Promise<UserResponse> {
		log.info("Registering user", request);

		request = UserValidation.REGISTER.parse(request);

		const totalUserWithSameUsername = await prismaClient.user.count({
			where: {
				username: request.username,
			},
		});

		if (totalUserWithSameUsername != 0) {
			throw new HTTPException(400, {
				message: "Username already exists",
			});
		}

		request.password = await Bun.password.hash(request.password, {
			algorithm: "bcrypt",
			cost: 10,
		});

		const user = await prismaClient.user.create({
			data: request,
		});

		return toUserResponse(user);
	}
}
