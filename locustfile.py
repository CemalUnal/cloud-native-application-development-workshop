from locust import HttpLocust, TaskSet, between
import json

body = {
  "name": "string"
}

headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}

def get(l):
    l.client.get("/api/demo-backend/customers")

def save(l):
    l.client.post("/api/demo-backend/customers", data=json.dumps(body), headers=headers)

class UserBehavior(TaskSet):
    tasks = {get: 2, save: 1}

class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    wait_time = between(5, 9)
