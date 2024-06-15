const express = require('express');
const multer = require('multer');
const ftp = require('basic-ftp');

const app = express();
const upload = multer();

app.use(express.json());

app.post('/', upload.none(), async (req, res) => {
  const { filename, content } = req.body;

  if (!filename || !content) {
    return res.status(400).send('Missing filename or content');
  }

  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    await client.access({
      host: '103.42.57.100',
      user: 'tool',
      password: 'aaztZ5FWATmmXiyF',
      secure: true
    });

    await client.ensureDir('/lich');
    await client.uploadFrom(Buffer.from(content), `/lich/${filename}`);
    res.status(200).send('File uploaded successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading file');
  } finally {
    client.close();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
