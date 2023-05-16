import { createUser } from "../service/user.service";
import Role from "./Role";
import { log } from "./logger";

const createTestUsers = async () => {
  setTimeout(async () => {
    const user = {
      name: "Joseph",
      email: "user@gmail.com",
      password: "password",
    };

    const admin = {
      name: "John",
      email: "admin@gmail.com",
      password: "password",
    };
    await createUser(user);
    const savedAdmin = await createUser(admin);
    savedAdmin.role = Role.ADMIN;
    await savedAdmin.save();

    log.info(
      "Test users have been created : {user@gmail.com | password}, {admin@gmail.com | password}"
    );
  }, 5555);
};

export default createTestUsers;
