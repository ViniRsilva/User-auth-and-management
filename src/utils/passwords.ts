import bcrypt from "bcrypt";

export async function createHashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  } catch (e) {
    console.error(e);
    throw new Error("Error creating hash password");
  }
}

export async function validPassword(password: string, hashPassword: string | undefined): Promise<boolean> {
  try {
    if (!hashPassword || !password) return false;

    return await bcrypt.compare(password, hashPassword);
  } catch (e) {
    console.error(e);
    throw new Error("Error validing hash password");
  }
}
