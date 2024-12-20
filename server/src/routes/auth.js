import { PrismaClient } from "@prisma/client";
import express from "express";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/authorization";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const prisma = new PrismaClient();

function getAuthRoutes() {
  const router = express.Router();

  router.post("/google-login", googleLogin);
  router.get("/me", protect, me);
  router.get("/signout", signout);

  router.post("/login", login);
  router.post("/signup", signUp);

  return router;
}

// All controllers/utility functions here
async function googleLogin(req, res) {
  const { idToken } = req.body;
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { name, picture, email } = ticket.getPayload();

  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        username: name,
        avatar: picture,
        password: null,
      },
    });
  }

  const tokenPayload = { id: user.id };
  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  // res.cookie("token", token, { httpOnly: true });
  res.status(200).send({ token: token });
  // res.status(200).send(token);
}

async function me(req, res) {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      subscriberId: {
        equals: req.user.id,
      },
    },
  });

  const channelIds = subscriptions.map((sub) => sub.subscribedToId);

  const channels = await prisma.user.findMany({
    where: {
      id: {
        in: channelIds,
      },
    },
  });

  const user = req.user;
  user.channels = channels;

  res.status(200).json({ user });
}

function signout(req, res) {
  res.clearCookie("token");
  res.status(200).json({});
}

async function signUp(req, res) {
  const { email, username, password } = req.body;

  // Check if the user already exists
  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash the password before saving it
  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

  // Create the user in the database
  user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
  });

  // Create JWT token
  const tokenPayload = { id: user.id };
  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  // res.cookie("token", token, { httpOnly: true });
  res.status(201).json({ message: "User created successfully", token, user });
}

async function login(req, res) {
  const { email, password } = req.body;

  // Check if user exists
  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Compare password with the hashed password stored in the database
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Create JWT token
  const tokenPayload = { id: user.id };
  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  console.log("to", token);

  // res.cookie("token", token);
  res.status(200).send({ token: token, user });

  console.log("res", res);
}

export { getAuthRoutes };
