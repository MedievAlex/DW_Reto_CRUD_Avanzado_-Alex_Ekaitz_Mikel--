-- DB --
DROP DATABASE IF EXISTS CRUD_DW;
CREATE DATABASE CRUD_DW;
USE CRUD_DW;

-- TABLES --
CREATE TABLE PROFILE_(
    PROFILE_CODE INT PRIMARY KEY AUTO_INCREMENT,
    EMAIL VARCHAR (40) UNIQUE,
    USER_NAME VARCHAR (30) UNIQUE,
    PSWD VARCHAR (255),
    TELEPHONE BIGINT,
    NAME_ VARCHAR (30),
    SURNAME VARCHAR (30)
);


CREATE TABLE USER_(
    PROFILE_CODE INT PRIMARY KEY,
    GENDER VARCHAR (10),
    CARD_NO VARCHAR (50),
    FOREIGN KEY (PROFILE_CODE) REFERENCES PROFILE_(PROFILE_CODE) ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE ADMIN_(
    PROFILE_CODE INT PRIMARY KEY,
    CURRENT_ACCOUNT VARCHAR (50),
    FOREIGN KEY (PROFILE_CODE) REFERENCES PROFILE_(PROFILE_CODE) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE VIDEOGAME_(
    V_CODE INT PRIMARY KEY AUTO_INCREMENT,
    V_NAME VARCHAR(50) NOT NULL,
    V_RELEASE DATE NOT NULL,
    V_PLATFORM ENUM('PC', 'NINTENDO', 'XBOX', 'PLAYSTATION', 'DEFAULT'),
    V_PEGI ENUM('PEGI3', 'PEGI6', 'PEGI12', 'PEGI16', 'PEGI18', 'DEFAULT')
);

CREATE TABLE LISTED_(
    L_NAME VARCHAR(50),
    PROFILE_CODE INT,
    V_CODE INT,
    PRIMARY KEY (L_NAME, PROFILE_CODE, V_CODE),
    FOREIGN KEY (PROFILE_CODE) REFERENCES PROFILE_(PROFILE_CODE) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (V_CODE) REFERENCES VIDEOGAME_(V_CODE) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE REVIEW_(
    PROFILE_CODE INT,
    V_CODE INT,
    R_SCORE INT,
    R_DESCRIPTION VARCHAR(500),
    R_DATE DATE,
    PRIMARY KEY (PROFILE_CODE, V_CODE),
    FOREIGN KEY (PROFILE_CODE) REFERENCES PROFILE_(PROFILE_CODE) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (V_CODE) REFERENCES VIDEOGAME_(V_CODE) ON UPDATE CASCADE ON DELETE CASCADE
);

-- INSERTS --
INSERT INTO PROFILE_ (PROFILE_CODE, EMAIL, USER_NAME, PSWD, TELEPHONE, NAME_, SURNAME) VALUES
    (1, 'juan.perez@email.com', 'juanP', '$2y$10$7OMKfOjQveaUvkRh18Ok8OvWOpSXyAGW0cf/raaZh9Kzk5GucWm6m', 611223344, 'Juan', 'Pérez'),
    (2, 'maria.garcia@email.com', 'mariag', '$2y$10$dVhwoJ9yT8gRbLuBIWiKD.RLiF87h09uDArHwGAlsuH/0CxTBC0da', 622334455, 'María', 'García'),
    (3, 'carlos.lopez@email.com', 'carlosl', '$2y$10$cJRVfsmypj/dUfqSlpX0wuoBULPDkSEOGTXBxt627KWp5TuVL5lPG', 633445566, 'Carlos', 'López'),
    (4, 'ana.martinez@email.com', 'anam', '$2y$10$w04egwZMKEDPgTm8IU4QQeIbfFsdd0dPXBu1HVa81DQgEAcaQgWOm', 644556677, 'Ana', 'Martínez'),
    (5, 'pedro.rodriguez@email.com', 'pedror', '$2y$10$3qVuwp5IecRyRoHP2So0v.WeQMzBLeTs.O6s.NWb/Nqv.KpQrtX8G', 655667788, 'Pedro', 'Rodríguez');

INSERT INTO USER_ (PROFILE_CODE, GENDER, CARD_NO) VALUES
    (1, 'Man', '1234567890123456'),
    (2, 'Female', '2345678901234567'),
    (3, 'Man', '3456789012345678');

INSERT INTO ADMIN_ (PROFILE_CODE, CURRENT_ACCOUNT) VALUES
    (4, 'ES12-3456-7890-1234-5678'),
    (5, 'ES98-7654-3210-9876-5432');

INSERT INTO VIDEOGAME_ (V_NAME, V_RELEASE, V_PLATFORM, V_PEGI) VALUES
    ("Owlboy", '2016-11-1', 'NINTENDO', 'PEGI3'), -- 1 --
    ("Owlboy", '2016-11-1', 'PLAYSTATION', 'PEGI3'), -- 2 --
    ("Owlboy", '2016-11-1', 'PC', 'PEGI3'), -- 3 --
    ("Owlboy", '2016-11-1', 'XBOX', 'PEGI3'), -- 4 --
    ("Animal Crossing New Horizons", '2020-5-20', 'NINTENDO', 'PEGI6'), -- 5 -- 
    ("Detroit Become Human", '2018-5-25', 'PLAYSTATION', 'PEGI16'), -- 6 -- 
    ("Detroit Become Human", '2018-5-25', 'PC', 'PEGI16'), -- 7 -- 
    ("Detroit Become Human", '2018-5-25', 'XBOX', 'PEGI16'), -- 8 -- 
    ("ASTRO BOT", '2024-9-6', 'PLAYSTATION', 'PEGI3'), -- 9 -- 
    ("Call of Duty Black Ops II", '2012-11-13', 'PLAYSTATION', 'PEGI18'), -- 10 -- 
    ("Call of Duty Black Ops II", '2012-11-13', 'PC', 'PEGI18'), -- 11 --
    ("Call of Duty Black Ops II", '2012-11-13', 'XBOX', 'PEGI18'), -- 12 -- 
    ("Halo Infinite", '2021-12-8', 'XBOX', 'PEGI16'), -- 13 -- 
    ("Balatro", '2024-2-20', 'NINTENDO', 'PEGI12'), -- 14 -- 
    ("Balatro", '2024-2-20', 'PC', 'PEGI12'), -- 15 -- 
    ("Library Of Ruina", '2021-8-10', 'NINTENDO', 'PEGI3'), -- 16 --  
    ("Library Of Ruina", '2021-8-10', 'PC', 'PEGI3'), -- 17 -- 
    ("Super Mario Odyssey", '2017-10-27', 'NINTENDO', 'PEGI3'), -- 18 -- 
    ("Hades", '2020-9-17', 'NINTENDO', 'PEGI12'), -- 19 -- 
    ("Hades", '2020-9-17', 'PLAYSTATION', 'PEGI12'), -- 20 -- 
    ("Hades", '2020-9-17', 'PC', 'PEGI12'), -- 21 -- 
    ("Hades", '2020-9-17', 'XBOX', 'PEGI12'), -- 22 -- 
    ("Cult of The Lamb", '2022-8-11', 'NINTENDO', 'PEGI12'), -- 23 -- 
    ("Cult of The Lamb", '2022-8-11', 'PLAYSTATION', 'PEGI12'), -- 24 -- 
    ("Cult of The Lamb", '2022-8-11', 'PC', 'PEGI12'), -- 25 -- 
    ("God of War Ragnarok", '2022-11-9', 'PLAYSTATION', 'PEGI18'), -- 26 -- 
    ("Hellblade Senuas Sacrifice", '2017-8-8', 'PLAYSTATION', 'PEGI18'), -- 27 -- 
    ("Life is Strange", '2015-1-30', 'PLAYSTATION', 'PEGI16'), -- 28 --  
    ("Life is Strange", '2015-1-30', 'PC', 'PEGI16'), -- 29 --  
    ("Life is Strange", '2015-1-30', 'XBOX', 'PEGI16'), -- 30 -- 
    ("Hi Fi Rush", '2023-1-25', 'XBOX', 'PEGI12'); -- 31 -- 
    
INSERT INTO LISTED_ (L_NAME, PROFILE_CODE, V_CODE) VALUES
    ('NINTENDO', 1, 1), -- Owlboy --
    ('NINTENDO', 1, 14), -- Balatro --
    ('NINTENDO', 1, 19), -- Hades --
    ('NINTENDO', 1, 23), -- Cult of The Lamb --
    ('PLAYSTATION', 1, 10), -- Call of Duty: Black Ops II --
    ('PLAYSTATION', 1, 28), -- Life is Strange --
    ('PLAYSTATION', 1, 6), -- Detroit: Become Human --
    ('PC', 1, 15), -- Balatro --
    ('PC', 1, 25), -- Cult of The Lamb --
    ('PC', 1, 17), -- Library Of Ruina --
    ('XBOX', 1, 13), -- Halo Infinite --
    ('XBOX', 1, 31); -- Hi-Fi Rush --

INSERT INTO REVIEW_ (PROFILE_CODE, V_CODE, R_SCORE, R_DESCRIPTION, R_DATE) VALUES
    (1, 13, 2, "Played a bit, thought it was fun. However this game CONTINUES to reinstall itself on my computer. For that I do not recommend it. I have uninstalled it over a dozen times and it keeps coming back, at this point I consider it a virus.", '2025-8-8'), -- Halo Infinite --
    (1, 1, 9, "If Hayao Miyazaki directed a video game I feel like it'd be something like Owlboy. By which I mean; stunning visuals, incredible soundtrack and a wonderful story. The three intertwine so well that I'd consider it to be my Ocarina of Time for Pixel Platformers. And an indie game that's so damn beautiful it made me write my first review.", '2020-10-22'), -- Owlboy --
    (1, 9, 10, "It is not only graphically stunning, it is funny and beautiful. It is a masterpiece that, in my opinion, is the best game of all time.", '2025-8-8'), -- ASTRO BOT --
    (3, 9, 9, "GOTY.", '2023-12-2'), -- ASTRO BOT --
    (3, 11, 7, "They dont make games llike this now a day.", '2026-1-5'), -- Call of Duty: Black Ops II --
    (5, 26, 5, "Mid game.", '2023-7-30'); -- God of War Ragnarok --

-- FUNCTIONS & PROCEDURES --
DELIMITER //
CREATE PROCEDURE RegistrarUsuario( IN p_username VARCHAR(30), IN p_pswd VARCHAR(255))
BEGIN
    DECLARE  nuevo_profile_code INT;

    INSERT INTO PROFILE_ (EMAIL, USER_NAME, PSWD, TELEPHONE, NAME_, SURNAME)
    VALUES (null, p_username, p_pswd, null, null, null);

    SET nuevo_profile_code = LAST_INSERT_ID();

    INSERT INTO USER_ (PROFILE_CODE, GENDER, CARD_NO)
    VALUES (nuevo_profile_code, null, null);

    SELECT * FROM PROFILE_ P, USER_ U WHERE P.PROFILE_CODE = U.PROFILE_CODE AND P.PROFILE_CODE= nuevo_profile_code;
 END //

DELIMITER ;
