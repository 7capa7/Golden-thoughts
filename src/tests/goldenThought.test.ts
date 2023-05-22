import express from "express";
import { v4 as uuidv4 } from "uuid";
import { User } from "../entity/User";
import bodyParser from "body-parser";
import supertest from "supertest";
import goldeThoughtRouter from "../router/goldenThought.router";
import * as goldenThoughtService from "../service/goldeThought.service";
import Role from "../utils/Role";
import { GoldenThought } from "../entity/GoldenThought";
import * as userService from "../service/user.service";
import * as jwtService from "../utils/jwt";

const app = express();
app.use(bodyParser.json());
app.use(goldeThoughtRouter);

const jwtToken =
  "example-token-19237g127391bp-1203u913b7912b31";

const getUser = async (): Promise<User> => {
  const user = new User();
  user.password = "password";
  user.name = "7capa7";
  user.email = "7capa7@gmail.com";
  user.id = uuidv4();
  user.role = Role.ADMIN;
  await user.encryptPassword();
  return user;
};

const getGoldenThought = (user: User, isDone: boolean): GoldenThought => {
  const goldenThought = new GoldenThought();
  goldenThought.id = uuidv4();
  goldenThought.user = user;
  goldenThought.isDone = isDone;
  goldenThought.value = "golden thought";
  return goldenThought;
};

const mockFindUserById = (user: User) => {
  return (
    jest
      .spyOn(userService, "findUserById")
      //@ts-ignore
      .mockReturnValueOnce(user)
  );
};

const mockDecodeJwt = () => {
  return (
    jest
    .spyOn(jwtService, "verifyJwt")
    //@ts-ignore
    .mockReturnValueOnce({id:"id"})
  );
}

describe("golden thought", () => {
  describe("create golden thought", () => {
    describe("valid golden thought data and anonymous = false", () => {
      it("should return goldenThoughtDto and a 201", async () => {
        const user = await getUser();
        const goldenthought = getGoldenThought(user, false);

        const GoldenThoughtServiceMock = jest
          .spyOn(goldenThoughtService, "createGoldenThought")
          // @ts-ignore
          .mockReturnValueOnce(goldenthought);

        mockFindUserById(user);
        mockDecodeJwt();

        const { statusCode, body } = await supertest(app)
          .post("/api/auth/golden-thought")
          .set("authorization", jwtToken)
          .query({ anonymous: "false" })
          .send({
            value: "golden thought",
          });

        expect(statusCode).toBe(201);
        expect(body.user).toEqual(goldenthought.user.name);
        expect(GoldenThoughtServiceMock).toHaveBeenCalled();
      });
    });

    describe("valid golden thought data and anonymous = true", () => {
      it("should return goldenThoughtDto with user 'anonymous' and a 201", async () => {
        const user = await getUser();
        const goldenthought = getGoldenThought(user, false);

        const GoldenThoughtServiceMock = jest
          .spyOn(goldenThoughtService, "createGoldenThought")
          // @ts-ignore
          .mockReturnValueOnce({ ...goldenthought, user: null });

        mockFindUserById(user);
        mockDecodeJwt();

        const { statusCode, body } = await supertest(app)
          .post("/api/auth/golden-thought")
          .set("authorization", jwtToken)
          .query({ anonymous: "true" })
          .send({
            value: "golden thought",
          });

        expect(statusCode).toBe(201);
        expect(body.user).toEqual("Anonymous");
        expect(GoldenThoughtServiceMock).toHaveBeenCalled();
      });
    });
  });
  describe("get golden thoughts", () => {
    describe("unDoneOnly = false", () => {
      it("should return all golden thoughts and a 200", async () => {
        const user = await getUser();
        const goldenthought = getGoldenThought(user, false);

        const getAllGoldenThoughtServiceMock = jest
          .spyOn(goldenThoughtService, "getAllGoldenThoughts")
          .mockReturnValueOnce(
            // @ts-ignore
            Array.of(goldenthought, goldenthought, goldenthought)
          );

        mockFindUserById(user);
        mockDecodeJwt();

        const { statusCode, body } = await supertest(app)
          .get("/api/auth/golden-thoughts")
          .set("authorization", jwtToken)
          .query({ unDoneOnly: "false" })
          .send();
        expect(statusCode).toBe(200);
        expect(body).toHaveLength(3);
        expect(getAllGoldenThoughtServiceMock).toHaveBeenCalled();
      });
    });
    describe("unDoneOnly = true", () => {
      it("should return undone only golden thoughts and a 200", async () => {
        const user = await getUser();
        const goldenthought = getGoldenThought(user, true);

        const getUnDoneGoldenThoughtServiceMock = jest
          .spyOn(goldenThoughtService, "getUnDoneGoldenThoughts")
          .mockReturnValueOnce(
            // @ts-ignore
            Array.of(goldenthought, goldenthought)
          );

        mockFindUserById(user);
        mockDecodeJwt();

        const { statusCode, body } = await supertest(app)
          .get("/api/auth/golden-thoughts")
          .set("authorization", jwtToken)
          .query({ unDoneOnly: "true" })
          .send();
        expect(statusCode).toBe(200);
        expect(body).toHaveLength(2);
        expect(getUnDoneGoldenThoughtServiceMock).toHaveBeenCalled();
      });
    });
  });
  describe("get golden thought by id", () => {
    describe("id is valid and golden thought exists", () => {
      it("should return golden thought dto and a 200", async () => {
        const user = await getUser();
        const goldenthought = getGoldenThought(user, false);

        const getGoldenThoughtByIdServiceMock = jest
          .spyOn(goldenThoughtService, "getGoldenThoughtById")
          //@ts-ignore
          .mockReturnValueOnce(goldenthought);

        mockFindUserById(user);
        mockDecodeJwt();

        const { statusCode, body } = await supertest(app)
          .get("/api/auth/golden-thought")
          .set("authorization", jwtToken)
          .query({ id: goldenthought.id })
          .send();

        expect(statusCode).toBe(200);
        expect(body.id).toBe(goldenthought.id);
        expect(getGoldenThoughtByIdServiceMock).toHaveBeenCalled();
      });
    });

    describe("id is valid and golden thought does not exist", () => {
      it("should return 'No golden thought with id: ...' message and a 200", async () => {
        const user = await getUser();
        const goldenthought = getGoldenThought(user, false);

        const getGoldenThoughtByIdServiceMock = jest
          .spyOn(goldenThoughtService, "getGoldenThoughtById")
          //@ts-ignore
          .mockReturnValueOnce(null);

        mockFindUserById(user);
        mockDecodeJwt();

        const { statusCode, body } = await supertest(app)
          .get("/api/auth/golden-thought")
          .set("authorization", jwtToken)
          .query({ id: goldenthought.id })
          .send();

        expect(statusCode).toBe(200);
        expect(body.message).toEqual(
          "No golden thought with id: " + goldenthought.id
        );
        expect(getGoldenThoughtByIdServiceMock).toHaveBeenCalled();
      });
    });

    describe("id is invalid", () => {
      it("should return 'query param 'id' is required' message and a 400", async () => {
        const user = await getUser();
        const goldenthought = getGoldenThought(user, false);

        const getGoldenThoughtByIdServiceMock = jest
          .spyOn(goldenThoughtService, "getGoldenThoughtById")
          //@ts-ignore
          .mockReturnValueOnce(null);

        mockFindUserById(user);
        mockDecodeJwt();

        const { statusCode, body } = await supertest(app)
          .get("/api/auth/golden-thought")
          .set("authorization", jwtToken)
          .query({ id: undefined })
          .send();

        expect(statusCode).toBe(400);
        expect(body.message).toEqual("query param 'id' is required");
        expect(getGoldenThoughtByIdServiceMock).not.toHaveBeenCalled();
      });
    });
  });
  describe("delete golden thought", () => {
    describe("valid id and golden thought exists", () => {
      it("should return 'Succesfully deleted golden thought: ...' message and a 200", async () => {
        const user = await getUser();

        const deleteGoldenThoughtServiceMock = jest
          .spyOn(goldenThoughtService, "deleteGoldenThoughtById")
          //@ts-ignore
          .mockReturnValueOnce({ affected: 1 });

        mockFindUserById(user);
        mockDecodeJwt();

        const { statusCode, body } = await supertest(app)
          .delete("/api/auth/admin/golden-thought")
          .set("authorization", jwtToken)
          .query({ id: "id" })
          .send();

        expect(statusCode).toBe(200);
        expect(body.message).toEqual("Succesfully deleted golden thought: id");
        expect(deleteGoldenThoughtServiceMock).toHaveBeenCalled();
      });
    });
    describe("valid id and golden thought does not exist", () => {
      it("should return 'Golden thought with id: ... does not exist' message and a 200", async () => {
        const user = await getUser();

        const deleteGoldenThoughtServiceMock = jest
          .spyOn(goldenThoughtService, "deleteGoldenThoughtById")
          //@ts-ignore
          .mockReturnValueOnce({ affected: 0 });

        mockFindUserById(user);
        mockDecodeJwt();

        const { statusCode, body } = await supertest(app)
          .delete("/api/auth/admin/golden-thought")
          .set("authorization", jwtToken)
          .query({ id: "id" })
          .send();

        expect(statusCode).toBe(200);
        expect(body.message).toEqual(
          "Golden thought with id: id does not exist"
        );
        expect(deleteGoldenThoughtServiceMock).toHaveBeenCalled();
      });
    });
    describe("id is invalid", () => {
      it("should return 'query param 'id' is required' message and a 400", async () => {
        const user = await getUser();

        const deleteGoldenThoughtServiceMock = jest
          .spyOn(goldenThoughtService, "deleteGoldenThoughtById")
          //@ts-ignore
          .mockReturnValueOnce(null);

        mockFindUserById(user);
        mockDecodeJwt();

        const { statusCode, body } = await supertest(app)
          .delete("/api/auth/admin/golden-thought")
          .set("authorization", jwtToken)
          .query({ id: undefined })
          .send();

        expect(statusCode).toBe(400);
        expect(body.message).toEqual("query param 'id' is required");
        expect(deleteGoldenThoughtServiceMock).not.toHaveBeenCalled();
      });
    });
  });
  describe("set golden thought as done", () => {
    describe("id is valid and golden thought exists", () => {
      it("should return a golden thought dto and a 200", async () => {
        const user = await getUser();
        const goldenThought = getGoldenThought(user, false);

        const getGoldenThoughtByIdServiceMock = jest
          .spyOn(goldenThoughtService, "getGoldenThoughtById")
          //@ts-ignore
          .mockReturnValueOnce(goldenThought);

        const updateGoldenThoughtServiceMock = jest
          .spyOn(goldenThoughtService, "updateGoldenThought")
          //@ts-ignore
          .mockReturnValueOnce({ ...goldenThought, isDone: true });

        mockFindUserById(user);
        mockDecodeJwt();

        const { statusCode, body } = await supertest(app)
          .patch("/api/auth/admin/done")
          .set("authorization", jwtToken)
          .query({ id: "id" })
          .send();

        expect(statusCode).toBe(200);
        expect(body.id).toBe(goldenThought.id);
        expect(getGoldenThoughtByIdServiceMock).toHaveBeenCalled();
        expect(updateGoldenThoughtServiceMock).toHaveBeenCalled();
      });
    });
    describe("id is valid and golden thought does not exist", () => {
      it("should return a 'No golden thought with id: ...' message and a 200", async () => {
        const user = await getUser();
        const goldenThought = getGoldenThought(user, false);

        const getGoldenThoughtByIdServiceMock = jest
          .spyOn(goldenThoughtService, "getGoldenThoughtById")
          //@ts-ignore
          .mockReturnValueOnce(null);

        const updateGoldenThoughtServiceMock = jest
          .spyOn(goldenThoughtService, "updateGoldenThought")
          //@ts-ignore
          .mockReturnValueOnce({ ...goldenThought, isDone: true });

        mockFindUserById(user);
        mockDecodeJwt();

        const { statusCode, body } = await supertest(app)
          .patch("/api/auth/admin/done")
          .set("authorization", jwtToken)
          .query({ id: "id" })
          .send();

        expect(statusCode).toBe(200);
        expect(body.message).toEqual("No golden thought with id: id");
        expect(getGoldenThoughtByIdServiceMock).toHaveBeenCalled();
        expect(updateGoldenThoughtServiceMock).not.toHaveBeenCalled();
      });
    });
    describe("id is valid and golden thought exists but is already done", () => {
      it("should return a 'Golden thought with id: ... is already done.' message and a 200", async () => {
        const user = await getUser();
        const goldenThought = getGoldenThought(user, false);

        const getGoldenThoughtByIdServiceMock = jest
          .spyOn(goldenThoughtService, "getGoldenThoughtById")
          //@ts-ignore
          .mockReturnValueOnce({ ...goldenThought, isDone: true });

        const updateGoldenThoughtServiceMock = jest
          .spyOn(goldenThoughtService, "updateGoldenThought")
          //@ts-ignore
          .mockReturnValueOnce({ ...goldenThought, isDone: true });

        mockFindUserById(user);
        mockDecodeJwt();

        const { statusCode, body } = await supertest(app)
          .patch("/api/auth/admin/done")
          .set("authorization", jwtToken)
          .query({ id: "id" })
          .send();

        expect(statusCode).toBe(200);
        expect(body.message).toEqual(
          "Golden thought with id: id is already done."
        );
        expect(getGoldenThoughtByIdServiceMock).toHaveBeenCalled();
        expect(updateGoldenThoughtServiceMock).not.toHaveBeenCalled();
      });
    });
    describe("id is invalid", () => {
      it("should return a 'query param 'id' is required' message and a 400", async () => {
        const user = await getUser();
        const goldenThought = getGoldenThought(user, false);

        const getGoldenThoughtByIdServiceMock = jest
          .spyOn(goldenThoughtService, "getGoldenThoughtById")
          //@ts-ignore
          .mockReturnValueOnce({ ...goldenThought, isDone: true });

        const updateGoldenThoughtServiceMock = jest
          .spyOn(goldenThoughtService, "updateGoldenThought")
          //@ts-ignore
          .mockReturnValueOnce({ ...goldenThought, isDone: true });

        mockFindUserById(user);
        mockDecodeJwt();

        const { statusCode, body } = await supertest(app)
          .patch("/api/auth/admin/done")
          .set("authorization", jwtToken)
          .query({ id: undefined })
          .send();

        expect(statusCode).toBe(400);
        expect(body.message).toEqual("query param 'id' is required");
        expect(getGoldenThoughtByIdServiceMock).not.toHaveBeenCalled();
        expect(updateGoldenThoughtServiceMock).not.toHaveBeenCalled();
      });
    });
  });
});
