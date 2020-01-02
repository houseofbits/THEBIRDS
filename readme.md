## [Latvijas Dabas Muzejs](https://www.dabasmuzejs.gov.lv/) Ekspozīcija "Latvijas putni"

**Set up development environment**
1) Install docker, docker-compose, Node.js/npm
2) Clone repo
```
git clone https://github.com/houseofbits/THEBIRDS thebirds
```
3) Install dependencies
```
npm install
```
4) Create hosts file entry
```
0.0.0.0 thebirds.local
```
5) Run dev server
```
npm run serve
```

**Build and test production version**
1) Run build
```
npm run build
```
2) Start dosker container (http://thebirds.local:81)
```
docker-compose up -d
```

**App built using**
- vue
- vue-resource
- howler
- velocity-animate

https://github.com/houseofbits/THEBIRDS

Krists Pudzens©2019/2020

kpudzens@gmail.com
