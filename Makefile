.DEFAULT_GOAL := help
HELP_SEPARATOR := ＠

FIXTURES_DIRPATH := test/fixtures/
ALL_DENO_FILES := $$(find . -type f -name '*.ts' -not -path '*${FIXTURES_DIRPATH}*')

.PHONY: help
help:  ## Show help
	@cat $(MAKEFILE_LIST) | \
		grep -E '^[-a-z]+:' | \
		sed -e 's/:.*## /$(HELP_SEPARATOR)/' | \
		column -t -s $(HELP_SEPARATOR)

.PHONY: fmt
fmt:  ## Format files
	deno fmt --ignore=${FIXTURES_DIRPATH}

.PHONY: fmt-check
fmt-check:  ## Check if files are formatted
	deno fmt --ignore=${FIXTURES_DIRPATH} --check

.PHONY: lint
lint:  ## Lint deno files
	deno lint --ignore=${FIXTURES_DIRPATH}

.PHONY: typecheck
typecheck:  ## Type-check deno files
	deno check ${ALL_DENO_FILES}

.PHONY: test-deno
test-deno:  ## Run deno tests
	deno test --allow-all --parallel

.PHONY: cache
cache:  ## Cache deno dependencies
	deno cache ${ALL_DENO_FILES}

.PHONY: update-deps
update-deps:  ## Update deno dependencies
	deno run --allow-all https://deno.land/x/udd@0.7.2/main.ts ${ALL_DENO_FILES}
	make cache
	make fmt

.PHONY: check-all
check-all: fmt-check lint typecheck test-deno  ## Check files and run tests

.PHONY: all
all: update-deps check-all  ## Update deps, check files, and run tests
