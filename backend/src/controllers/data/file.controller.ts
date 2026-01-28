import type { Response } from "express";
import { Router } from "express";
import { createFile, getFile, getFiles, updateFile } from "../../services/user.service";
import { AuthUser } from "../../middleware/auth.middleware";
import { oauth2Client } from "../../services/auth.service";
import { getValidAccessToken } from "../../services/googleClient";

const router = Router();

router.get("/", async (req: AuthUser, res: Response) => {
  const { sub } = req.user;
  const files = await getFiles(sub);
  res.status(200).json(files);
});

router.route("/:fileId").get(async (req: AuthUser, res: Response) => {
  const { sub } = req.user;
  const { fileId } = req.params;
  if (!fileId) {
    res.status(400).json({ message: "Bad request." });
  } else {
    try {
      const file = await getFile(sub, fileId);
      res.status(200).send(file);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch file" });
    }
  }
})
.patch(async (req: AuthUser, res: Response) => {
  const { sub } = req.user;
  const { fileId } = req.params;
  const fileBody = req.body;

  if (!fileId) {
    res.status(400).json({ message: "Bad request." });
  } else {
    try {
      // Pass the entire request body through so different file shapes are supported (canvas/flow/etc.)
      const updatedFile = await updateFile(sub, fileId, fileBody);
      res.status(201).json({ message: "File Updated successfully", file: updatedFile });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update file" });
    }
  }
})

router.post("/:filename", async (req: AuthUser, res: Response) => {
  // create with filename
  const { filename} = req.params;
  const {type} = req.body;
  const { sub } = req.user;
  const access_token = await getValidAccessToken(sub);
  oauth2Client.setCredentials({ access_token: access_token });
  const response = await createFile(oauth2Client, filename!,type);
  console.log(response);
  res.status(201).json(response);
});

export default router;
