use Lab6_PSKP;

-- Создание таблицы Users
CREATE TABLE Users (
    name VARCHAR(20) NOT NULL PRIMARY KEY,
    password VARCHAR(255) NOT NULL
);

select * from Users;