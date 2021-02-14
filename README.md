# ABX
Web application for creating and conducting AB and ABX listening tests.

## Deployment
Read on if you're interested in deploying and hosting ABX yourself.

### Deploy with Docker
```bash
docker run -d \
-v /abx:/abx \
-e NODE_ENV=production \
-e HTTP_PORT=80 \
-e HTTPS_PORT=443 \
-e SSL_CERT_PATH=/etc/letsencrypt/live/example.com/fullchain.pem \
-e SSL_PRIVATE_KEY_PATH=/etc/letsencrypt/live/example.com/privkey.pem \
-e DKIM_PRIVATE_KEY_PATH=/abx/dkim.key \
-e DKIM_SELECTOR=selector \
-e EMAIL_FROM_ADDRESS=noreply@example.com \
--restart on-failure \
jaakkopasanen/abx:latest
```

### Docker build and push
Build your own Docker image if you don't want to use one from jaakkopasanen. Docker build includes production build of
the React app and all other necessary steps.
```bash
docker build -t yourdockerhubusername/abx:latest
docker push yourdockerhubusername/abx:latest
```

## Development
Read on if you're interested in developing ABX.

### Dev Server
```
npm start
```
Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

### Tests
```
npm test
```
Launches the test runner in the interactive watch mode.

### Production
```
npm run build
```
Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the
build for the best performance.

The build is minified and the filenames include the hashes. ABX is ready to be deployed!
