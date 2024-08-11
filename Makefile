FRONT_DIR=frontend
BACKEND_DIR=backend

clean: down-docker remove-files

up-docker: clean-backend
	docker compose up -d --build --remove-orphans 

down-docker: 
	docker compose --profile app down
	docker compose --profile load-test down

remove-files:
	rm -rf ./artillery/report.html
	rm -rf ./artillery/report.json
	rm -rf $(FRONT_DIR)/node_modules
	rm -rf $(BACKEND_DIR)/blob
	rm -rf $(BACKEND_DIR)/coverage
	rm -rf $(BACKEND_DIR)/node_modules
	rm -rf $(BACKEND_DIR)/dist

run-backend: clean
	docker compose --profile app up -d

run-test-load: clean
	docker compose --profile load-test up --build --remove-orphans --abort-on-container-exit
	docker compose --profile report up --build --remove-orphans --abort-on-container-exit
	npx open-cli $(PWD)/artillery/report.html

run-test-e2e: clean
	cd $(BACKEND_DIR) && npm install && npm run test:vite:e2e
	npx open-cli $(BACKEND_DIR)/coverage/index.html

run-all: run-backend 
	cd $(FRONT_DIR) && npm install
	cd $(FRONT_DIR) && npx open-cli http://localhost:5173 && npm run dev 
	