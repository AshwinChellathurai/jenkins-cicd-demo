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
            environment {
                // Use Minikube kubeconfig stored as Secret File in Jenkins
                KUBECONFIG = credentials('minikube-kubeconfig')
            }
            steps {
                sh """
                    echo "Using kubeconfig at: \$KUBECONFIG"
                    kubectl get nodes
                    kubectl set image deployment/nodejs-demo nodejs-demo=$IMAGE_NAME:$BUILD_NUMBER --record
                """
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
    }
}

