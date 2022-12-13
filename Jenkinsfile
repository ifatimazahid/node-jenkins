pipeline {
    environment { CI = 'true' }
    stages {
        stage('build') {
            steps {
                bat 'npm install'
            }
        }
        stage('test') {
            steps {
                // bat 'npm test'
                bat './jenkins/scripts/test.bat'
            }
        }
        stage('deliver') {
            agent {
                docker {
                    image 'node:16.17.1-alpine'
                }
      }
            steps {
                bat './jenkins/scripts/deliver.bat'
                input message: 'Finished?'
                bat './jenkins/scripts/kill.bat'
            }
        }
    }
}