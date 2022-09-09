const express = require("express");

const app = express();

const mongoose = require("mongoose");
const { findOne } = require("./models/Animal");

const Animal = require("./models/Animal");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.post("/animal", async (req, res) => {
  const { breed, size, cub } = req.body;
  const animal = {
    breed,
    size,
    cub,
  };
  try {
    await Animal.create(animal);
    res.status(201).json({ message: "Added animal" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get("/animal", async (req, res) => {
  try {
    const animal = await Animal.find();
    res.status(200).json(animal);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get("/animal/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const animal = await Animal.findOne({ _id: id });

    if (!animal) {
      res.status(422).json({ message: "animal not found" });
      return;
    }

    res.status(200).json(animal);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.patch("/animal/:id", async (req, res) => {
  const id = req.params.id;
  const { breed, size, cub } = req.body;

  const animal = {
    breed,
    size,
    cub,
  };

  try {
    const updateAnimal = await Animal.updateOne({ _id: id }, animal);

    if (updateAnimal.matchedCount === 0) {
      res.status(422).json({ message: "animal not found" });
      return;
    }

    res.status(200).json(animal);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.delete("/animal/:id", async (req, res) => {
  const id = req.params.id;
  const animal = Animal.findOne({ _id: id });

  if (!animal) {
    res.status(422).json({ message: "animal not found" });
    return;
  }

  try {
    await Animal.deleteOne({ _id: id });
    res.status(204).json({ message: "deleted animal" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

mongoose
  .connect(
    "mongodb+srv://kauan:kau231299@cluster0.5d1q5pb.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Conectou");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
