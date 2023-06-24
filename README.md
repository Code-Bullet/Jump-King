# Code Bullet's Jump-King

Basically stuff from <a href="https://www.youtube.com/watch?v=DmQ4Dqxs0HI"> the YouTube video.</a> Watch the video first then buy <a href="https://store.steampowered.com/app/1061090/Jump_King/">the game on steam, and then and only then you can run this stuff.</a>

# How to run it:
## 1st - Download the files

Green button on the right, or:

`git clone "https://github.com/Code-Bullet/Jump-King"`
</br>
</br>

## 2nd - server

p5 library requires to be on server to run, otherwise (this happend in my case) the game won't boot.


There is nice <a href="https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb/related?hl=en"> extension for Chrome </a> which you can set up and use,
or you can use php dev tools which can run pretty simple and useful server which is nice (this is only for Linux, no idea how it works for µ$oft, or Macintosh OS):

`sudo apt install php #Or pacman or whatever` </br>
`php -S localhost:8000 -t /home/xses/Games/JumpKing/Jump-King/ #Change the path, so it points to directory with index.htm`

You can use RunME.sh to boot it automatically.
</br>
</br>


## 3rd - PLAY THE GAME!

Just go to http://localhost:8000/ from whatever browser you want.
