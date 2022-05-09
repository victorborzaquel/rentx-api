import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateSpecificationUseCase } from "./CreateSpecificationUseCase";

class CreateSpecificationController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name, description } = req.body;

    const specification = { name, description };

    const createSpecificationUSeCase = container.resolve(
      CreateSpecificationUseCase
    );

    await createSpecificationUSeCase.execute(specification);

    return res.status(201).send();
  }
}

export { CreateSpecificationController };
