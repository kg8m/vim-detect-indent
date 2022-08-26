.DEFAULT_GOAL := help

DENO_TEST_FILES := $$(find test/denops -type f -name '*_test.ts')
ALL_DENO_FILES := $$(find denops test/denops -type f -name '*.ts')

HELP_SEPARATOR := ＠

.PHONY: help
help:  ## Show help
	@cat $(MAKEFILE_LIST) | \
		grep -E '^[-a-z]+:' | \
		sed -e 's/:.*## /$(HELP_SEPARATOR)/' | \
		column -t -s $(HELP_SEPARATOR)

.PHONY: fmt
fmt:  ## Format deno files
	deno fmt ${ALL_DENO_FILES}

.PHONY: fmt-check
fmt-check:  ## Check if deno files are formatted
	deno fmt ${ALL_DENO_FILES} --check

.PHONY: lint
lint:  ## Lint deno files
	deno lint ${ALL_DENO_FILES}

.PHONY: typecheck
typecheck:  ## Type-check deno files
	deno check --help > /dev/null 2>&1 && \
		deno check ${ALL_DENO_FILES} || \
		deno test ${ALL_DENO_FILES} --no-run

.PHONY: test-deno
test-deno:  ## Run deno tests
	deno test ${DENO_TEST_FILES} --allow-all --no-check --jobs

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
