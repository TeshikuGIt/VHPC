create TABLE IF NOT EXISTS reading_list (
    id int auto_increment PRIMARY KEY,
    barcode VARCHAR(100) NOT NULL,
    test_time_date TIMESTAMP,
    cct_k INT NOT NULL,
    x NUMERIC(9,6) NOT NULL,
    y NUMERIC(9,6) NOT NULL,
    u NUMERIC(9,6) NOT NULL,
    v NUMERIC(9,6) NOT NULL,
    ra NUMERIC(5,2) NOT NULL,
    r1 NUMERIC(5,2) NOT NULL,
    r2 NUMERIC(5,2) NOT NULL,
    r3 NUMERIC(5,2) NOT NULL,
    r4 NUMERIC(5,2) NOT NULL,
    r5 NUMERIC(5,2) NOT NULL,
    r_ratio NUMERIC(5,2) NOT NULL,
    g_ratio NUMERIC(5,2) NOT NULL,
    b_ratio NUMERIC(5,2) NOT NULL
);

insert INTO reading_list 
(barcode, test_time_date, cct_k, x, y, u, v, ra, r1, r2, r3, r4, r5, r_ratio, g_ratio, b_ratio) 
values ('1234567890', NOW(), 6500, 0.3127, 0.3290, 0.2009, 0.4610, 90.00, 95.00, 85.00, 80.00, 75.00, 70.00, 20.00, 30.00, 50.00);
