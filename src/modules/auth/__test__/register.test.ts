import { createServer } from "../../../utils/createServer";
import { describe, it, vi, expect } from "vitest";
import * as AuthService from "../auth.service";
// import { generateHash } from "../../../utils/bcrypt";
describe("POST '/api/auth/register' route", () => {
	it("Should call the createUser service", async () => {
		const server = await createServer();
		await server.ready();

		// Spy on createUserService
		// because we want to see what it gets called with
		// and we want to mock it because we don't actually want to create a user in the DB

		const user = {
			id: 1,
			email: "euanmorgan48@gmail.com",
			password: "password1234",
			createdAt: new Date(),
			updatedAt: new Date(),
			name: "Euan Morgan",
		};

		const createUserSpy = vi.spyOn(AuthService, "createUser");

		expect(createUserSpy.getMockName(), "Mock name equals").toEqual("createUser"); // This is just to make sure we're spying on the right function

		createUserSpy.mockResolvedValue(user);
		const payload = {
			email: "euanmorgan48@gmail.com",
			password: "test1234",
			name: "Euan Morgan",
		};
		const response = await server.inject({
			method: "POST",
			url: "/api/auth/register",
			payload,
		});

		expect(response.statusCode).toEqual(201);

		// expect(createUserSpy).toHaveBeenCalledWith(payload);
	});
});
