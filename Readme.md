# ElectronAngular

This sample application demonstrate how to create a desktop application using Angular JS and Github Electron.

#Config database:
edit Connection URL to database PostgreSQL in db/db.js and app/scripts/goods/goodsService.js

-----
    node db/db.js

#Install
--- 

Install dependencies.

```
	npm install
```

Install bower dependencies 

```
	bower install
```

Install Application dependencies:

Change directory to ```app``` folder, then run

```
npm install
```


#Run 
---


Run your application by entering following command in your command prompt

```
	gulp run
```

#Release
---

You can get the release version with following command:

```
gulp build-electron
```


