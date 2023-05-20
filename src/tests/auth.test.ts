import supertest from "supertest";
import * as userService from "../service/user.service";
import express from "express";
import bodyParser from "body-parser";
import authRouter from "../router/auth.router";
import { v4 as uuidv4 } from "uuid";
import { User } from "../entity/User";

const app = express();
const id = uuidv4();

app.use(bodyParser.json());
app.use(authRouter);

const userPayload = {
  id: id,
  email: "7capa7@gmail.com",
  name: "7capa7",
};

const userInput = {
  email: "7capa7@gmail.com",
  name: "7capa7",
  password: "Password",
  passwordConfirmation: "Password",
};

const loginInput = {
  email: "7capa7@gmail.com",
  password: "Password",
};

const getUser = async (password: string): Promise<User> => {
  const user = new User();
  user.password = password;
  user.name = "7capa7";
  user.email = "7capa7@gmail.com";
  user.id = uuidv4();
  await user.encryptPassword();
  return user;
};

describe("auth", () => {
  describe("register", () => {
    describe("valid register data", () => {
      it("should return the userDto and a 201", async () => {
        const createUserServiceMock = jest
          .spyOn(userService, "createUser")
          // @ts-ignore
          .mockReturnValueOnce(userPayload);

        const { statusCode, body } = await supertest(app)
          .post("/api/register")
          .send(userInput);

        expect(statusCode).toBe(201);

        expect(body).toEqual(userPayload);

        expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
      });
    });

    describe("passwords do not match", () => {
      it("should return a 400", async () => {
        const createUserServiceMock = jest
          .spyOn(userService, "createUser")
          // @ts-ignore
          .mockReturnValueOnce(userPayload);

        const { statusCode } = await supertest(app)
          .post("/api/register")
          .send({ ...userInput, passwordConfirmation: "otherPassword" });

        expect(statusCode).toBe(400);

        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    });

    describe("email is not valid email", () => {
      it("should return a 400", async () => {
        const createUserServiceMock = jest
          .spyOn(userService, "createUser")
          // @ts-ignore
          .mockReturnValueOnce(userPayload);

        const { statusCode } = await supertest(app)
          .post("/api/register")
          .send({ ...userInput, email: "email" });

        expect(statusCode).toBe(400);

        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    });

    describe("name is blank", () => {
      it("should return a 400", async () => {
        const createUserServiceMock = jest
          .spyOn(userService, "createUser")
          // @ts-ignore
          .mockReturnValueOnce(userPayload);

        const { statusCode } = await supertest(app)
          .post("/api/register")
          .send({ ...userInput, name: "" });

        expect(statusCode).toBe(400);

        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    });

    describe("user already exists", () => {
      it("should return a 409", async () => {
        const createUserServiceMock = jest
          .spyOn(userService, "createUser")
          .mockRejectedValueOnce({ code: "23505" });

        const { statusCode } = await supertest(app)
          .post("/api/register")
          .send(userInput);

        expect(statusCode).toBe(409);

        expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
      });
    });
  });

  describe("login", () => {
    describe("valid login data", () => {
      it("should return token and a 200", async () => {
        const user = await getUser("Password");
        const findUserByEmailServiceMock = jest
          .spyOn(userService, "findUserByEmail")
          // @ts-ignore
          .mockReturnValueOnce(user);

        const { statusCode, body } = await supertest(app)
          .post("/api/login")
          .send(loginInput);

        expect(statusCode).toBe(200);
        expect(body.accessToken).toBeTruthy();
        expect(findUserByEmailServiceMock).toBeCalledWith("7capa7@gmail.com");
      });
    });

    describe("passwords do not match", () => {
      it("should return a 401", async () => {
        const user = await getUser("otherPassword");
        const findUserByEmailServiceMock = jest
          .spyOn(userService, "findUserByEmail")
          // @ts-ignore
          .mockReturnValueOnce(user);

        const { statusCode } = await supertest(app)
          .post("/api/login")
          .send(loginInput);

        expect(statusCode).toBe(401);
        expect(findUserByEmailServiceMock).toBeCalledWith("7capa7@gmail.com");
      });
    });

    describe("user with given email not found", () => {
      it("should return a 401", async () => {
        const findUserByEmailServiceMock = jest
          .spyOn(userService, "findUserByEmail")
          // @ts-ignore
          .mockReturnValueOnce(null);

        const { statusCode } = await supertest(app)
          .post("/api/login")
          .send(loginInput);

        expect(statusCode).toBe(401);
        expect(findUserByEmailServiceMock).toBeCalledWith("7capa7@gmail.com");
      });
    });

    describe("email not provided", () => {
      it("should return a 400", async () => {
        const findUserByEmailServiceMock = jest
          .spyOn(userService, "findUserByEmail")
          // @ts-ignore
          .mockReturnValueOnce(null);

        const { statusCode } = await supertest(app)
          .post("/api/login")
          .send({ ...loginInput, email: undefined });

        expect(statusCode).toBe(400);
        expect(findUserByEmailServiceMock).not.toBeCalled();
      });
    });

    describe("password not provided", () => {
      it("should return a 400", async () => {
        const findUserByEmailServiceMock = jest
          .spyOn(userService, "findUserByEmail")
          // @ts-ignore
          .mockReturnValueOnce(null);

        const { statusCode } = await supertest(app)
          .post("/api/login")
          .send({ ...loginInput, password: undefined });

        expect(statusCode).toBe(400);
        expect(findUserByEmailServiceMock).not.toBeCalled();
      });
    });
  });
});
