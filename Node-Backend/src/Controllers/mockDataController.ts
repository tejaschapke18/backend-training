import { Request, Response } from "express";
import UserRepository from "../repository/user/UserRepository";
import { mockUserSchema } from "../config/joi";
class MockDataHandler {
  getData = async (request: Request, response: Response) => {
    try {
      const users = await UserRepository.getAllUsers();
      response.json(users);
    } catch (err) {
      const typedError = err;
      response.status(500).json({ error: typedError });
    }
  };

  createData = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body;
      const { error } = mockUserSchema.validate(body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }
      await UserRepository.createUser(body);
      res.json({ status: "Created Successfully" });
    } catch (error) {
      console.log("Error creating data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  getDataById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id: string = req.params.id;
      const user = await UserRepository.findUserById(id);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  deleteDataById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const deletedUser = await UserRepository.deletdUserById(id);
      if (!deletedUser) {
        res.status(404).json({ message: "No data found for this ID" });
        return;
      }
      res.json({ status: "Deleted Successfully" });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  updateDataById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const body = req.body;

      const { error } = mockUserSchema.validate(body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const updatedUser = await UserRepository.updateDataById(id, body);
      if (!updatedUser) {
        res.status(404).json({ message: "No data found for this ID" });
        return;
      }
      res.json({ status: "Updated Successfully" });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

export default new MockDataHandler();
