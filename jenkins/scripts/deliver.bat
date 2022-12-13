echo "Inside deliver file"
docker build --tag node-docker
docker run --publish 8000:8000 node-docker
echo "Build and start commands executed successfully"
echo "Visit http://localhost:3000/api/courses/get in Postman to run your API"