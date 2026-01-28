import { google } from "googleapis";
import dotenv from "dotenv";
import jwt, { Secret } from "jsonwebtoken";
import User from "../models/User";
import { Logger } from "../utils/utils";
import axios from "axios";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as Secret;
const googleClientId = process.env.GOOGLE_CLIENT_ID as string;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUrl = process.env.REDIRECT_URL;
export const oauth2Client = new google.auth.OAuth2(
  googleClientId,
  googleClientSecret,
  redirectUrl,
);
const getGoogleAuthUrl = () => {
  const scopes = [
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
    response_type: "code",
  });

  return url;
};

async function getCode(code: string) {
  const token = await oauth2Client.getToken(code);
  if (!token.tokens.id_token) throw new Error("No Id token");
  const { refresh_token, expiry_date, token_type } = token.tokens;

  const ticket = await oauth2Client.verifyIdToken({
    idToken: token.tokens.id_token!,
    audience: googleClientId,
  });

  const payload = ticket.getPayload();
  if (!payload) throw new Error("Invalid Google ID payload.");
  const { name, sub, picture } = payload;
  const isUser = await User.findOne({ "user.sub": payload.sub });
  if(isUser){
    await isUser.updateOne({refresh_token: refresh_token, expiry_date: expiry_date, "user.name": name, "user.picture": picture}).exec()
  }else{
    const user = new User({
      refresh_token,
      expiry_date,
      token_type,
      "user.name": name,
      "user.sub": sub,
      "user.picture": picture,
    });
    await user
      .save()
      .then(() => {
        Logger(`Data saved for user: ${name}`);
      })
      .catch((e) => {
        Logger(`Error while saving user creds: ${e}`);
      });
  }

  const drawSessionToken = jwt.sign(
    {
      name: name,
      sub: sub,
      picture: picture,
    },
    JWT_SECRET,
    { expiresIn: "30d" },
  );

  return drawSessionToken;
}

async function revokeToken(token: string) {
  const res = await axios.post("https://oauth2.googleapis.com/revoke", token, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  if (res.status === 200) {
    const user = await User.findOne({
      access_token: token,
      $or: [{ refresh_token: token }],
    });
    if (user === null) return;
    await user.deleteOne(user._id);
    return "User data removed";
  }
}

export { getGoogleAuthUrl, getCode, revokeToken };
