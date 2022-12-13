pipeline {
    agent { docker { image 'node:16.17.1-alpine', args: '-p 3000:3000' } }
    environment { CI = 'true' }
    stages {
        stage('build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh './jenkins/scripts/test.sh'
            }
        }
    }
}
