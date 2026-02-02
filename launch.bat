@echo off
"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" ^
  --dbpath "C:\data\db" ^
  --bind_ip 127.0.0.1
pause