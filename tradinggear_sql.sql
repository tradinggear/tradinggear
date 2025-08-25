create table tradinggear_member (
  idx int(11) not null primary key auto_increment,
  id_email varchar(100) null,
  pwd varchar(255) null,
  full_name varchar(200) null,
  nick_name varchar(200) null,
  api_key varchar(255) null,
  trading_center varchar(200) null,
  grade varchar(100) null
)