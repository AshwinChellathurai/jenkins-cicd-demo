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
                sh """
                    echo "Building Docker image: $IMAGE_NAME:$BUILD_NUMBER"
                    docker build -t $IMAGE_NAME:$BUILD_NUMBER .
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                                                  usernameVariable: 'DOCKER_USER',
                                                  passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo "Logging in to Docker Hub"
                        echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                        echo "Pushing Docker image: $IMAGE_NAME:$BUILD_NUMBER"
                        docker push $IMAGE_NAME:\$BUILD_NUMBER
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            environment {
                // Use standalone kubeconfig secret (with embedded certs)
                KUBECONFIG = credentials('minikube-kubeconfig')
            }
            steps {
                sh """
                    echo "Using kubeconfig at: \$KUBECONFIG"
                    echo "Checking Kubernetes nodes..."
                    kubectl get nodes
                    echo "Updating deployment image..."
                    kubectl set image deployment/nodejs-demo nodejs-demo=$IMAGE_NAME:$BUILD_NUMBER --record
                """
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
    }
}
