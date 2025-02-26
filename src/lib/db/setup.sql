drop table if exists reservation_requests;

create table if not exists reservation_requests (
  id integer primary key autoincrement,
  email text not null,
  "name" text not null,
  additional_guests integer not null default 0,
  notes text default '',
  created_on timestamp not null default current_timestamp
);

create index idx_reservation_requests_email ON reservation_requests (email);
