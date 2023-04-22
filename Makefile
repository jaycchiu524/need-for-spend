mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
current_dir := $(notdir $(patsubst %/,%,$(dir $(mkfile_path))))
envfile := ./.env

.PHONY: help start debug debug-build logs stop clear-db

# help target adapted from https://gist.github.com/prwhite/8168133#gistcomment-2278355
TARGET_MAX_CHAR_NUM=15

## Show help
help:
	@echo ''
	@echo 'Usage:'
	@echo '  make <target>'
	@echo ''
	@echo 'Targets:'
	@awk '/^[a-zA-Z_0-9-]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")-1); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "  %-$(TARGET_MAX_CHAR_NUM)s %s\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)

## Start the services
start: $(envfile) 
	@echo "Starting Docker services (this may take a few minutes)"
	docker-compose up --build --detach

## Start and build the services in debug mode
debug-build: $(envfile)
	@echo "Starting building services (this may take a few minutes if there are any changes)"
	docker-compose -f docker-compose.debug.yml up --build --detach

## Start the services in debug mode
debug: $(envfile)
	@echo "Starting services (this may take a few minutes if there are any changes)"
	docker-compose -f docker-compose.debug.yml up --detach

## Stop the services
stop:
	docker-compose down
	docker volume rm $(current_dir)_{client,server}_node_modules 2>/dev/null || true

## Show the service logs (services must be running)
logs:
	docker-compose logs --follow

clear-db: stop
	docker volume rm $(current_dir)_mysql_{sandbox,development}_data 2>/dev/null || true
