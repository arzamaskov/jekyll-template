JEKYLL_VERSION=4

up:
	docker compose up -d --build

build:
	docker compose build

down:
	docker compose down --remove-orphans

logs:
	docker compose logs -f

shell:
	docker compose exec jekyll sh
