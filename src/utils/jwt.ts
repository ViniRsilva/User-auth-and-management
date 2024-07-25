import jsonwebtoken from "jsonwebtoken";

export function verifyJwt(token: string) {
  try {
    const JTW_SECRET = "edgfv7erygf776r34";
    const decoded = jsonwebtoken.verify(token, JTW_SECRET);
    return { auth: true, idUser: decoded };
  } catch (e) {
    return { auth: false, idUser: null };
  }
}

export function signJwt(id: string) {
  try {
    const JTW_SECRET = "edgfv7erygf776r34";
    const token = jsonwebtoken.sign({ id }, JTW_SECRET, { expiresIn: "1h" });
    return token;
  } catch (e) {
    console.log(e);
    throw new Error("Error signing JWT");
  }
}
