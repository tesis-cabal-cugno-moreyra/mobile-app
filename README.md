# sicoin-mobile-app

## Project setup
```
yarn install
```

Update apps structure
```
npx cap sync
```

Add this, at the root of your repo, with the name `capacitor.config.json`
```
{"appId":"com.utn.sicoin","appName":"Sicoin","bundledWebRuntime":false,"webDir":"dist","linuxAndroidStudioPath": "route/to/your/android/studio"}
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and hot-reloads for development (with Capacitor)
```
yarn capacitor:serve
```

### Compiles and minifies for production
```
yarn build
```

### Compiles and minifies for production (with Capacitor)
```
yarn capacitor:build
```
### Lints and fixes files
```
yarn lint
```
