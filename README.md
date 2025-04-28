# Healthcare Appointments Microservices Application

This application is configured as a microservices architecture using Kubernetes for orchestration. The application consists of three main services:

1. **Frontend Service**: React application served through Nginx
2. **Backend Service**: Express.js API
3. **Database Service**: MongoDB

## Kubernetes Deployment with Colima

### Prerequisites

- macOS (as Colima is designed for macOS)
- [Colima](https://github.com/abiosoft/colima) installed
- kubectl CLI tool
- Docker
- jq (for JSON processing)

### Installation

If you don't have the prerequisites installed, you can install them using Homebrew:

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install prerequisites
brew install colima docker kubectl jq
```

### Deployment Steps

1. Make the deployment script executable:
   ```bash
   chmod +x kubernetes/deploy.sh
   ```

2. Run the deployment script:
   ```bash
   ./kubernetes/deploy.sh
   ```

3. The script will:
   - Start Colima with Kubernetes if it's not already running
   - Build the necessary Docker images
   - Deploy all services to your Kubernetes cluster
   - Configure routing through an Ingress controller

4. Access the application:
   - Add the Colima IP to your hosts file pointing to `healthcare.local`
   - Access the application at http://healthcare.local
   - Alternatively, use port forwarding as suggested by the script

### Manual Deployment

You can also deploy each component individually:

```bash
# Start Colima with Kubernetes
colima start --kubernetes

# Apply ConfigMap
kubectl apply -f kubernetes/config-map.yaml

# Deploy MongoDB
kubectl apply -f kubernetes/mongodb-deployment.yaml

# Deploy Backend API
kubectl apply -f kubernetes/backend-deployment.yaml

# Deploy Frontend
kubectl apply -f kubernetes/frontend-deployment.yaml

# Configure Ingress
kubectl apply -f kubernetes/ingress.yaml
```

### Kubernetes Architecture

The application in Kubernetes consists of:

- **Deployments** for each service with multiple replicas for high availability
- **Services** for internal service discovery and load balancing
- **PersistentVolumeClaim** for MongoDB data persistence
- **Ingress** for external access and routing
- **ConfigMap** for configuration management

## API Endpoints

### Appointments

- `GET /api/appointments` - List all appointments
- `POST /api/appointments` - Create a new appointment
- `GET /api/appointments/:id` - Get a specific appointment
- `PUT /api/appointments/:id` - Update an appointment
- `DELETE /api/appointments/:id` - Delete an appointment

### Meetups

- `GET /api/meetups` - List all meetups
- `POST /api/meetups` - Create a new meetup
- `GET /api/meetups/:id` - Get a specific meetup

## Scaling

With Kubernetes, you can easily scale any component:

```bash
# Scale the backend to 3 replicas
kubectl scale deployment/backend --replicas=3
```

## Monitoring and Logs

```bash
# Get pod status
kubectl get pods

# View logs for a specific service
kubectl logs -l app=backend

# Stream logs from all frontend pods
kubectl logs -f -l app=frontend
```

## Troubleshooting

- If you encounter connection issues, check pod status: `kubectl get pods`
- Verify services are running: `kubectl get svc`
- Check Ingress configuration: `kubectl describe ingress healthcare-ingress`
- View detailed logs: `kubectl logs <pod-name>`
- For Colima-specific issues: `colima status` or `colima logs`

### Ingress Controller Setup

If the Ingress controller is not automatically deployed with Colima, you can install it manually:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
```
