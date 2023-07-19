export default `
CREATE TABLE hots_post
(
    username Utf8 NOT NULL,
    created_at Datetime NOT NULL,
    comment Utf8,
    created_by Utf8,
    hero Utf8,
    rating Uint8,
    PRIMARY KEY (username, created_at)
);
`
