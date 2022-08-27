import { errorResponse, successRes } from "../../utils/responseHandler.js";
import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";

import models from "../../models/index.js";

XLSX.set_fs(fs);

export default class News {
  static async addStudents(req, res) {
    try {
      if (!req.file) {
        return errorResponse(res, "Please provide a file", 400);
      }
      let file = XLSX.read(req.file.buffer);
      let data = [];

      const sheets = file.SheetNames;

      for (let i = 0; i < sheets.length; i++) {
        const temp = XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
        temp.forEach((res) => {
          data.push(res);
        });
      }

      if (data.length) {
        await models.Students.bulkCreate(data);
      }

      return successRes(res, {}, `operation successful`, 201);
    } catch (error) {
      console.log(error);
      return errorResponse(res, "error occourred, contact support", 500);
    }
  }

  static async getAllStudents(req, res) {
    try {
      let result = await models.Students.findAll();
      if (!result.length) return errorResponse(res, "no students found", 404);
      return successRes(res, result, ` successful`, 200);
    } catch (error) {
      console.log(error);
      return errorResponse(res, "error occourred, contact support", 500);
    }
  }
}
