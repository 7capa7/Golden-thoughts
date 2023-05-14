import { User } from "../entity/User";

export async function createUser(data: Partial<User>) {
  const user = User.create({
    name: data.name,
    email: data.email,
    password: data.password,
  });

  return await user.save();
}

export async function findUserById(id: string): Promise<User | null> {
  const userRepository = User.getRepository();
  return await userRepository.findOneBy({
    id: id,
  });
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const userRepository = User.getRepository();
  return await userRepository.findOneBy({
    email: email,
  });
}
