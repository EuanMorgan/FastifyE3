echo "Pulling from git..."
git pull

echo "Building..."
docker-compose up -d --build