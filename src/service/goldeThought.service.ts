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

export async function getUnDoneGoldenThoughts(): Promise<GoldenThought[]> {
  const repository = GoldenThought.getRepository();
  return await repository
    .createQueryBuilder("goldenThought")
    .leftJoinAndSelect("goldenThought.user", "user")
    .where("goldenThought.isDone = false")
    .getMany();
}

export async function getGoldenThoughtById(
  id: string
): Promise<GoldenThought | null> {
  const repository = GoldenThought.getRepository();
  return await repository
    .createQueryBuilder("goldenThought")
    .leftJoinAndSelect("goldenThought.user", "user")
    .where("goldenThought.id = :id", { id })
    .getOne();
}

export async function deleteGoldenThoughtById(id: string): Promise<any> {
  const repository = GoldenThought.getRepository();
  return await repository.delete({ id });
}

export async function updateGoldenThought(
  goldenThought: GoldenThought
): Promise<GoldenThought> {
  return await goldenThought.save();
}
