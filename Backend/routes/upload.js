const express = require("express");
const multer = require("multer");
const supabase = require("../config/supabase");


const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/upload",
  upload.single("file"),
  async (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      const { data, error } = await supabase.storage
        .from("chat-files")
        .upload(
          `${Date.now()}-${file.originalname}`,
          file.buffer,
          {
            contentType: file.mimetype,
          }
        );

      if (error) {
        console.log(error);

        return res.status(500).json(error);
      }

      const { data: publicUrlData } =
        supabase.storage
          .from("chat-files")
          .getPublicUrl(data.path);

      res.json({
        success: true,
        fileUrl: publicUrlData.publicUrl,
        fileName: file.originalname,
      });

    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "Upload failed",
      });
    }
  }
);

module.exports = router;