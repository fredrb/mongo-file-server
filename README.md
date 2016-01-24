# Mongo file server

Express framework this is an example application of how to upload large files (such as images and pdf) to a mongo database.

## Run

- Set mongodb path in `./config/default.json`.
- `npm install` to install dependencies.
- `npm start` to run application on port `3000`.
- `POST` request to `/upload` using `file` and `name` body parameters.
- `GET` request to `/<filename>` where `<filename>` is the `name` parameter used in post request.

## Database

`file` is the only table in database; Where both filename and content are stored.
