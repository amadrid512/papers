This is a template for starting a new React project.

To use this code for a new project
1. Use the clone or download button in github and choose the
download ZIP option.  
2. Extract that file into the folder where you keep your react projects
3. Rename the folder to a new project name
4. Open the project folder in visual studio code
5. Edit the project name in package.json
6. You'll need to run npm install before running the app.
7. Go to the versioning tab in vs code and initialize a new git repo

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

It has the following npm packages installed...
* [bootstrap](https://getbootstrap.com/)
* [react-router](https://reacttraining.com/react-router/)
* [primereact](https://www.primefaces.org/primereact/)
* [react-icons](https://github.com/react-icons/react-icons)
* [formik](https://jaredpalmer.com/formik/)  (for forms)
* [yup](https://github.com/jquense/yup)  (for forms)

It also includes restHelpers.js which is a library of helper functions we've created to aid fetching data from rest endpoints and dealing with crud endpoints.

I've inluded some example react pages
* An index.js page with react-router code for the following pages
* A List page using restHelpers.js to fetch data from appccc.whi.org
* A Detail page called by the list page that gets parameters from react-router


Generic React info

## Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
