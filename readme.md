## [The Latvian Museum of Natural History ](https://www.dabasmuzejs.gov.lv/) - Birds of Latvia
Web application for 1024x768 touchscreen device. Complementing Bids of Latvija showcase with various information provided for each species of birds.

How to set up and build this project:

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
2) Start docker container
```
docker-compose up -d
```
3) Enjoy some of the finest birds found on planet:  http://thebirds.local:81/1
4) Test 1024x768 iframe'd window: http://thebirds.local:81/test.htm

**Dependencies**
- vue
- vue-resource
- howler
- velocity-animate

https://github.com/houseofbits/THEBIRDS

Krists Pudzens©2019/2020

kpudzens@gmail.com
