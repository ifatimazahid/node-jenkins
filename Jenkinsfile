pipeline {
    agent none
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
            steps {
                bat './jenkins/scripts/deliver.bat'
                input message: 'Finished?'
                bat './jenkins/scripts/kill.bat'
            }
        }
    }
}