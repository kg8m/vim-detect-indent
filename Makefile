.DEFAULT_GOAL := help

DENO_FILES := $$(find denops -type f -name '*.ts')
DENO_TEST_FILES := $$(find test/denops -type f -name '*.ts')

HELP_SEPARATOR := ＠

.PHONY: help
help:  ## Show help
	@cat $(MAKEFILE_LIST) | \
		grep -E '^[-a-z]+:' | \
		sed -e 's/:.*## /$(HELP_SEPARATOR)/' | \
		column -t -s $(HELP_SEPARATOR)

.PHONY: fmt
fmt:  ## Format deno files
	deno fmt ${DENO_FILES} ${DENO_TEST_FILES}

.PHONY: fmt-check
fmt-check:  ## Check if deno files are formatted
	deno fmt ${DENO_FILES} ${DENO_TEST_FILES} --check

.PHONY: lint
lint:  ## Lint deno files
	deno lint ${DENO_FILES} ${DENO_TEST_FILES}

.PHONY: type-check
type-check:  ## Type-check deno files
	# `deno check` isn't available with older deno.
	# deno check ${DENO_FILES} ${DENO_TEST_FILES}
	deno test ${DENO_FILES} ${DENO_TEST_FILES} --no-run

.PHONY: test-deno
test-deno:  ## Run deno tests
	deno test ${DENO_TEST_FILES} --allow-all --no-check --jobs

.PHONY: cache
cache:  ## Cache deno dependencies
	deno cache ${DENO_FILES} ${DENO_TEST_FILES}

.PHONY: deps-update
deps-update:  ## Update deno dependencies
	deno run --allow-all https://deno.land/x/udd@0.7.2/main.ts ${DENO_FILES} ${DENO_TEST_FILES}
	make cache
	make fmt

.PHONY: check-all
check-all: fmt-check lint type-check test-deno  ## Check files and run tests
