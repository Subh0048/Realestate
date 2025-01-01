import { prisma } from "../config/prismaConfig.js";
import asynceHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const createUser = asynceHandler(async (req, res) => {
  console.log("Creating a user");

  let { email, name, password, mobileno } = req.body;
  let incryptpass = await bcrypt.hash(password, 10);

  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!userExists) {
    const user = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: incryptpass,
        mobileno: mobileno,
      },
    });

    res.send({
      message: "User created successfully",
      user: user,
    });
  } else {
    res.status(201).send({
      message: "User already exists",
    });
  }
});

// const Userlogin = asynceHandler(async (req, res) => {
//   console.log("Logging in a user");

//   try {
//     const { email, password } = req.body;

//     // Find the user by email
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // Verify the password
//     const validPass = await bcrypt.compare(password, user.password);
//     if (!validPass) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // Token expiration time
//     const age = 1000 * 60 * 60 * 24 * 7; // 7 days

//     // Generate JWT
//     const token = jwt.sign(
//       {
//         id: user.id,
//         email: user.email,
//       },
//       process.env.SECRET_KEY,
//       { expiresIn: "7d" } // Matches the cookie's expiration
//     );

//     // Set the token in an HTTP-only cookie
//     res
//       .cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         maxAge: age, // Cookie expiration
//         sameSite: "Strict", // Prevent CSRF
//       })
//       .status(200)
//       .json({
//         user: {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           image: user.image,
//           mobileno: user.mobileno,
//         },
//         token,
//         message: "Login successful",
//       });
//   } catch (error) {
//     console.error("Error during login:", error.message);
//     res.status(500).json({ message: "Failed to login" });
//   }
// });

const Userlogin = asynceHandler(async (req, res) => {
  console.log("Logging in a user");

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify the password
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Token expiration time
    const age = 1000 * 60 * 60 * 24 * 7; // 7 days

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Set the token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: age,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });

    // Send response
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        mobileno: user.mobileno,
      },token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Failed to login" });
  }
});


export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "logout successfuly" });
};

// bookvisit for residency

const bookVisit = asynceHandler(async (req, res) => {
  const { date } = req.body;
  const { id } = req.params;

  if (!req.user || !req.user.email) {
    return res
      .status(400)
      .json({ message: "User email is missing or invalid" });
  }

  const email = req.user.email; // Extract email from authenticated user

  try {
    const alreadyBooked = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });

    if (!alreadyBooked) {
      return res.status(404).json({ message: "User not found" });
    }

    if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
      return res.status(400).json({ message: "Already booked" });
    }

    await prisma.user.update({
      where: { email },
      data: {
        bookedVisits: { push: { id, date } }, // Append new booking
      },
    });

    res.status(200).json({ message: "Booked successfully" });
  } catch (error) {
    console.error("Error booking visit:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getAllBookings = asynceHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const bookings = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });
    res.status(200).send(bookings);
  } catch (error) {
    throw new Error(error.message);
  }
});

const cancelBooking = asynceHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });

    const index = user.bookedVisits.findIndex((visit) => visit.id === id);

    if (index === -1) {
      res.status(400).json({ message: "Not booked" });
    } else {
      user.bookedVisits.splice(index, 1);
      await prisma.user.update({
        where: { email },
        data: {
          bookedVisits: user.bookedVisits,
        },
      });
      res.status(200).send({ message: "Cancelled successfully" });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

const toFav = asynceHandler(async (req, res) => {
  const { email } = req.user; // In production, it might be better to extract `email` from `req.userId` after JWT validation
  const { rid } = req.params; // `rid` should be the residency ID (usually passed in the URL)

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the residency ID is already in the user's favourites
    if (user.favResidenciesID.includes(rid)) {
      // Remove from favorites
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesID: {
            set: user.favResidenciesID.filter((id) => id !== rid), // Remove the `rid` from the array
          },
        },
      });
      res
        .status(200)
        .send({ message: "Removed from favorites", user: updateUser });
    } else {
      // Add to favorites
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesID: {
            push: rid, // Add `rid` to the array
          },
        },
      });
      res.status(200).send({ message: "Added to favorites", user: updateUser });
    }
  } catch (error) {
    console.error("Error updating favorites:", error);
    res
      .status(500)
      .json({ message: "Failed to update favorites", error: error.message });
  }
});

const getAllFav = asynceHandler(async (req, res) => {
  const { email } = req.user; // Extract email from the request body (use `req.userId` if you're using JWT for authentication)

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { favResidenciesID: true }, // Only select the favResidenciesID field to return
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ favResidenciesID: user.favResidenciesID });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch favorites", error: error.message });
  }
});

export {
  createUser,
  Userlogin,
  bookVisit,
  getAllBookings,
  cancelBooking,
  toFav,
  getAllFav,
};
