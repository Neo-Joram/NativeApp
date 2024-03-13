import bcrypt from "bcryptjs";

// Function to hash passwords using Bcrypt
export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    // Handle any errors that might occur during hashing
    console.error("Error hashing password:", error);
    throw error;
  }
};

// Function to compare passwords using Bcrypt
export const comparePasswords = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
