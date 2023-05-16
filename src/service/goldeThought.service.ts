import { GoldenThought } from "../entity/GoldenThought";

export async function createGoldenThought(
  data: Partial<GoldenThought>
): Promise<GoldenThought> {
  const goldenThought = GoldenThought.create({
    value: data.value,
    user: data.user,
  });

  return await goldenThought.save();
}

export async function getAllGoldenThoughts(): Promise<GoldenThought[]> {
  const repository = GoldenThought.getRepository();
  return await repository
    .createQueryBuilder("goldenThought")
    .leftJoinAndSelect("goldenThought.user", "user")
    .getMany();
}

export async function getGoldenThoughtById(id: string) {
  const repository = GoldenThought.getRepository();
  return await repository
    .createQueryBuilder("goldenThought")
    .leftJoinAndSelect("goldenThought.user", "user")
    .where("goldenThought.id = :id", { id })
    .getOne();
}

export async function deleteGoldenThoughtById(id: string) {
  const repository = GoldenThought.getRepository();
  return await repository.delete({ id });
}
