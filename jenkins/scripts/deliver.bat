echo "Inside deliver file"
docker build -t node-jenkins:latest .
echo "Build and start commands executed successfully"
echo "Visit http://localhost:3000/api/courses/get in Postman to run your API"