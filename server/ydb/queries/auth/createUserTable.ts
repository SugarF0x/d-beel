export default `
CREATE TABLE user
(
    username Utf8 NOT NULL,
    password Utf8,
    created_at Datetime,
    PRIMARY KEY (username)
);
`
