method 1
before build:
source files : **.*; **/**.*
exec command : cmd /c "pm2 delete jason"
after build:
exec command : cmd /c "cd www\jason & npm install & pm2 start process.json"


git init
git remote add projectname add https://..../project.git
git pull projectname master
