run-dev:
	docker-compose -f docker-compose-dev.yml up -d --build
down-dev:
	docker-compose -f docker-compose-dev.yml down
run-prod:
	docker-compose -f docker-compose-prod.yml up -d --build
down-prod:
	docker-compose -f docker-compose-prod.yml down
