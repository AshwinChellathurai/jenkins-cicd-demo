pipeline {
    agent any

    environment {
        IMAGE_NAME = "ashwin1999/nodejs-demo"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/AshwinChellathurai/jenkins-cicd-demo'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $IMAGE_NAME:$BUILD_NUMBER ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                // Use withCredentials for safe handling of Docker Hub username & password
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', 
                                                  usernameVariable: 'DOCKER_USER', 
                                                  passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                        docker push $IMAGE_NAME:\$BUILD_NUMBER
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh """
                    kubectl set image deployment/nodejs-demo nodejs-demo=$IMAGE_NAME:$BUILD_NUMBER --record
                """
            }
        }
    }

    post {
        always {
            // Logout from Docker Hub to avoid leaving credentials in the session
            sh 'docker logout'
        }
    }
}
