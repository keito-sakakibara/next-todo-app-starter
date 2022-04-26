.PHONY: init
init:
	curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash
	hasura update-cli --version v2.2.1
	docker-compose build --no-cache
	make apply

# DB関係
.PHONY: drop
drop:
	docker-compose up -d db
	docker-compose exec db sh -c "PGPASSWORD=secret dropdb postgres -h db -U hasura"
	docker-compose rm -fsv db

.PHONY: create
create:
	docker-compose up -d db
	docker-compose exec db sh -c "PGPASSWORD=secret createdb postgres -h db -U hasura"
	docker-compose rm -fsv db

.PHONY: reset
reset:
	docker-compose down
	make drop
	make create
	make apply

# Hasura関係
.PHONY: console
console:
	hasura console --admin-secret=secret --no-browser --skip-update-check --endpoint=http://localhost:8888 --console-port=9999 --api-port=9998

.PHONY: apply
apply:
	make migrate
#	make seed
	make metadata

.PHONY: migrate
migrate:
	docker-compose up -d hasura
	until curl -s -o /dev/null http://127.0.0.1:8888/healthz; do sleep 1; done
	hasura migrate apply --database-name default --admin-secret=secret --skip-update-check

.PHONY: metadata
metadata:
	docker-compose up -d hasura
	until curl -s -o /dev/null http://127.0.0.1:8888/healthz; do sleep 1; done
	hasura metadata apply --admin-secret=secret --skip-update-check

.PHONY: seed
seed:
	docker-compose up -d hasura
	until curl -s -o /dev/null http://127.0.0.1:8888/healthz; do sleep 1; done
	hasura seed apply --database-name default --admin-secret=secret --skip-update-check
	HASURA_GRAPHQL_SEEDS_DIRECTORY=hasura/seeds_local hasura seed apply --database-name default --admin-secret=secret --skip-update-check
