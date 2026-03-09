UI_DIR   = ui
STATIC   = static
TEMPL    = $(wildcard templ_*.templ)

.PHONY: all clean deps build-ui templ site watch

all: deps build-ui templ

deps:
	cd $(UI_DIR) && npm install

build-ui:
	cd $(UI_DIR) && npm run build
	cp $(UI_DIR)/dist/printing-press.js $(STATIC)/printing-press.js

templ:
	cd .. && templ generate $(addprefix printingpress/,$(TEMPL))

site:
ifndef SPEC
	$(error SPEC is required: make site SPEC=/path/to/openapi.yaml OUT=/tmp/output TITLE="My API")
endif
ifndef OUT
	$(error OUT is required: make site SPEC=/path/to/openapi.yaml OUT=/tmp/output TITLE="My API")
endif
ifndef TITLE
	$(error TITLE is required: make site SPEC=/path/to/openapi.yaml OUT=/tmp/output TITLE="My API")
endif
	cd .. && rm -rf $(OUT) && go run ./printingpress/cmd/press/main.go \
		-spec $(SPEC) $(if $(BASEPATH),-base-path $(BASEPATH)) -out $(OUT) -title "$(TITLE)"

watch:
ifndef SPEC
	$(error SPEC is required: make watch SPEC=/path/to/openapi.yaml OUT=/tmp/output TITLE="My API")
endif
ifndef OUT
	$(error OUT is required: make watch SPEC=/path/to/openapi.yaml OUT=/tmp/output TITLE="My API")
endif
ifndef TITLE
	$(error TITLE is required: make watch SPEC=/path/to/openapi.yaml OUT=/tmp/output TITLE="My API")
endif
	$(eval PP_DIR := $(shell pwd))
	@echo "Watching $(UI_DIR)/src for changes..."
	@fswatch -o $(UI_DIR)/src | while read; do \
		echo "--- change detected, rebuilding ---"; \
		(cd $(PP_DIR)/$(UI_DIR) && npm run build --silent 2>&1) \
		&& cp $(PP_DIR)/$(UI_DIR)/dist/printing-press.js $(PP_DIR)/$(STATIC)/printing-press.js \
		&& (cd $(PP_DIR)/.. && go run ./printingpress/cmd/press/main.go \
			-spec $(SPEC) $(if $(BASEPATH),-base-path $(BASEPATH)) -out $(OUT) -title "$(TITLE)" 2>&1) \
		&& echo "--- done ---" \
		|| echo "--- build failed ---"; \
	done

clean:
	rm -rf $(UI_DIR)/node_modules $(UI_DIR)/dist
