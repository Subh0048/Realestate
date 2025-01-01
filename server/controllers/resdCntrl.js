import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";

export const createResidency = asyncHandler(async (req, res) => {
  const { email } = req.user;
  console.log("user email", email);

  const {
    title,
    description,
    price,
    address,
    country,
    city,
    facilities,
    image
  } = req.body.data;

  console.log(req.body.data);
  try {
    // Ensure you're passing 'userEmail' in the 'create' call properly
    const residency = await prisma.residency.create({
      data: {
        title,
        description,
        price,
        address,
        country,
        city,
        facilities,
        image,
       
        owner: {
          connect: {
            email: email,  // Ensure the 'email' is passed correctly to connect User
          },
        },
      },
    });

    res.send({ message: "Residency created successfully", residency });
  } catch (err) {
    console.error(err);
    if (err.code === "P2002") {
      return res.status(400).send({ message: "A residency with the same address already exists" });
    }
    return res.status(500).send({ message: "Error creating residency", error: err.message });
  }
});


// function to get all the documents/residencies
export const getAllResidencies = asyncHandler(async (req, res) => {
  const residencies = await prisma.residency.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  res.send(residencies);
});

// function to get a specific document/residency
export const getResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const residency = await prisma.residency.findUnique({
      where: { id }, // Prisma handles ObjectId validation internally
    });

    if (!residency) {
      return res.status(404).json({ error: "Residency not found" });
    }

    res.json(residency);
  } catch (err) {
    console.error("Error fetching residency:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
