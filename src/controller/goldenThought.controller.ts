import e, { Request, Response } from "express";
import {
  GoldeThoughtDto,
  GoldenThoughtInput,
} from "../schema/goldenThought.schema";
import {
  createGoldenThought,
  getAllGoldenThoughts,
} from "../service/goldeThought.service";
import { GoldenThought } from "../entity/GoldenThought";

export async function createGoldenThoughtHandler(
  req: Request<{}, {}, GoldenThoughtInput>,
  res: Response
) {
  const body = req.body;

  if (req.query.anonymous == "true") req.body.user = null;
  else req.body.user = res.locals.user;

  try {
    const GoldenThought = await createGoldenThought(body);
    return res
      .status(201)
      .json(mapGoldenThoughtToGoldenThoughtDto(GoldenThought))
      .send();
  } catch (e) {
    return res.status(500).send("Server error");
  }
}

export async function getGoldenThoughtsHandler(req: Request, res: Response) {
  try {
    const goldenThoughts = await getAllGoldenThoughts();

    const goldenThoughtsDto: GoldeThoughtDto[] = goldenThoughts.map((e) =>
      mapGoldenThoughtToGoldenThoughtDto(e)
    );

    return res.status(200).json(goldenThoughtsDto).send();
  } catch (e) {
    return res.status(500).send("Server error");
  }
}

const mapGoldenThoughtToGoldenThoughtDto = (
  goldeThought: GoldenThought
): GoldeThoughtDto => {
  const user =
    goldeThought.user === null ? "Anonymous" : goldeThought.user.name;
  return { id: goldeThought.id, value: goldeThought.value, user: user };
};
