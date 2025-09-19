import mongoose from "mongoose";

export default defineNitroPlugin(async (event) => {
  try {
    await mongoose.connect(useRuntimeConfig().mongodb);
    console.log("Db connected");
  } catch (e) {
    console.log(e);
    throw createError({
      status: 500,
      message: "Could not connect to the database",
    });
  }
});
