package io.github.cemalunal.backend.repository;

import io.github.cemalunal.backend.model.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CustomerRepository extends MongoRepository<Customer, String> {

}