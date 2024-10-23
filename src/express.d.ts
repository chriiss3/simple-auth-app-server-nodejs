import { Date } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string | undefined;
        name: string | undefined;
        email: string | undefined;
        password: string | undefined;
        createdAt: Date | undefined;
        updatedAt: Date | undefined;
      };
    }
  }
}
