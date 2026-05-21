pipeline {
    agent any

    environment {

        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')

        DOCKERHUB_USERNAME = "ironfang26"

        PROJECT_IMAGE = "ironfang26/project:latest"

        AWS_DEFAULT_REGION = "us-west-2"
    }

    stages {

        stage('Checkout Code') {
            steps {

                git branch: 'main',
                url: 'https://github.com/youngbuddah/project123.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                    sh '''
                    docker build -t $PROJECT_IMAGE .
                    '''
                }
            }
        }

         stage('Test') {
            steps {
                script {
                    dockerImage.inside {
                         // Set execute permissions for node_modules/.bin
                        sh 'chmod +x node_modules/.bin/mocha'
                        sh 'npm test'
                    }
                }
            }
        }

        stage('DockerHub Login') {
            steps {

                sh '''
                echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
                '''
            }
        }

        stage('Push Project Image') {
            steps {

                sh '''
                docker push $PROJECT_IMAGE
                '''
            }
        }

        stage('Deploy To EKS Kubernetes Cluster') {
            steps {

                sh '''
                kubectl apply -f k8s-deployment.yaml
                '''
            }
        }

        stage('Verify Kubernetes Deployment') {
            steps {

                sh '''
                kubectl get deployments
                kubectl get pods
                kubectl get svc
                '''
            }
        }
    }

    post {

        success {

            echo 'CI/CD Pipeline Executed Successfully'
        }

        failure {

            echo 'CI/CD Pipeline Failed'
        }
    }
}
