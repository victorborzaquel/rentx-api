import { Request, Response } from "express";

import { CreateSpecificationUseCase } from "./CreateSpecificationUseCase";

class CreateSpecificationController {
  constructor(private createSpecificationUSeCase: CreateSpecificationUseCase) {}

  handle(req: Request, res: Response): Response {
    const { name, description } = req.body;

    const specification = { name, description };

    this.createSpecificationUSeCase.execute(specification);

    return res.status(201).send();
  }
}

export { CreateSpecificationController };
