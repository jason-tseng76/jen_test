method 1
before build:
source files : **.*; **/**.*
exec command : cmd /c "pm2 delete jason"
after build:
exec command : cmd /c "cd www\jason & npm install & pm2 start process.json"


git init
git remote add projectname add https://..../project.git
git pull projectname master


cmd /c "d: & cd /www/jason & pm2 delete jason & git init & git remote add jason https://github.com/jason-tseng76/jen_test.git & git pull jason master & npm install & pm2 start process.json"