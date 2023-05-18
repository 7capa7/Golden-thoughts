import e, { Request, Response } from "express";
import {
  GoldeThoughtDto,
  GoldenThoughtInput,
} from "../schema/goldenThought.schema";
import {
  createGoldenThought,
  deleteGoldenThoughtById,
  getAllGoldenThoughts,
  getGoldenThoughtById,
  updateGoldenThought,
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

    if (id === undefined) {
      return res
        .status(400)
        .json({
          message: "query param 'id' is required",
          code: 400,
        })
        .send();
    }

    const goldenThought = await getGoldenThoughtById(id.toString());

    if (goldenThought === null) {
      return res
        .status(200)
        .json({
          message: `No golden thought with id: ${id.toString()}`,
          code: 200,
        })
        .send();
    }

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

export async function deleteGoldenThoughtHandler(req: Request, res: Response) {
  try {
    const id = req.query.id;

    if (id === undefined) {
      return res
        .status(400)
        .json({
          message: "query param 'id' is required",
          code: 400,
        })
        .send();
    }

    const deleteResult = await deleteGoldenThoughtById(id.toString());

    if (deleteResult.affected === 1) {
      return res
        .status(200)
        .json({
          message: `Succesfully deleted golden thought: ${id.toString()}`,
          code: 200,
        })
        .send();
    } else {
      return res
        .status(200)
        .json({
          message: `Golden thought with id: ${id.toString()} does not exist`,
          code: 200,
        })
        .send();
    }
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

export async function setGoldenThoughtDone(req: Request, res: Response) {
  try {
    const id = req.query.id;

    if (id === undefined) {
      return res
        .status(400)
        .json({
          message: "query param 'id' is required",
          code: 400,
        })
        .send();
    }

    let goldenThought = await getGoldenThoughtById(id.toString());

    if (goldenThought === null) {
      return res
        .status(200)
        .json({
          message: `No golden thought with id: ${id.toString()}`,
          code: 200,
        })
        .send();
    }

    if (goldenThought.isDone === true) {
      return res
        .status(200)
        .json({
          message: `Golden thought with id: ${id.toString()} is already done.`,
          code: 200,
        })
        .send();
    }

    goldenThought.isDone = true;
    const updated = await updateGoldenThought(goldenThought);

    return res
      .status(200)
      .json(mapGoldenThoughtToGoldenThoughtDto(updated))
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
  return {
    id: goldeThought.id,
    value: goldeThought.value,
    user: user,
    isDone: goldeThought.isDone,
  };
};
