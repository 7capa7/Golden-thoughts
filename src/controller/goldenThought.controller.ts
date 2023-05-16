import e, { Request, Response } from "express";
import {
  GoldeThoughtDto,
  GoldenThoughtInput,
} from "../schema/goldenThought.schema";
import {
  createGoldenThought,
  getAllGoldenThoughts,
  getGoldenThoughtById,
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
    return res
      .status(500)
      .json({
        message: "Server error",
        code: 500,
      })
      .send();
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
    return res
      .status(500)
      .json({
        message: "Server error",
        code: 500,
      })
      .send();
  }
}

export async function getGoldenThoughtByIdHandler(req: Request, res: Response) {
  try {
    const id = req.query.id;

    if (id == undefined)
      return res
        .status(400)
        .json({
          message: "query param 'id' is required",
          code: 400,
        })
        .send();

    const goldenThought = await getGoldenThoughtById(id.toString());

    if (goldenThought == null)
      return res
        .status(400)
        .json({
          message: "Invalid ID",
          code: 400,
        })
        .send();

    return res
      .status(200)
      .json(mapGoldenThoughtToGoldenThoughtDto(goldenThought))
      .send();
  } catch (e) {
    return res
      .status(500)
      .json({
        message: "Server error",
        code: 500,
      })
      .send();
  }
}

const mapGoldenThoughtToGoldenThoughtDto = (
  goldeThought: GoldenThought
): GoldeThoughtDto => {
  const user =
    goldeThought.user === null ? "Anonymous" : goldeThought.user.name;
  return { id: goldeThought.id, value: goldeThought.value, user: user };
};
