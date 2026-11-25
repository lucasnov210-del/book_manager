TRUNCATE TABLE roles RESTART IDENTITY CASCADE;
TRUNCATE TABLE authors RESTART IDENTITY CASCADE;
TRUNCATE TABLE categories RESTART IDENTITY CASCADE;


INSERT INTO roles(name)
VALUES
    ('admin'),
    ('librarian'),
    ('user');

INSERT INTO authors(first_name, last_name)
VALUES
    ('Antoine de', 'Saint-Exupéry'),
    ('Victor', 'Hugo'),
    ('robert', 'Kiyosaki'),
    ('Paulo', 'Coelho'),
    ('Napoleon','Hill'),
    ('Nova', 'Lucas'),
    ('Robert', 'C_Martin'),
    ('Hunt', 'Thomas'),
    ('Andrew', 'Tanenbaum');

INSERT INTO categories(name)
VALUES
    ('Roman'),
    ('Aventure'),
    ('Informatique'),
    ('Histoire'),
    ('Science'),
    ('Busness');
