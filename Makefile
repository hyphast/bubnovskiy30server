run-dev:
	docker-compose -f docker-compose-dev.yml up -d --build
down-dev:
	docker-compose -f docker-compose-dev.yml down
build-prod:
	docker-compose -f docker-compose-prod.yml build
run-prod:
	docker-compose -f docker-compose-prod.yml up -d --build
down-prod:
	docker-compose -f docker-compose-prod.yml down
push-prod:
	docker push hyphast/bub30server
	docker push hyphast/bub30admin
	docker push hyphast/bub30web
	docker push hyphast/bub30nginx
send-env:
	scp .production.env ssh bub30:/root/bubnovskiy30server
	scp D:\Projects\bubnovskiy30\.env.production ssh bub30:/root/bubnovskiy30
	scp D:\Projects\bubnovskiy30\.env.production ssh bub30:/root/bubnovskiy30
