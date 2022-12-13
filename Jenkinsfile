pipeline {
    agent { any { image 'node:16.17.1-alpine' args '-p 3000:3000' } }
    environment { CI = 'true' }
    stages {
        stage('build') {
            steps {
                bat 'npm install'
            }
        }
        stage('test') {
            steps {
                bat './jenkins/scripts/test.bat'
            }
        }
    }
}
