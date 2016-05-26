cd www\jason
START /W pm2 delete jason
START /W npm install
START /W pm2 start process.json