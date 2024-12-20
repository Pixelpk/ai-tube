import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function getAuthUser(req, res, next) {
  if (!req.data.token) {
    req.user = null;
    return next();
  }

  const token = req.data.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
    include: {
      videos: true,
    },
  });

  req.user = user;
  next();
}

export async function protect(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("TOKK", token);
  if (!token) {
    return next({
      message: "You need to be logged in to visit this route",
      statusCode: 401,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      include: {
        videos: true,
      },
    });

    req.user = user;
    next();
  } catch (error) {
    next({
      message: "You need to be logged in to visit this route",
      statusCode: 401,
    });
  }
}
