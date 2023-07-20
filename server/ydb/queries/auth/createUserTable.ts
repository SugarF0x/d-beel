export default `
CREATE TABLE user
(
    username Utf8 NOT NULL,
    created_at Datetime,
    hash Utf8,
    iterations Uint16,
    salt Utf8,
    PRIMARY KEY (username)
);
`
