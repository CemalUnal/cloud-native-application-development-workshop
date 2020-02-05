package io.github.cemalunal.backend.controller;

import io.github.cemalunal.backend.model.Customer;
import io.github.cemalunal.backend.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
public class CustomerController {

    private Logger logger = Logger.getLogger(CustomerController.class.getName());

    private final CustomerService customerService;

    @Autowired
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @RequestMapping(method = RequestMethod.GET, value = "/customers")
    public List<Customer> getAllCustomers() {
        logger.info("GET ALL CUSTOMERS");
        return customerService.getCustomers();
    }

    @RequestMapping(method = RequestMethod.POST, value = "/save")
    public String saveCustomer(@RequestBody Customer customer) {
        logger.info("SAVE NEW CUSTOMER " + customer.getName());
        customerService.saveCustomer(customer);
        return "New customer " + customer.getName() + " saved to database.";
    }

    @RequestMapping(method = RequestMethod.DELETE, value = "/delete/{customerId}")
    public String deleteCustomer(@PathVariable("customerId") String customerId) {
        logger.info("DELETE CUSTOMER " + customerId);
        customerService.deleteCustomer(customerId);
        return "Customer " + customerId + " deleted.";
    }

}
