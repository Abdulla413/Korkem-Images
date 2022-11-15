DROP TABLE IF EXISTS comments;
CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    content VARCHAR(1000) NOT NULL,
    username VARCHAR(250) NOT NULL,
    image_id INTEGER NOT NULL REFERENCES images(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );



    