CREATE TABLE IF NOT EXISTS
simpsons(
  id SERIAL PRIMARY KEY NOT NULL,
  quote VARCHAR(256) NOT NULL,
  character VARCHAR(256) NOT NULL,
  image VARCHAR NOT NULL,
 
  characterDirection VARCHAR NOT NULL
);
