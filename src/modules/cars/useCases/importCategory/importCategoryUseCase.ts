import { parse } from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { CategoriesRepository } from "../../repositories/implementations/CategoriesRepository";

interface IImportCategory {
  name: string;
  description: string;
}

@injectable()
class ImportCategoryUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: CategoriesRepository
  ) {}

  loadCategories(file: Express.Multer.File): Promise<IImportCategory[]> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(file.path);
      const parseFile = parse();

      const categories: IImportCategory[] = [];

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [name, description] = line;

          const category = { name, description };

          categories.push(category);
        })
        .on("end", () => {
          fs.promises.unlink(file.path);
          resolve(categories);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }

  async execute(file: Express.Multer.File): Promise<void> {
    const categories = await this.loadCategories(file);

    categories.map(async (category) => {
      const existCategories = await this.categoriesRepository.findByName(
        category.name
      );

      if (!existCategories) {
        await this.categoriesRepository.create(category);
      }
    });
  }
}

export { ImportCategoryUseCase };
