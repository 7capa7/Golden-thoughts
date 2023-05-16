import { GoldenThought } from "../entity/GoldenThought";

export async function createGoldenThought(data: Partial<GoldenThought>) {
  const goldenThought = GoldenThought.create({
    value: data.value,
    user: data.user,
  });

  return await goldenThought.save();
}
