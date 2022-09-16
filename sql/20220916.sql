CREATE TABLE sites_user (
    id int AUTO_INCREMENT,
    username varchar(255) NOT NULL,
    google_id varchar(25) NOT NULL,
    url_image varchar(255) DEFAULT NULL,
    birth_date datetime DEFAULT NULL,
    CONSTRAINT PK_user PRIMARY KEY (id)
);

CREATE TABLE sites_encounters (
    id int AUTO_INCREMENT,
    user_id int NOT NULL,
    user_match_id int NOT NULL,
    creation_date datetime DEFAULT NULL,
    CONSTRAINT PK_user PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES sites_user(id),
    FOREIGN KEY (user_match_id) REFERENCES sites_user(id)
);


CREATE TABLE sites_qr_code (
    id int AUTO_INCREMENT,
    user_id int NOT NULL,
    creation_date datetime DEFAULT now(),
    code varchar(255) NOT NULL,
    CONSTRAINT PK_user PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES sites_user(id)
);

CREATE TABLE sites_rarity (
    id int AUTO_INCREMENT,
    strength int NOT NULL,
    color_code varchar(255) NOT NULL,
    CONSTRAINT PK_rarity PRIMARY KEY (id),
);