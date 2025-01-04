import { prismaClient } from "../src/config/database";

export class UserTest {
	static async create() {
		await prismaClient.user.create({
			data: {
				username: "test",
				name: "test",
				email: "test@gmail.com",
				password: await Bun.password.hash("test", {
					algorithm: "bcrypt",
					cost: 10,
				}),
				token: "test",
			},
		});
	}

	static async delete() {
		await prismaClient.user.deleteMany({
			where: {
				username: "test",
			},
		});
	}
}
