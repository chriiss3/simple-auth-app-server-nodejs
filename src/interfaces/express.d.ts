import { Date } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user: {
        email: string | undefined;
        password: string | undefined;
        name: string | undefined;
        refreshToken: string | undefined | null;
        sessionActive: boolean | undefined;
        createdAt: Date | undefined;
        updatedAt: Date | undefined;
        id: string | undefined;
      };
    }
  }
}
