CREATE TABLE IF NOT EXISTS user (
    uid VARCHAR(128) PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    email VARCHAR(64) UNIQUE,
    phone BIGINT(10) UNIQUE,
    bio VARCHAR(255),
    is_verified BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    pr_img_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS follower (
    uid VARCHAR(128) NOT NULL,
    followerId VARCHAR(128) NOT NULL,
    is_pending BOOLEAN DEFAULT true,
    INDEX (uid)
);

CREATE TABLE IF NOT EXISTS post (
    id VARCHAR(128) PRIMARY KEY,
    img_url VARCHAR(512) NOT NULL,
    uid VARCHAR(128) NOT NULL,
    created_at DATETIME,
    caption VARCHAR(512),
    INDEX(uid)
);